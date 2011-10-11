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

function trArrServiceTriMetCreateUpdaters(arrivals_object, service_requests, updaters) {
	
	var max_stops_per_request = 10;

	// TriMet allows a max of 10 stops in one request, so split things up into multiple updater objects if need be
	while (service_requests.length > 0) {
		if (service_requests.length > max_stops_per_request) {
			updaters.push(new trArrTriMetUpdater(service_requests.slice(0,max_stops_per_request),arrivals_object));
			service_requests = service_requests.slice(max_stops_per_request);
		} else {
			updaters.push(new trArrTriMetUpdater(service_requests,arrivals_object));
			service_requests = [];
		}
	}

}

function trArrTriMetUpdater(service_requests,arrivals_object) {
	
	var updater = this;
	
	// every updater object needs to maintain a queue
	this.arrivals_queue = [];
	this.service_messages = [];
	this.connection_health = [];
	
	this.update_interval = 60*1000;
	this.health_limit = Math.floor(60*60*1000/this.update_interval);
	
	var request_object = {}; // hash to use for testing arrivals against request
	
	var stop_id_list = [];
	for (var i = 0; i < service_requests.length; i++) {
		stop_id_list.push(service_requests[i].stop_id);
		request_object[service_requests[i].stop_id] = {};
		for (var j = 0; j < service_requests[i].routes.length; j++) {
			request_object[service_requests[i].stop_id][service_requests[i].routes[j].route_id] = true;
		}
	}
	var stop_string = stop_id_list.join(',');
	this.url = "http://developer.trimet.org/ws/V1/arrivals/?locIDs="+stop_string+"&appID=828B87D6ABC0A9DF142696F76&json=true";
	
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
	
	this.trArrTriMetRequestLoop = function() {
		
		jQuery.ajax({
		  url: updater.url,
		  dataType: 'jsonp',
		  cache: false,
		  timeout: 10*1000,
		  error: function(data) {
		  	updater.update_connection_health(false);
		  },
		  success: function(data) {
		  	updater.update_connection_health(true);
		  	var local_queue = [];
		  	var update_time = localTime().getTime();
				for (var i = 0; i < data.resultSet.arrival.length; i++){ 
					var arrival = data.resultSet.arrival[i];
					if (request_object[arrival.locid] == undefined || request_object[arrival.locid][arrival.route] == undefined) {
						continue; // don't process an arrival if it wasn't in the stop list
					}
				        var entry = new transitArrival();
				    var year = arrival.scheduled.slice(0, 4);
				    var mo = Number(arrival.scheduled.slice(5,7)) - 1; // Jan is 0 in JS
				    var day = arrival.scheduled.slice(8, 10)
				    var hour = arrival.scheduled.slice(11, 13);
				    var min = arrival.scheduled.slice(14, 16);
				    // Must be number or will be interpreted as tz
				    var sec = Number(arrival.scheduled.slice(17,18));
				    // Should get TriMet's TZ from GTFS agency defn, in case Oregon makes its own time
				    // (e.g. America/Portland)
				    var entry_date = new tzDate(year, mo, day, hour, min, sec, 'America/Los_Angeles');

				
					entry.arrivalTime = entry_date.getTime(); // seconds since epoch for arrival
					if (arrival.status == "scheduled") {
						entry.type = "scheduled";
					} else {
						entry.type = "estimated";
					}
					entry.headsign = arrival.fullSign;
					entry.stop_id = arrival.locid;
					var stop_data = trStopCache().stopData('TriMet',entry.stop_id);
					entry.stop_data = copyStopData(stop_data);
					entry.route_id = arrival.route;
					for (var j = 0; j < stop_data.routes.length; j++){
						if (stop_data.routes[j].route_id == entry.route_id) {
							entry.route_data = stop_data.routes[j];
						}
					}
					entry.agency = "TriMet";
					entry.avl_agency_id = "TriMet";
					entry.alerts = ""; // need to figure this out later
					entry.last_updated = update_time;
					local_queue.push(entry);
				}
				
				// now copy to externally visble queue, making sure we're not in the middle of a query
				updater.arrivals_queue = local_queue;
				//trArrLog("<PRE>"+dump(updater.arrivals_queue)+"</PRE>");
				
		  }
		});
	}
	
	updater.trArrTriMetRequestLoop(); // first time immediately
	setInterval(updater.trArrTriMetRequestLoop,updater.update_interval);

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