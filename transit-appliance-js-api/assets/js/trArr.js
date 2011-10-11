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

// Set uptthe date object
timezoneJS.timezone.zoneFileBasePath = 'assets/tz';
timezoneJS.timezone.init();

tzDate = timezoneJS.Date;

// Returns a timezoneJS.Date object in the current time zone
function localTime(epoch) {
    // Allow them to pass in a Date or tzDate object as well.
    if (typeof epoch == "object") { var epoch = epoch.getTime(); }

    // Local time
    if (epoch == undefined) { var epoch = new Date().getTime(); }
 
    var t = new timezoneJS.Date();
    t.setTimezone(timezone);
    t.setTime(epoch);

    return t;
}

// Call it like timeInZone('America/Los_Angeles', ...);
// If you leave off epoch, it will use the current time.
function timeInZone(zone, epoch) {
    // Allow them to pass in a Date or tzDate object as well.
    if (typeof epoch == "object") { var epoch = epoch.getTime(); }

    // Local time
    if (epoch == undefined) { var epoch = new Date().getTime(); }
    
    var t = new tzDate();
    t.setTimezone(zone);
    t.setTime(epoch);

    return t;
}

function trArrLog(msg) {
    // Add it to the log
    // do it using the DOM directly so we can get the element's pos.
    var m = document.createElement("div");
    m.innerHTML = msg;
    jQuery('#arrivals_log_area').append(m);

    // Scroll it into view
    jQuery(document).scrollTop(jQuery(m).position().top);
}

// Inherit from array
function transitArrival () {};
transitArrival.prototype = {};

// Minutes until departure
// TODO: Currently depends on local clock; this should be fixed
// TODO2: many apps will run this function repeatedly for multiple lines; this takes time, so each arrival
// is reported relative to a different base.
transitArrival.prototype.minutes = function () {
    var now = localTime();
    return Math.floor((this.arrivalTime - now.getTime()) / 60000);
}   

function arrivalsQueue () {}
arrivalsQueue.prototype = new Array();

/* Note: because of the way this is implemented (i.e. because it operates on an array sorted by
 * time, the first line in the dict will be the line with the first arrival, and so on. */
arrivalsQueue.prototype.byLine = function () {
    var lines = {};
    // This is how we refer to the array in the prototype
    this.forEach(function (arr) {
	// This is the first one from this line
	if (lines[arr.route_id] == undefined) {
	    lines[arr.route_id] = new arrivalsQueue();
	}
	lines[arr.route_id].push(arr);
    });
    return lines;
}

// it really should be byHeadsign
arrivalsQueue.prototype.byDest = function () {
    var lines = {};
    // This is how we refer to the array in the prototype
    this.forEach(function (arr) {
	// This is the first one from this line
	if (lines[arr.headsign] == undefined) {
	    lines[arr.headsign] = new arrivalsQueue();
	}
	lines[arr.headsign].push(arr);
    });
    return lines;
}

arrivalsQueue.prototype.byStop = function () {
    var stops = {};
    this.forEach(function (arr) {
	if (stops[arr.agency + ':' + arr.stop_id] == undefined) {
	    stops[arr.agency + ':' + arr.stop_id] = new arrivalsQueue();
	}
	stops[arr.agency + ':' + arr.stop_id].push(arr);
    });
    return stops
}

// Returns an array of arrivalsQueue objects with the set number of rows (or fewer, in the last one)
arrivalsQueue.prototype.paginate = function (rows) {
    var current = new arrivalsQueue(); // The one we're working on now
    var paginated = [];
    var count = 0; // Keep track of where we are
    this.forEach(function (arr) {
	if (count < rows) { // < rather than <= because indices start at 0, whereas 8 rows means indices 0-7
	    current.push(arr);
	    count++;
	}
	else {
	    paginated.push(current);
	    current = new arrivalsQueue();
	    count = 0;
	}
    });
    // Push the last page to the array, unless it's empty
    if (count > 0) {
	paginated.push(current);
    }
    return paginated;
}
	

// Some browsers have issues with subclassing Array, so you lose the ability
// to do subscripts and use .length. If you need those functions, calling this
// will return an actual array of the current arrivals (albeit without the fancy .byStop etc.)
arrivalsQueue.prototype.toArray = function () {
    var array = [];
    this.forEach(function (arr) {
	array.push(arr);
    });
    return array;
}	

// Returns an arrivalsQueue with only arrivals for the next n minutes.
arrivalsQueue.prototype.minutes = function (mins) {
    var ms = mins * 60000;
    var maxTime = localTime().getTime() + ms; // Epoch time of latest arrival
    var returnVal = new arrivalsQueue();
    this.forEach(function (arr) {
	if (arr.arrivalTime < maxTime) returnVal.push(arr);
    });
    return returnVal;
}

// return a version of the queue with past arrivals stripped off
arrivalsQueue.prototype.current = function () {
    var newQueue = new arrivalsQueue();
    var now = localTime().getTime();
    this.forEach( function (arr) {
	if (arr.arrivalTime > now) {
	    newQueue.push(arr);
	}
    });
    return newQueue;
}
		  

// Returns a Date object describing the last update of the oldest (ie most stale)
// arrival.
arrivalsQueue.prototype.lastUpdated = function () {
    var oldest = this.toArray()[0].last_updated;
    this.forEach( function (arr) {
	if (arr.last_updated < oldest) {
	    oldest = arr.last_updated;
	}
    });
    return new Date(oldest);
}


function trArr(input_params) {
	
	/**
	 * Loosely modeled on jquery.parsequery.js by Michael Manning (http://actingthemaggot.com)
	 **/
	trArrParseQuery = function(qs) {
		var q = (typeof qs === 'string'?qs:window.location.search);
		var params = {};
		jQuery.each(q.match(/^\??(.*)$/)[1].split('&'),function(i,p){
			p = unescape(p).replace(/\+/g,' ').replace(/\]/g,'');
			p = p.split('=');
			var keys = p[0].split('[');
			var value = p[1];
			var depth = keys.length;
			if (depth == 1) {
				// actually shouldn't happen, should always have at least two levels
				if (params[keys[0]] == undefined) {
					params[keys[0]] = {};
				}
				params[keys[0]][value] = true;
			}
			if (depth == 2) {
				if (params[keys[0]] == undefined) {
					params[keys[0]] = {};
				}
				if (params[keys[0]][keys[1]] == undefined) {
					params[keys[0]][keys[1]] = {};
				}
				params[keys[0]][keys[1]][value] = true;
			}
			if (depth == 3) {
				if (params[keys[0]] == undefined) {
					params[keys[0]] = {};
				}
				if (params[keys[0]][keys[1]] == undefined) {
					params[keys[0]][keys[1]] = {};
				}
				if (params[keys[0]][keys[1]][keys[2]] == undefined) {
					params[keys[0]][keys[1]][keys[2]] = {};
				}
				params[keys[0]][keys[1]][keys[2]][value] = true;
			}
		});
		return params;
	}
	
	// ensure this is called as constructor
	
	if (!(this instanceof trArr)) {
		return new trArr(input_params);
	}
	
	// create some display containers if the page builder has not already placed them for us
	if (jQuery('#arrivals_display_area').length == 0) {
		jQuery('body').prepend('<div id="arrivals_display_area"></div>');
	}
	if (jQuery('#arrivals_log_area').length == 0) {
		jQuery('body').prepend('<div id="arrivals_log_area"></div>');
	}
	
	this.version = "1.01";
	this.start_time = new Date().getTime();
	
	this.input_params = input_params;	
	// we should set up some defaults here
		
	this.configString = this.input_params.configString;
	this.query_params = trArrParseQuery(this.configString);
	
	// turns options from objects into arrays
	this.options = {};
	for (var option in this.query_params.option) {
		var opt_array = [];
		for (var value in this.query_params.option[option]) {
			opt_array.push(value);
		}
		this.options[option] = opt_array;
	}
	
	// turns appl config from objects into arrays
	this.appl = {};
	for (var option in this.query_params.appl) {
		var opt_array = [];
		for (var value in this.query_params.appl[option]) {
			opt_array.push(value);
		}
		this.appl[option] = opt_array;
	}

        // Set it globally
        if (this.appl.timezone != undefined) {
            timezone = this.appl.timezone[0];
        }
        else {
	    timezone = 'America/Los_Angeles';
        }
	
	this.id = undefined;
	if (this.appl != undefined && this.appl.id != undefined && this.appl.id[0] != undefined) {
    this.id = this.appl.id[0];
  }
	
	this.ready = new jQuery.Deferred();
	
	this.is_ready = function() {
		return this.ready;
	}
	
	this.updaters = function() {
		return this.updater_array;
	}
	
	this.update_health_status = function(arrivals_object) {
		jQuery.ajax({
			url: "http://transitappliance.com/cgi-bin/health_update.pl",
			data: { timestamp: ((new Date)).getTime(), start_time: arrivals_object.start_time, version: arrivals_object.version, id: arrivals_object.id }
		});
		setTimeout(arrivals_object.update_health_status(arrivals_object),12*60*60*1000); //every 12 hours
	}
	
	this.processAgencyRequests = function(arrivals_object,agency,callback) {
		var agency_js_name = agency.replace('-',"");
		jQuery.when(jQuery.ajax({
		  url: "assets/js/trArrAgency"+agency_js_name+".js",
		  dataType: 'script',
		  async: false,
		  success: function() {
		  	trArrLog("Processing requests for "+agency+"<br>");
		  	var function_name = "trArrAgency"+agency_js_name+"MakeServiceRequests";
		  	window[function_name](arrivals_object.query_params.stop[agency],arrivals_object.query_params.options,trStopCache(),arrivals_object.service_requests);
		  },
		  error: function() {
		  	trArrLog("<font color='red'>Error processing requests for "+agency+", reloading page</font><br>");
        window.location.reload();
		  }
		})).done(function(data) {
			var agency = arrivals_object.nextServiceRequestAgency(arrivals_object);
			if (agency == undefined) {
				callback(arrivals_object);
			} else {
				arrivals_object.processAgencyRequests(arrivals_object,agency,callback);
			}
		}).fail(function(data) {
			var agency = arrivals_object.nextServiceRequestAgency(arrivals_object);
			if (agency == undefined) {
				callback(arrivals_object);
			} else {
				arrivals_object.processAgencyRequests(arrivals_object,agency,callback);
			}
		});
	}
		
	this.nextServiceRequestAgency = function(arrivals_object) {

		for (var agency in arrivals_object.query_params.stop) {
			if (arrivals_object.service_request_agencies_pending[agency] == undefined) {
				arrivals_object.service_request_agencies_pending[agency] = true;
				return agency;
			}
		}
		return undefined;
	}
	
	this.nextUpdaterRequest = function(arrivals_object) {

		for (var service in arrivals_object.service_requests) {
			if (arrivals_object.updater_creation_pending[service] == undefined) {
				arrivals_object.updater_creation_pending[service] = true;
				return service;
			}
		}
		return undefined;
	}
	
	this.createUpdaterObjects = function(arrivals_object, service, callback) {
		jQuery.when(jQuery.ajax({
		  url: "assets/js/trArrService"+service+".js",
		  dataType: 'script',
		  async: false,
		  success: function() {
		  	trArrLog("Creating updaters for "+service+"<br>");
		  	var function_name = "trArrService"+service+"CreateUpdaters";
		  	window[function_name](arrivals_object,arrivals_object.service_requests[service],arrivals_object.updater_array);
		  },
		  error: function() {
		  	trArrLog("<font color='red'>Error creating updaters for "+service+", reloading page</font><br>");
		  	window.location.reload();
		  }
		})).done(function(data) {
			var service = arrivals_object.nextUpdaterRequest(arrivals_object);
			if (service == undefined) {
				callback(arrivals_object);
			} else {
				arrivals_object.createUpdaterObjects(arrivals_object,service,callback);
			}
		}).fail(function(data) {
			var service = arrivals_object.nextUpdaterRequest(arrivals_object);
			if (service == undefined) {
				callback(arrivals_object);
			} else {
				arrivals_object.createUpdaterObjects(arrivals_object,service,callback);
			}
		});
	}
	
	this.mergeArrivals = function() {
		var now = new Date();
		now = now.getTime(); //milliseconds since epoch	
	        var arrivals = new arrivalsQueue();
  	for (var i = 0; i < this.updater_array.length; i++) {
  		var updater_arrivals = this.updater_array[i].arrivals();
  		for (var j = 0; j < updater_arrivals.length; j++) {
				var milliseconds_until_arrival = updater_arrivals[j].arrivalTime - now;
				if (milliseconds_until_arrival >= 0) {
  				arrivals.push(updater_arrivals[j]);
  			}
  		}
  	}
  	  	
		// sort the rows by arrival time
		function trArrCompareArrivals(a,b) {
			return a.arrivalTime - b.arrivalTime;
		}
		arrivals.sort(trArrCompareArrivals);
		
		// look at whether the config has requested any filtering
		
		if (this.options.arrivals_limit_number != undefined && this.options.arrivals_limit_number != "" && this.options.arrivals_limit_number != 0) {
			if (this.options.arrivals_limit_number < arrivals.length) { // don't reset length if limit is greater than actual!
				arrivals.length = this.options.arrivals_limit_number;
			}
		}
		
		if (this.options.arrivals_limit_minutes != undefined && this.options.arrivals_limit_minutes != "" && this.options.arrivals_limit_minutes != 0) {
			arrivals = this.filter_queue_minutes(arrivals,this.options.arrivals_limit_minutes);
		}

  	return arrivals;
	}
	
	this.mergeMessages = function() {
		var messages = [];
  	for (var i = 0; i < this.updater_array.length; i++) {
  		var updater_messages = this.updater_array[i].messages();
  		for (var j = 0; j < updater_messages.length; j++) {
				messages.push(updater_messages[j]);
  		}
  	}
  	return messages;
  }
  
	this.mergeConnectionHealth = function() {
		var health = [];
		var now = new Date().getTime();
		var total_weight = 0;
		var total_connect = 0;
  	for (var i = 0; i < this.updater_array.length; i++) {
  		var updater_health = this.updater_array[i].connection();
  		for (var j = 0; j < updater_health.length; j++) {
  			var weight = 1000000/Math.pow(now - updater_health[j].timestamp,1.05);

  			total_weight = total_weight + weight;
  			if (updater_health[j].success) {
  				total_connect = total_connect + weight;
  			}
				health.push(updater_health[j]);
  		}
  	}

  	return Math.floor(total_connect*1000/total_weight)/1000;
  }
	
	this.filter_queue_minutes = function(arrivalsQueue,minutes) {
			
		var now = new Date();
		now = now.getTime(); //milliseconds since epoch				
		
		var arrivals = [];
		// removes everything before now and greater than 24 hours from now
		for (var i = 0; i < arrivalsQueue.length; i++) {
			var milliseconds_until_arrival = arrivalsQueue[i].arrivalTime - now;
			if (milliseconds_until_arrival <= minutes*60*1000) {
				arrivals.push(arrivalsQueue[i]);
			}
		}
		
		return arrivals;

	}
	  
	// create and populate stop information cache, the build structure of agency service requests
	trAgencyCache().checkCached(this,this.query_params.stop,	function (arrivals_object) {
		trStopCache().checkCached(arrivals_object,arrivals_object.query_params.stop,	function (arrivals_object) {
			arrivals_object.service_requests = {};
			arrivals_object.updater_array = [];
			arrivals_object.service_request_agencies_pending = {};
			arrivals_object.updater_creation_pending = {};
			
			
			for (var agency in arrivals_object.query_params.stop) {
				arrivals_object.service_request_agencies_pending[agency] = undefined;
			}
				
			var agency = arrivals_object.nextServiceRequestAgency(arrivals_object);
			if (agency != undefined) {
				arrivals_object.processAgencyRequests(arrivals_object,agency,function(arrivals_object) {
					trArrLog("Request processing complete.<br><br>");
					
					trArrLog("Create arrivals updater objects<br>");
					for (var service in arrivals_object.service_requests) {
						arrivals_object.updater_creation_pending[service] = undefined;
					}
					
					var service = arrivals_object.nextUpdaterRequest(arrivals_object);
					arrivals_object.createUpdaterObjects(arrivals_object, service, function(arrivals_object) {
						// wait 10 seconds for first arrivals to load and then tell 'em we're done
						trArrLog("<br>Wait 10 seconds for first set of arrivals<br><br>");
						setTimeout(function(){
							
							// first time through
							var displayCallCount = 0;
							jQuery('#arrivals_log_area').css("display","none");

						        // Scroll back to the top
						        jQuery(document).scrollTop(0);
							
							jQuery.ajax({
									url: "http://transitappliance.com/cgi-bin/health_update.pl",
									data: { timestamp: arrivals_object.start_time, start_time: arrivals_object.start_time, version: arrivals_object.version, id: arrivals_object.id, application_id: arrivals_object.input_params.applicationId, application_name: arrivals_object.input_params.applicationName, application_version: arrivals_object.input_params.applicationVersion }
							});
							
							// logging of startup, beat every 12 hours goes here
							setInterval(function(){
								jQuery.ajax({
										url: "http://transitappliance.com/cgi-bin/health_update.pl",
										data: { timestamp: ((new Date)).getTime(), start_time: arrivals_object.start_time, version: arrivals_object.version, id: arrivals_object.id, application_id: arrivals_object.input_params.applicationId, application_name: arrivals_object.input_params.applicationName, application_version: arrivals_object.input_params.applicationVersion }
								});
							}, 12*60*60*1000);
							
							if (arrivals_object.input_params.initializeCallback != undefined) {
								arrivals_object.input_params.initializeCallback({
									arrivalsQueue: arrivals_object.mergeArrivals(),
									displayCallCount: displayCallCount,
									optionsConfig: arrivals_object.options,
									applianceConfig: arrivals_object.appl,
									stopsConfig: arrivals_object.query_params.stop,
									agencyCache: trAgencyCache(),
									serviceMessages: arrivals_object.mergeMessages(),
									connectionHealth: arrivals_object.mergeConnectionHealth()
								});
							}
	
							updateQueueNextTime = arrivals_object.input_params.displayCallback({
								arrivalsQueue: arrivals_object.mergeArrivals(),
								displayCallCount: displayCallCount,
								optionsConfig: arrivals_object.options,
								applianceConfig: arrivals_object.appl,
								stopsConfig: arrivals_object.query_params.stop,
								agencyCache: trAgencyCache(),
								serviceMessages: arrivals_object.mergeMessages(),
								connectionHealth: arrivals_object.mergeConnectionHealth()
							});
							
							/* 3 ways to get display interval:
							
							1: from input options
							2: from object creation parameters
							3: default 10 seconds
							*/
							
							var refresh_interval = undefined;
							if (arrivals_object.options.refresh_interval != undefined) {
								refresh_interval = arrivals_object.options.refresh_interval*1000; // specified in seconds
							} else {
								refresh_interval = arrivals_object.input_params.displayInterval;
								if (refresh_interval == undefined) {
									refresh_interval == 10*1000;
								}
							}
							
							// now iterate forever
							setInterval(function(){
								displayCallCount++;
	
								updateQueueNextTime =  arrivals_object.input_params.displayCallback({
									arrivalsQueue: arrivals_object.mergeArrivals(),
									displayCallCount: displayCallCount,
									optionsConfig: arrivals_object.options,
									applianceConfig: arrivals_object.appl,
									stopsConfig: arrivals_object.query_params.stop,
									agencyCache: trAgencyCache(),
									serviceMessages: arrivals_object.mergeMessages(),
									connectionHealth: arrivals_object.mergeConnectionHealth()
								});
							}, refresh_interval);
							
						},10*1000);
					});
				});
			}
				
		});
		
	});
	
}


