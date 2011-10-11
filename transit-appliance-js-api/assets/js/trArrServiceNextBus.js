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

  Authors:
  Chris Smith: Original code
  Matt Conway: XML parsing

*/

function trArrServiceNextBusCreateUpdaters(arrivals_object, service_requests, updaters) {
    

    
    for (var avl_agency_id in service_requests) {
	var agency = avl_agency_id;
	if (agency == 'portland-sc') {
	    agency = 'TriMet'; // awful hack, have to figure out how to get this from the data
	}
	updaters.push(new trArrNextBusUpdater(service_requests,arrivals_object,avl_agency_id,agency));
    }
    
}

function trArrNextBusUpdater(service_requests,arrivals_object,avl_agency_id,agency) {
    
    
    var updater = this;

    // every updater object needs to maintain a queue
    this.arrivals_queue = [];
    this.service_messages = [];
    this.connection_health = [];
    
    this.stop_translation = {};
    this.route_translation = {};

    this.update_interval = 60*1000;
    this.health_limit = Math.floor(60*60*1000/this.update_interval);
    
    var stop_tags = {};

    for (var i = 0; i < service_requests[avl_agency_id].length; i++) {

	for (var j = 0; j < service_requests[avl_agency_id][i].routes.length; j++) {
	    
	    // use GTFS ids unless avl_id defined for stop or route
	    
	    var route_id = service_requests[avl_agency_id][i].routes[j].route_id;
	    if (service_requests[avl_agency_id][i].routes[j].avl_route_id != undefined) {
		route_id = service_requests[avl_agency_id][i].routes[j].avl_route_id;
		route_id = route_id.replace(/\s+/g,'');
		this.route_translation[route_id] = service_requests[avl_agency_id][i].routes[j].route_id;
	    }
	    
	    var stop_id = service_requests[avl_agency_id][i].stop_data.stop_id;
	    if (service_requests[avl_agency_id][i].stop_data.avl_stop_id != undefined) {
		stop_id = service_requests[avl_agency_id][i].stop_data.avl_stop_id;
		stop_id = stop_id.replace(/\s+/g,'');
		this.stop_translation[stop_id] = service_requests[avl_agency_id][i].stop_data.stop_id;
	    }
	    
	    var tag = route_id+"|"+stop_id;
	    stop_tags[tag] = true; //hash so we can remove duplicates
	}

    }
    var tag_list = [];
    for (var tag in stop_tags) {
	tag_list.push("stops="+tag);
    }


    var stop_string = tag_list.join('&');
    var randomnumber=Math.floor(Math.random()*1000000)

    // NextBus has the CORS header, so we can poll them directly
    this.url = 'http://webservices.nextbus.com/service/publicXMLFeed?command=predictionsForMultiStops&a=' + avl_agency_id + '&' + stop_string;


    // functions that will be polled by the arrivals object
    this.arrivals = function() {
	return this.arrivals_queue;
    }
    
    this.messages = function() {
	return this.service_messages;
    }
    
    this.connection = function() {
	return this.connection_health;
    }	
    
    this.update_connection_health = function(success_status) {
	updater.connection_health.unshift( { success: success_status, timestamp: localTime().getTime() } );
  	if (updater.connection_health.length > this.health_limit) {
  	    updater.connection_health.length = this.health_limit; // limit to last hour
  	}
    }

    
    this.trArrRequestLoop = function() {
	
	jQuery.ajax({
	    url: updater.url,
	    dataType: 'xml',
	    cache: false,
	    timeout: 10*1000,
	    error: function(data) {
		updater.update_connection_health(false);
	    },
	    success: function(data) {
		//debug_alert(data);
		updater.update_connection_health(true);
		var xml = jQuery(data);

		var local_queue = [];
		var local_messages = [];
		var update_time = localTime().getTime();

		// Parse some XML!
		// Modelled after trArrServiceBART
		xml.find('prediction').each(function (ind, prdDoc) {
		    var prd = jQuery(prdDoc);
		    var entry = new transitArrival();
		    entry.arrivalTime = Number(prd.attr('epochTime'));
		    
		    entry.type = 'estimated'; // NextBus doesn't provide
		    // scheduled arrivals, I don't think

		    // headsign from parent direction attribute
		    // routeTitle is in predictions element, title is the destination from direction tag
		    // tag hierarchy is predictions -> directions -> prediction
		    entry.headsign = prd.parent().parent().attr('routeTitle') + ' ' + prd.parent().attr('title');
		    entry.stop_id = prd.parent().parent().attr('stopTag');
		    if (updater.stop_translation[entry.stop_id] !=  undefined) {
			entry.stop_id = updater.stop_translation[entry.stop_id];
		    }

		    var stop_data = trStopCache().stopData(agency, entry.stop_id)
		    entry.stop_data = copyStopData(stop_data);
		    
		    entry.route_id = prd.parent().parent().attr('routeTag');
		    if (updater.route_translation[entry.route_id] !=  undefined) {
			entry.route_id = updater.route_translation[entry.route_id];
		    }
		    if (stop_data != undefined && stop_data.routes != undefined) {
			for (var n = 0; n < stop_data.routes.length; n++){
			    if (stop_data.routes[n].route_id == entry.route_id) {
				entry.route_data = stop_data.routes[n];
			    }
			}
		    }

		    entry.agency = agency;
		    entry.avl_agency_id = avl_agency_id;

		    entry.alerts = "";

		    entry.last_updated = update_time;

		    local_queue.push(entry);
		});

		// get some messages
		xml.find('message').each(function (ind, m) {
		    var text = jQuery(m).attr('text');

		    // messages are freqently repeated for each stop.
		    if (local_messages.indexOf(text) == -1) local_messages.push(text);
		});

		//debug_alert(local_messages);
		
		
		// now copy to externally visble queue, making sure we're not in the middle of a query
		if (local_queue.length > 0) {
		    // if we have no new arrivals, don't kill the old ones, just let them age out - this provides better display during some error conditions
		    updater.arrivals_queue = copyArray(local_queue);
		}
		updater.service_messages = copyArray(local_messages);
		
	    }
	});
    }
    
    updater.trArrRequestLoop(); // first time immediately
    setInterval(updater.trArrRequestLoop,updater.update_interval); // once per minute
    

}

function copyStopData(data) {
    var out = {};
    for (var element in data) {
	// strip it down to just the GTFS elements
	if (element != 'routes' && element != 'geometry' && element != 'doc_type' && element.substring(0,1) != '_') {
	    out[element] = data[element]
	}
    }
    return out;
}

function copyArray(in_array) {
    var out_array = [];
    for (var i = 0; i < in_array.length; i++){ 
	out_array[i] = in_array[i];
    } 
    return out_array;
}


