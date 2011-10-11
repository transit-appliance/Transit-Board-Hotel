/*
   trArrServicecta.js: Chicago Transit Authority arrivals
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

// If console.log is undefined, dump all log messages
if (console == undefined) {
    console = {}
    console.log = function (log) {}
}

function trArrServicectaCreateUpdaters(arrivals_object, service_requests, updaters)  {    
    var max_stops_per_request = 10;

    // CTA allows a max of 10 stops in one request, so split things up into multiple updater objects if need be
    while (service_requests.length > 0) {
	if (service_requests.length > max_stops_per_request) {
	    updaters.push(new trArrctaUpdater(service_requests.slice(0,max_stops_per_request),arrivals_object));
	    service_requests = service_requests.slice(max_stops_per_request);
	} else {
	    updaters.push(new trArrctaUpdater(service_requests,arrivals_object));
	    service_requests = [];
	}
    }

}


function trArrctaUpdater(requests, arrivals_object) {
    console.log('starting cta updater; updates once/min');

    this.arrivals_queue = [];
    this.service_messages = [];
    this.connection_health = [];

    this.requests = requests;

    var updater = this;
    
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

    var stop_ids = [];
    var route_ids = [];
    this.stops = {};
    this.requests.forEach( function (r) {
	stop_ids.push(r.stop_id);
	updater.stops[r.stop_id] = r.stop_data;
	r.routes.forEach(function (rt) {
	    if (route_ids.indexOf(rt.route_id) == -1) {
		route_ids.push(rt.route_id);
	    }
	});
    });

    // Make it a string
    var stops_string = stop_ids.join(',');
    var routes_string = route_ids.join(',');
    console.log('making requests for stops ' + stops_string + ', routes ' + routes_string);
    
    this.url = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D%22http%3A%2F%2Fwww.ctabustracker.com%2Fbustime%2Fapi%2Fv1%2Fgetpredictions%3Fkey=dmzKZAvywNj22LRn897EjsFxS%26stpid=' + stops_string + '%22';

    this.alertsurl = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D%22http%3A%2F%2Fwww.transitchicago.com%2Fapi%2F1.0%2Falerts.aspx%3Frouteid=' + routes_string + '%22';

    this.timeurl = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D%22http%3A%2F%2Fwww.ctabustracker.com%2Fbustime%2Fapi%2Fv1%2Fgettime%3Fkey=dmzKZAvywNj22LRn897EjsFxS%22';

    // Parse a time string as returned by the CTA
    // It's time zone aware!
    function parseCTATime(ctaDate) {
	console.log(ctaDate);

	var year = ctaDate.slice(0, 4);
	// Off-by-one; Jan is 1 for CTA, 0 for JS.
	var mo = ctaDate.slice(4, 6) - 1;
	var day = ctaDate.slice(6, 8);
	// index 8 is a space
	var hour = ctaDate.slice(9, 11);
	// index 11 is a :
	var min = ctaDate.slice(12, 14);

	var sec = 0;
	// If there are seconds
	if (ctaDate.length == 17) var sec = Number(ctaDate.slice(15,17));

	console.log(year, mo, day, hour, min, sec);

	return new tzDate(year, mo, day, hour, min, sec, 'America/Chicago');
    }

    function syncClock(master) {
	// Synchronize clock
	console.log('sychronizing clock');
	jQuery.ajax({
	    url: master.timeurl,
	    cache: false,
	    dataType: 'xml',
	    timeout: 10*1000,
	    // Retry
	    error: function (data) { 
		// YQL rate limit = 1 request/5 seconds
		setTimeout(function () {syncClock(master);}, 5000);
	    },
	    success: function (data) {
		var now = localTime();
		var xml = jQuery(data);

		// Calculate the delta

		// format: 20110405 22:04:23
		var ctaTime = parseCTATime(xml.find('tm').text());

		console.log('CTA time is: ' + ctaTime.toString());

		master.timeDelta = ctaTime.getTime() - now.getTime();

		// Resync in 1 hour
		setTimeout(function () {syncClock(master);}, 60*60*1000);

		console.log('received time from server, delta ' + master.timeDelta);
	    }
	});
    }

    // First sync
    syncClock(this);

    this.requestLoop = function () {
	console.log('Requesting CTA data, delta is ' + updater.timeDelta);
	if (updater.timeDelta != undefined) {
	    jQuery.ajax({
		url: updater.url,
		cache: false,
		dataType: 'xml',
		timeout: 10*1000,
		error: function(data) {
		    updater.update_connection_health(false);
		},
		success: function (data) {
		    console.log('received cta data');
		    // jQuerify the xml
		    var xml = jQuery(data);

		    // Make sure there wasn't an error
		    // YQL often returns data even when the other server is down
		    if (xml.find('error').length > 0) {
			updater.update_connection_health(false);
			return;
		    }

		    console.log('request was successful');

		    var local_queue = new arrivalsQueue();

		    // Loop over each prediction
		    xml.find('prd').each( function (index, prdDoc) {
			var prd = jQuery(prdDoc);
			
			var entry = new transitArrival();
			
			// Calculate the arrival time in local time
			var ctaArrTime = parseCTATime(prd.find('prdtm').text());
			console.log('arrival time: ' + ctaArrTime + ' (local)');
			// Add in the delta
			entry.arrivalTime   = ctaArrTime - updater.timeDelta;
			entry.type          = 'estimated';
			// put the route number in as well
			entry.headsign      = prd.find('rt').text() + ' to ' + prd.find('des').text();
			entry.stop_id       = prd.find('stpid').text();
			entry.route_id      = prd.find('rt').text();

			var stop_data = updater.stops[entry.stop_id];

			entry.stop_data = copyStopData(stop_data);

			// Get the route
			var lenSD = stop_data.routes.length;
			for (var i = 0; i < lenSD; i++) {
			    if (stop_data.routes[i].route_id == entry.route_id) {
				entry.route_data = stop_data.routes[i];
			    }
			}

			entry.agency        = 'cta';
			entry.avl_agency_id = 'cta';
			entry.last_updated  = parseCTATime(prd.find('tmstmp').text()) - updater.timeDelta;
			entry.flags = [];

			// 'Delayed' flag
			if (prd.find('dly').text() == 'true') {
			    entry.flags.push('delayed');
			}
			
			local_queue.push(entry);
			console.log(entry);
		    });
		    updater.arrivals_queue = copyArray(local_queue);
		}
	    });
	    
	    // Get alerts
	    jQuery.ajax({
		url: updater.alertsurl,
		dataType: 'xml',
		timeout: 10*1000,
		error: function (data) { console.log('Error: no alerts will be reported'); },
		success: function (data) {
		    var xml = jQuery(data);
		    
		    var advisories = [];

		    // Loop over all of the alerts
		    xml.find('Alert').each( function (index, aDoc) {
			var alert = jQuery(aDoc);
			var adv = alert.find('Headline').text() + ': ' + alert.find('ShortDescription').text();
			adv.text = adv; // Future expansion
			adv.severity = Math.round(Number(alert.find('SeverityScore').text())/10);
			adv.agency = 'cta';
			if (adv.severity == 0) adv.severity = 1;
			adv.long_text = alert.find('FullDescription').text();
			advisories.push(adv);
		    });
		    updater.service_messages = copyArray(advisories);
		}
	    });
	}
    }
    
    setTimeout(this.requestLoop, 10*1000); // give some time for timeDelta
    // to be set.
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
		  