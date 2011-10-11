/*
   Copyright 2011 Portland Transport

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

function showAlert(head, text) {
    var a = window.webkitNotifications.createNotification(
	'tbddesktop/logo_aiga.png', head, text);
    a.show();
    setTimeout(function () {
	a.cancel();
    }, timeout);
}

function allowNotifications() {
    window.webkitNotifications.requestPermission(function () {
	if (window.webkitNotifications.checkPermission() != 0) {
	    $('#notifications').fadeOut();
	}
    });
}   

function doDisplay (data) {
    // if we can't show notifications, don't bother
    if (window.webkitNotifications.checkPermission() != 0) {
	alert('Please allow desktop notifications!');
	$('#notifications').fadeIn();
	return false;
    }
    else $('#notifications').fadeOut();

    var queue = data.arrivalsQueue.minutes(threshold);
    var arrlen = queue.length;
    for (var i=0; i < arrlen; i++) {
	var arr = queue[i];

	// check if it matches the headsign filter, if there is one
	if (window.headsign != undefined) {
	    if (arr.headsign.toUpperCase().indexOf(headsign.toUpperCase()) == -1) {
		// the headsign filter failed
		continue;
	    }
	}

	// check if it's been shown already
	if (blacklist[arr.headsign] != undefined) {
	    // check if the blacklist has expired
	    if (blacklist[arr.headsign] > localTime().getTime()) {
		// blacklist has not expired, so skip
		continue;
	    }
	}

	// store it so it won't be shown for interval seconds
	blacklist[arr.headsign] = localTime().getTime() + interval*1000;
	
	showAlert(queue[i].headsign, 
		  queue[i].minutes() + ' min, ' + queue[i].stop_data.stop_name);
    }

    // loop through the messages
    var msgLen = data.serviceMessages.length;
    for (var i = 0; i < msgLen; i++) {
	var msg = data.serviceMessages[i];
	if (shown_messages.indexOf(msg) == -1) {
	    showAlert('SERVICE MESSAGE',msg)
	    shown_messages.push(msg);
	}
    }	
}

$(document).ready(function () {
    trArr({
	configString: window.location.search,
	displayInterval: 20*1000,
	displayCallback: doDisplay,
	initializeCallback: function (data) {
	    var rights_string = '';
	    for (var agency in data.stopsConfig) {
		rights_string += data.agencyCache.agencyData(agency).rights_notice+" ";
	    }
	    $('#rights').text(rights_string);

	    
	    // this keeps track of when we've shown specific lines, so we don't
	    // keep bugging the user with lines they've seen already
	    // the basic format is that it is indexed by headsign, with an
	    // epoch time for when the blacklist expires in the data
	    blacklist = {};

	    // this keeps track of message that have been already displayed to
	    // the user in this session
	    shown_messages = [];

	    timeout=data.optionsConfig.timeout?data.optionsConfig.timeout[0]:10000;
	    threshold=data.optionsConfig.threshold?data.optionsConfig.threshold[0]:7;
	    interval=data.optionsConfig.interval?data.optionsConfig.interval[0]:60;
	    if (data.optionsConfig.headsign != undefined) {
		if (data.optionsConfig.headsign.length >= 1) { 
		    headsign = data.optionsConfig.headsign[0];
		}
	    }

	}
    });
});