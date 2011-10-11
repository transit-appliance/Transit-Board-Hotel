/*
   Copyright 2010-2011 Portland Transport

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

/* TransitBoard is the reference application for the trArr.js arrivals API */

var transitBoard = {}; // keep state

transitBoard.paging_state = {}; // paging state
transitBoard.paging_state.next_row = undefined;
transitBoard.paging_state.page_number = 0;
transitBoard.standing_messages = new Array;
transitBoard.connection_health = 1;
transitBoard.service_messages = [];
transitBoard.minutes_limit = 0;
transitBoard.arrivals_limit = 0;

transitBoard.standing_messages.push("TransitBoard&trade; is a product of Portland Transport. Learn more at http://transitappliance.com.");


transitBoard.initializePage = function(data) {	

	// kill the logging element
	jQuery("#arrivals_log_area").remove();
	
	if (data.optionsConfig.banner != undefined && data.optionsConfig.banner[0] != undefined) {
		document.title = "Transit Board(tm) for "+data.optionsConfig.banner[0];
	}
	
	if (data.optionsConfig.minutes_limit != undefined && data.optionsConfig.minutes_limit[0] != undefined && data.optionsConfig.minutes_limit[0] != 0) {
		transitBoard.minutes_limit = data.optionsConfig.minutes_limit[0];
	}
	if (transitBoard.minutes_limit == 0) {
		transitBoard.minutes_limit = 60;
	}
	
	if (data.optionsConfig.arrivals_limit != undefined && data.optionsConfig.arrivals_limit[0] != undefined && data.optionsConfig.arrivals_limit[0] != 0) {
		transitBoard.arrivals_limit = data.optionsConfig.arrivals_limit[0];
	}
	
	if (data.optionsConfig.ping != undefined && data.optionsConfig.ping[0] != undefined) {
		transitBoard.ping = function() {		
			jQuery.ajax({
  			url: "assets/img/ping.png",
  			cache: false
			});
			setTimeout("transitBoard.ping()",data.optionsConfig.ping[0]*1000);
		}
		// create a ping (to keep internet connections open) every specified number of seconds
		transitBoard.ping();
	}
	
	// add stylesheet

	if (data.optionsConfig.stylesheet != undefined && data.optionsConfig.stylesheet[0] != undefined) {
		var link = jQuery("<link>");
		link.attr({
			type: 'text/css',
		  rel: 'stylesheet',
		  href: data.optionsConfig.stylesheet[0]
		});
		jQuery("head").append( link ); 
		
	}
	
	var font_scale_factor = 1;
	if (data.optionsConfig['font-size-adjust'] != undefined && data.optionsConfig['font-size-adjust'][0] != undefined) {
		font_scale_factor = data.optionsConfig['font-size-adjust'][0]/100;
	}
	
	
	// set sizes
	var window_height = jQuery(window).height();
	var basic_text = Math.floor(font_scale_factor*window_height/30) + "px";
	var large_text = Math.floor(font_scale_factor*window_height/20) + "px";
	var padding    = Math.floor(font_scale_factor*window_height/100) + "px";
	var scroller_height = (Math.floor(font_scale_factor*window_height/30)+Math.floor(font_scale_factor*window_height/100)) + "px";
	
	// bigger fonts for wider displays
	if (jQuery(window).width()/jQuery(window).height() > 1.4) {
		window_height = jQuery(window).height();
		basic_text = Math.floor(font_scale_factor*window_height/22) + "px";
		large_text = Math.floor(font_scale_factor*window_height/14) + "px";
		padding    = Math.floor(font_scale_factor*window_height/100) + "px";
		scroller_height = (Math.floor(font_scale_factor*window_height/22)+Math.floor(font_scale_factor*window_height/100)) + "px";
	}
	

	jQuery("head").append(jQuery('\
		<style>\
			td { font-size: '+basic_text+'; padding: '+padding+'; }\
			h1 { font-size: '+large_text+'; margin-bottom: '+padding+'; }\
			body { overflow: hidden }\
		</style>\
	'));
	
	// get the rights strings
	for (var agency in data.stopsConfig) {
		transitBoard.standing_messages.push(data.agencyCache.agencyData(agency).rights_notice);
	}
	transitBoard.standing_messages.push("When no real-time estimate is available, scheduled arrival time is shown in HH:MM.");
	if (data.applianceConfig != undefined && data.applianceConfig.id != undefined && data.applianceConfig.id[0] != undefined) {
    transitBoard.standing_messages.push("["+data.applianceConfig.id[0]+"]");
  }

	
	var initial_ticker_string = transitBoard.standing_messages.join(" &mdash; ");
	
	// create divs for main display area and scroller
	
	jQuery('#arrivals_display_area').html('\
<div id="tb_top"></div>\
<table id="tb_bottom"><tr><td id="tb_clock"></td><td id="tb_ticker"><div class="scroller"><div class="scrollingtext"></div></div></td></tr></table>\
<div id="tb_phantom"></div>\
<div id="tb_opaque"></div>\
	');
	
	// populate initial HTML
	jQuery('#tb_top').html('\
<h1>&nbsp;Transit Board&trade; for '+data.optionsConfig.banner[0]+'</h1>\
\
<div id="replace_this">\
<table>\
<tr><td>One moment while we gather the transit system information...</td></tr>\
\
</table>\
</div>\
	');
	
	// figure out how many rows per page
	transitBoard.paging_state.rows_per_page = 8; // default
	if (data.optionsConfig.opt_rows_per_page != undefined && data.optionsConfig.opt_rows_per_page[0] != undefined) {
		transitBoard.paging_state.rows_per_page = data.optionsConfig.opt_rows_per_page[0];
	}
	transitBoard.paging_state.previous_html = "";
	
	//jQuery('#debug_area').append("<PRE>Initializing</PRE>");
	
	// set height of scroller

	jQuery(".scrollingtext").html(initial_ticker_string);
	var cell_width = jQuery("#tb_ticker").width();
	jQuery(".scroller").css("height",scroller_height);
	jQuery(".scroller").css("width",cell_width);
	//fire ticker
	
	var scroll_speed_factor = 1;
	if (data.optionsConfig['scroll-speed-adjust'] != undefined && data.optionsConfig['scroll-speed-adjust'][0] != undefined) {
		scroll_speed_factor = 100/data.optionsConfig['scroll-speed-adjust'][0];
	}
	
	var scroll_time = 140*scroll_speed_factor*initial_ticker_string.length;
	
	jQuery('.scrollingtext').bind('marquee', function() {
		var ob = jQuery(this);
		var tw = ob.width();
		var ww = ob.parent().width();
		ob.css({ left: ww });
		ob.animate({ left: -tw }, scroll_time, 'linear', function() {
			var messages = [];
			for (var i = 0; i < transitBoard.standing_messages.length; i++) {
				messages.push(transitBoard.standing_messages[i]);
			}
			// raw score: messages.push('<span style="font-weight: bold; color: red">['+transitBoard.connection_health+']</span>');
			if (transitBoard.connection_health < 0.2) {
				messages.push('<span style="font-weight: bold; color: red">This display has lost connectivity.</span>');
			} else if (transitBoard.connection_health < 0.5) {
				messages.push('<span style="font-weight: bold; color: red">This display is experencing severe connection issues.</span>');
			} else if (transitBoard.connection_health < 0.8) {
				messages.push('<span style="font-weight: bold; color: red">This display is experencing connection issues.</span>');
			}
			for (var i = 0; i < transitBoard.service_messages.length; i++) {
				messages.push('<span style="font-weight: bold; color: red">'+transitBoard.service_messages[i]+'</span>');
			}
			jQuery(".scrollingtext").html(messages.join(" &mdash; "));
			ob.trigger('marquee');
		});
	}).trigger('marquee');

}

transitBoard.displayPage = function(data) {
	
	if (transitBoard.paging_state.next_row == undefined || 
			transitBoard.paging_state.next_row == 0 || 
			transitBoard.paging_state.next_row >= transitBoard.paging_state.arrivalsQueue.length ||
			(data.optionsConfig.page_limit != undefined && data.optionsConfig.page_limit[0] != undefined && data.optionsConfig.page_limit[0] != 0 && data.optionsConfig.page_limit[0] <= transitBoard.paging_state.page_number)
	) {
		// we finished paging sequence previously, need to build a new page state
		
		// first, build a filtered copy of queue
		transitBoard.paging_state.arrivalsQueue = filter_queue(data.arrivalsQueue);
		
		// sort the rows
		function trArrCompareArrivals(a,b) {
			return a.arrivalTime - b.arrivalTime;
		}
		transitBoard.paging_state.arrivalsQueue.sort(trArrCompareArrivals);
		transitBoard.paging_state.next_row = 0;
		transitBoard.service_messages =  data.serviceMessages;
		transitBoard.paging_state.page_number = 0;
	}
	
	transitBoard.connection_health = data.connectionHealth;
	
	if (transitBoard.arrivals_limit !=0 && transitBoard.paging_state.arrivalsQueue.length > transitBoard.arrivals_limit) {
		transitBoard.paging_state.arrivalsQueue.length = transitBoard.arrivals_limit;
	}
	
	// set time 
        // Don't just use new Date() because time zone may be set wrong
	var client_time = localTime();
    var client_time_formatted = client_time.toString('h:mmtt');
    
	client_time_formatted = client_time_formatted.replace(/^0:/,'12:');
	jQuery('#tb_clock').html(client_time_formatted);
	
	// draw rows in page

	var return_array = buildArrivalsDisplayTable(transitBoard.paging_state.arrivalsQueue, transitBoard.paging_state.next_row);		
	var table = return_array[0];
	transitBoard.paging_state.next_row = return_array[1];	
	
	if (transitBoard.paging_state.previous_html != table) {
		transitBoard.paging_state.previous_html = table;
		jQuery("#replace_this").slideToggle(600, function(){
			jQuery("#replace_this").html(table);
		});					
		jQuery("#replace_this").slideToggle(600);
		transitBoard.paging_state.page_number++;
	}
	
}

function filter_queue(arrivalsQueue) {
					
	var now = localTime();
	now = now.getTime(); //milliseconds since epoch				
	
	var tmp_queue = [];
	// removes everything before now and greater than 24 hours from now
	for (var i = 0; i < arrivalsQueue.length; i++) {
		var milliseconds_until_arrival = arrivalsQueue[i].arrivalTime - now;
		if (milliseconds_until_arrival >= 0 && milliseconds_until_arrival <= 24*60*60*1000) {
			tmp_queue.push(arrivalsQueue[i]);
		}
	}

	// split rows into <= 60 min and > 60 min
	var next_hour = [];
	var later = [];
	for (var i = 0; i < tmp_queue.length; i++) {
		var milliseconds_until_arrival = tmp_queue[i].arrivalTime - now;
		if (milliseconds_until_arrival <= transitBoard.minutes_limit*60*1000) {
			next_hour.push(tmp_queue[i]);
		} else {
			later.push(tmp_queue[i]);
		}
	}

	if (next_hour.length > 0) {
		return next_hour;
	} else {
		return later;
	}

}

function buildArrivalsDisplayTable(arrivalsQueue,first_row) {			
				
	
	var row_count = arrivalsQueue.length - first_row;
	if (first_row >= arrivalsQueue.length) {
		row_count = 0;
	}
	
	// build out HTML for all rows remaining in Queue (not necessarily going to use them all)
	var table_rows = buildArrivalsDisplayTableRows(arrivalsQueue,first_row);
		
	var now = localTime().getTime();
				
	var timeclass = '';
	var rowclass = "odd";
	var table = '<table id="slide_this">';
	
	// table += '<thead><tr><th style="text-align: right">Time</th><th></th><th>Route</th><th>Board at</th></tr></thead>';
	table += '<tbody>';
	
	var next_row = arrivalsQueue.length; // past end
					
	if (row_count == 0) {
		table = table + '<tr class="'+rowclass+'"><td colspan="3">No arrival estimates available at this time.</td></tr>';
		if (transitBoard.connection_health < 0.2) {
			table = table + '<tr class="'+rowclass+'"><td colspan="3"><br><br><span style="font-weight: bold; color: red">This display has lost its internet connection!</span></td></tr>';
		}
	} else {
		
		// build a phantom table for height calculation purposes
		var phantom = jQuery("<table id='tb_phantom_table'>"+table_rows[first_row]+"</table>");
		jQuery("#tb_phantom").html("");
		jQuery("#tb_phantom").append(phantom);

		var max_available_height = jQuery("#tb_bottom").offset().top - jQuery("#replace_this").offset().top;
		
		for (var i = first_row; i < arrivalsQueue.length; i++) {
			
			if (i > first_row) {
				// add to phantom 
				jQuery("#tb_phantom_table").append(table_rows[i]);
				if (phantom.height() < max_available_height) {
					table += table_rows[i];
				} else {
					next_row = i;
					break;
				}
			} else {
				table += table_rows[i];
			}
				
		}
	}
	table = table + '</tbody></table>';
	return [table, next_row];
}

function buildArrivalsDisplayTableRows(arrivalsQueue,first_row) {	
	var rows = new Array;
	
	var now = localTime().getTime();
				
	var timeclass = '';
	var rowclass = "odd";
					

	for (var i = first_row; i < arrivalsQueue.length; i++) {
		
		var displayTime = "";
		var displayStop = arrivalsQueue[i].stop_data.stop_name;
		var milliseconds_until_arrival = arrivalsQueue[i].arrivalTime - now;
		
		var minutes_until_arrival = Math.round(milliseconds_until_arrival/60000);
		if (minutes_until_arrival == 0) {
			minutes_until_arrival = "Due";
		} else {
			minutes_until_arrival = "<nobr>"+minutes_until_arrival+" min</nobr>"; 
		}
		if (arrivalsQueue[i].type == 'scheduled') {
			timeclass = ' scheduled';
			var sched_date = localTime(arrivalsQueue[i].arrivalTime);
			displayTime = sched_date.toString('h:mmtt');
			displayTime = displayTime.replace(/^0:/,'12:');
		} else {
			displayTime = minutes_until_arrival;
			timeclass = "";
		}
		displayStop = displayStop.replace(/MAX Station/i, ""); // definite TriMet-ism
		var station = displayStop;
		if (station.length <= 21) {
			station = "<nobr>"+station+"</nobr>";
		}

		rows[i] = '<tr class="'+rowclass+'"><td class="tb_arrival'+timeclass+'">'+displayTime+'</td><td>&nbsp;&nbsp;</td><td class="tb_maincol">'+arrivalsQueue[i].headsign+'</td><td>'+station+'</td></tr>';
		//table = table + '<tr class="'+rowclass+'"><td class="tb_arrival'+timeclass+'">'+displayTime+'</td><td>&nbsp;</td><td class="tb_maincol">'+arrivalsQueue[i].headsign+' @ '+station+'</td></tr>';
		
		if (rowclass == "odd") {
			rowclass = "even";
		} else {
			rowclass = "odd";
		}

	}
	
	return rows;
}

				