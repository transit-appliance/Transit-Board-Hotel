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

/*
 * responsible for populating arrivals object for TriMet stops
*/

var trArrTriMetStreetStops = {
	"8989": "n23mar_d",
	"3596": "loven22",
	"3595": "loven21",
	"10751": "loven18",
	"10752": "loven13",
	"10753": "n11john",
	"10754": "n11glis",
	"10755": "n11eve",
	"10756": "n11cou",
	"9600": "s11ald",
	"9633": "s11tay",
	"10759": "s11jeff",
	"10760": "s11clay",
	"11011": "marspark",
	"10762": "mars5",
	"10763": "mons5",
	"12375": "sw3harr",
	"12376": "sw1harr",
	"12377": "swharrd",
	"12378": "swrivmo",
	"12760": "swmogibb_a",
	"12880": "moodgain",
	"12881": "lowell_d",
	"12882": "bondlane",
	"12883": "bondohsu",
	"12760": "swmogibb_d",
	"12379": "swrivmo_h",
	"12380": "swharrd",
	"12381": "sw1harr",
	"12382": "sw3harr",
	"10764": "shop",
	"10766": "milspark",
	"10765": "s10clay",
	"6493": "s10mad",
	"10767": "s10yam",
	"10768": "s10ald",
	"10769": "s10wash",
	"10770": "n10cou",
	"10771": "n10ev",
	"10772": "n10glis",
	"10773": "n10john",
	"10774": "n10mar",
	"12796": "nw12north",
	"10775": "northn14",
	"10776": "northn18",
	"10777": "northn21",
	"10778": "northn22"
};

function trArrTriMetBuildURL(stops) {
	var stop_list = new Array();
	for (var stop_id in stops) {
		stop_list.push(stop_id);
	}
	var stop_string = stop_list.join(',');
	return "http://developer.trimet.org/ws/V1/arrivals/?locIDs="+stop_string+"&appID=828B87D6ABC0A9DF142696F76&json=true";
}


function trArrTriMet(stops) {
	var url = trArrTriMetBuildURL(stops);
	var results = "";
	jQuery.ajax({
	  url: trArrTriMetBuildURL(stops),
	  dataType: 'jsonp',
	  cache: false,
	  success: function(data) {

	  	respObj = trArrMimicTable(data,stops);
	  	mode = respObj.mode;
			
			// see if we have Streetcar stops
			var streetcar_stops = [];
			for (var stop_id in stops) {
				if (trArrTriMetStreetStops[stop_id] != undefined && ( stops[stop_id]['193'] != undefined || stops[stop_id]['*'] != undefined ) ) {
					streetcar_stops.push(trArrTriMetStreetStops[stop_id]);
				}
			}
			if (streetcar_stops.length > 0) {
				// build a YQL URL
				var stop_string_array = [];
				for (var i = 0; i < streetcar_stops.length; i++) { 
					stop_string_array.push("stops=streetcar%7c"+streetcar_stops[i]);
				}
				var stop_string = escape(stop_string_array.join("&"));
				
				var randomnumber=Math.floor(Math.random()*1000000)
				var streetcar_url = "http://query.yahooapis.com/v1/public/yql?q=%20SELECT%20*%20FROM%20xml%20WHERE%20url%3D'http%3A%2F%2Fwebservices.nextbus.com%2Fservice%2FpublicXMLFeed%3Fcommand%3DpredictionsForMultiStops%26a%3Dportland-sc%26variation%3D"+randomnumber+"%26"+stop_string+"'&format=json";
				jQuery.ajax({
				  url: streetcar_url,
				  dataType: 'jsonp',
				  cache: false,
				  success: function(data, textStatus, XMLHttpRequest) {
				  	//jQuery("#debug_area").html("<PRE>"+textStatus+" "+streetcar_url+dump(data)+"</PRE>");
				  	var queryTime = new Date();
						queryTime.setISO8601(data.query.created);
						var now = new Date();
						var age_of_prediction = now.getTime() - queryTime.getTime();
						//jQuery("#debug_area").html("Streetcar request is "+age_of_prediction+"ms old");
						if (data.query.results != undefined && data.query.results.body != undefined && data.query.results.body.predictions != undefined) {
							respObj.table = trArrAddStreetcar(respObj.table,data.query.results.body.predictions);
						}
					},
				  error: function(XMLHttpRequest, textStatus, errorThrown) {
				  		alert("error while fetching Streetcar arrivals: "+textStatus+"<PRE>"+XMLHttpRequest.responseText+"</PRE>");
				  }
				});
			}
	  },
	  error: function(XMLHttpRequest, textStatus, errorThrown) {
	  		//alert("error while fetching TriMet arrivals: "+textStatus+"<PRE>"+XMLHttpRequest.responseText+"</PRE>");
	  }
	});


}

function trArrAddStreetcar(table,predictions) {
	
	if (!(predictions instanceof Array)) {
		predictions = [predictions];
	}
	//jQuery("#debug_area").html("<PRE>"+dump(predictions)+"</PRE>");
	
	for (var i = 0; i < predictions.length; i++) { 
		if (predictions[i].direction != undefined) {
			prediction_string = predictions[i].routeTitle+" "+predictions[i].direction.title;
			prediction_string = prediction_string.replace(' To ',' to ');
			var detailed_predictions =  predictions[i].direction.prediction;
			if (!(detailed_predictions instanceof Array)) {
				detailed_predictions = [detailed_predictions];
			}
			for (var j = 0; j < detailed_predictions.length; j++) { 
				var entry = [];
				entry[0] = detailed_predictions[j].minutes + " min";
				entry[1] = 0;
				entry[2] = prediction_string;
				entry[3] = predictions[i].stopTitle;
				entry[4] = detailed_predictions[j].epochTime;
				table.push(entry);
			}
		}
	}
	
	function trArrCompareSeconds(a,b) {
		return a[4] - b[4];
	}
	table.sort(trArrCompareSeconds);

	return table;
}

function trArrMimicTable(data,stops) {
	
	function sortDate(a,b) {
		return a.scheduled > b.scheduled;
	}
	var mimic = {};
	var queryTime = new Date();
	queryTime.setISO8601(data.resultSet.queryTime);
	var now = new Date();
	var age_of_prediction = now.getTime() - queryTime.getTime();
	//jQuery("#debug_area").html("TriMet request is "+age_of_prediction+"ms old");
	if (queryTime != undefined) {
		mimic.timestamp = queryTime.toString('h:mmtt');
		mimic.timestamp = mimic.timestamp.replace(/^0/,'12');
		//jQuery("#debug_area").html(queryTime.getTimezoneOffset());
	}
	mimic.mode = 'normal';
	mimic.table = new Array();
	mimic.arrivals = data.resultSet.arrival.sort(sortDate);
	mimic.location = data.resultSet.location;
	var loc_hash = {};
	for (var i = 0; i < data.resultSet.location.length; i++) { 
		var location = data.resultSet.location[i];
		loc_hash[location.locid] = location.desc;
	}
	mimic.loc_hash = loc_hash;
	
	for (var i = 0; i < data.resultSet.arrival.length; i++){ 
		var arrival = data.resultSet.arrival[i];
		var entry = new Array();
		var entry_date = new Date();
		entry_date.setISO8601(arrival.scheduled);
		entry[4] = entry_date.getTime();
		entry[0] = entry_date.toString('hh:mmtt');
		entry[1] = 0;
		entry[2] = arrival.fullSign;
		entry[3] = loc_hash[arrival.locid];
		if (arrival.status == "scheduled") {
			entry[1] = 1;
		} else {
			entry[0] = Math.round((entry_date - queryTime)/(60*1000));
			if (entry[0] == 0) {
				entry[0] = "Due";
			} else {
				entry[0] += " min";
			}
		}	
		if (stops[arrival.locid] != undefined && ( stops[arrival.locid]['*'] != undefined || stops[arrival.locid][arrival.route] != undefined ) ) {
			mimic.table.push(entry);
		}
	} 
	mimic.msgs = [];
	return mimic;
}