/*
   trArrServiceBART.js: BART arrivals
   $Id$

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
   Matt Conway: main code

*/


function trArrServiceBARTCreateUpdaters(arrivals_object, service_requests, updaters) {
    for (var request in service_requests.BART) {
	updaters.push(new trArrBARTUpdater(service_requests.BART[request], arrivals_object));
    }
}

function trArrBARTUpdater (request, arrivals_object) {
    //console.log('Building BART updater');
		this.arrivals_queue = [];
		this.service_messages = [];
		this.connection_health = [];
    
    this.request = request;

    // So it is in the closure
    var updater = this;

    var stop_id_list = [request.stop_id];

    ////console.log(request.stop_data.avl_stop_id);

    // They allow cross-origin XMLHttpRequests
    this.url = 'http://api.bart.gov/api/etd.aspx?cmd=etd&orig=' + request.stop_data.avl_stop_id + '&key=MW9S-E7SL-26DU-VV8V';

    this.advisories_url = 'http://api.bart.gov/api/bsa.aspx?cmd=bsa&orig=' + request.stop_data.avl_stop_id + '&key=MW9S-E7SL-26DU-VV8V'

    //console.log('setting up arrs queue');
    
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
	updater.connection_health.unshift( { success: success_status, timestamp: new Date().getTime() } );
	if (updater.connection_health.length > this.health_limit) {
	    updater.connection_health.length = this.health_limit; // limit to last hour
	}
    }
    
    //console.log('Setting up BART request loop');

    this.requestLoop = function () {
	//console.log('Making BART request to ' + updater.url);
	jQuery.ajax({
	    url: updater.url,
	    cache: false,
	    dataType: 'xml',
	    timeout: 10*1000,
		  error: function(data) {
		  	updater.update_connection_health(false);
		  },
	    success: function(data) {
	    	updater.update_connection_health(true);
		// There's a possibility this won't work in IE
		var xml = jQuery(data);

		//console.log('Made BART Request');
		var local_queue = [];
		// Assemble their strings into a date-time pair, then parse
		// into a date obj, then to an epoc time
		//var update_time = Date.parse(xml.find('date').text() + ' ' + xml.find('time').text()).getTime();
		var update_time = localTime().getTime();

		// Loop through each estimate and build an entry
		xml.find('estimate').each( function (ind, estDoc) {
		    var est = jQuery(estDoc); // Again, maybe not in IE
		    var entry = new transitArrival();
		    var date = timeInZone('America/Los_Angeles', update_time);
		    var mins = est.find('minutes').text();
		    if (mins == 'Arrived') mins = 0; // Handle the 'Arrived' case.
		    mins = Number(mins);
		    date.setMinutes(date.getMinutes() + mins)
		    entry.arrivalTime = date.getTime();
		    entry.type = 'estimated';
		    entry.headsign = est.parent().find('destination').text();
		    entry.stop_data = copyStopData(request.stop_data);
		    entry.stop_id = updater.request.stop_id;
		    entry.route_id = entry.headsign; // Can't get from RealBART
		    entry.route_data = {};
		    entry.alerts = xml.find('message').text();
		    entry.agency = 'BART';
		    entry.avl_agency_id = 'BART';
		    entry.last_updated = update_time;
		    entry.flags = []

		    // Bike flag
		    if (est.find('bikeflag').text() == '1') {
			entry.flags.push('bike');
		    }
		    
		    local_queue.push(entry);
		});
		updater.arrivals_queue = copyArray(local_queue);
		////console.log(updater.arrivals_queue);
	    }
	});

	// And make a request for BART service advisories
	jQuery.ajax({
	    url: updater.advisories_url,
	    cache: false,
	    dataType: 'xml',
	    timeout: 10*1000,
	    error: function (data) { updater.update_connection_health(false);},
	    success: function (data) {
		var xml = jQuery(data);

		// Loop through each advisory and add it to the queue
		var advisories = [];
		xml.find('bsa').each( function (ind, bsaDoc) {
		    var bsa = jQuery(bsaDoc);
		    var text = bsa.find('sms_text').text();
		    // 5/28/2011: they seem to be using the latter form now.
		    if (text != 'NO DELAYS REPORTED.' && text != 'No delays reported.') {
			advisories.push(text);
		    }
		});
		
		updater.service_messages = copyArray(advisories);
	    }
	});			      
    }

    //console.log('Preparing first BART request');
    this.requestLoop();
    setInterval(this.requestLoop, 60*1000); // Minutely
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