/*
 * routes.js: All the routes for node-mobile
 * I don't like having a bunch of 10 line files spread across the fs.
 */

/* // Commented out because, for now, we're using an in-memory store
   // for fetches
// set up DB stuff. This should really be moved to another module
var cradle = require('cradle');
cradle.setup({
    host: 'transit-appliance.couchone.com',
    cache: true, // fine to cache since we're the only ones who will be
    // accessing this
    raw: false
});

// TODO: should connection be here or in each use of it?
var conn = new cradle.Connection();
*/

var querystring = require('querystring');
var request = require('request');
var $ = require('jquery'); // wouldn't parse XML without it.

// length of the codes for trips
var CODE_LENGTH = 5;
var itineraries = {};

/**
 * clean out the URLs
 */
setInterval(function () {
    var now = new Date().getTime();
    for (var i in itineraries) {
	if (now < itineraries[i].lifetime) {
	    console.log('clearing ' + i);
	    itineraries[i] = undefined;
	}
    }
}, 30 * 60 * 1000);

/**
 * get a trip plan from the TriMet WS
 * @param {object} itin the itinerary
 * @param {function} cb the callback
 */
function getTripPlan(itin, cb) {
    var now = new Date (); // time zone?

    var hour = now.getHours() % 12;
    var mins = now.getMinutes();
    
    if (mins < 10) mins = '0' + mins;

    if (hour == 0) hour = 12;
    if (now.getHours() >= 12) var ap = 'pm';
    else                      var ap = 'am';

    var time = hour + ':' + mins + ' ' + ap;

    // build the URL
    params = {
	fromCoord: itin.fromCoord,
	fromPlace: itin.fromPlace,
	toCoord:   itin.toCoord,
	toPlace:   itin.toPlace,
	time:      time,
	Min:       'X', // fewest transfers
	appID:     '828B87D6ABC0A9DF142696F76'
    };

    // http://stackoverflow.com/questions/6554039/how-do-i-url-encode-something-in-node-js
    var qs = querystring.stringify(params);
    var wsurl = 'http://developer.trimet.org/ws/V1/trips/tripplanner?' + qs;
    
    request(wsurl, function (err, res, body) {
	if (!err && res.statusCode == 200) {
	    // choose the best itinerary
	    // should probably try to share code with tbdhotel.js, but this is a 
	    // bit different because we never throw itineraries out but only cost against them.
	    // a long itinerary is better than none at all.
	    var lowcost = Infinity;
	    var bestItin = null;
	    $(body).find('itinerary').each(function (ind, itin) {
		var itin = $(itin);
		
		// TODO: handle throughroutes when formulating narrative

		// in the mobile app, 

		// route 90 is an alternate number for MAX
		// 90: MAX Red Line
		// 100: MAX Blue Line
		// 190: MAX Yellow Line
		// 193: Streetcar
		// 200: MAX Green Line
		var freqService = ['4', '6', '8', '9', '12', '14',
				   '15', '33', '54', '56', '57',
				   '72', '75', '90', '100', '190', '193',
				   '200'];
		var isFreqService = true;
		itin.find('leg route internalNumber').each(function () {
		    if ($.inArray($(this).text(), freqService) == -1) {
			console.log('route ' + 
				    itin.find('leg route internalNumber')
				    .first().text() +
				    ' is not Frequent Service');
			isFreqService = false;
		    }
		});

		var cost = Number(itin.find('time-distance duration').first().text()) +
		    0.1 * Number(itin.find('fare regular').first().text());

		// penalize equivalent of 30 mins for non-frequent-service route
		if (!isFreqService) cost += 30;

		if (cost < lowcost) {
		    bestItin = itin;
		    lowcost = cost;
		}
	    });
	    cb(bestItin);
	}
	else {
	    cb(null);
	}
    });
}


/** 
 * Index: grab the requested trip from the 3 character identifier
 */
exports.index = function(req, res){
    // they are *always* lower case
    var itinID = req.params.id.toLowerCase();

    // fetch the itinerary
    var itin = itineraries[itinID];
    if (itin == undefined) {
	res.render('notfound', { status: 404, id: itinID, title: 'Not Found' });
    }
    else {
	console.log(itin);
	// get a trip plan
	getTripPlan(itin, function (tp) {
	    res.render('index', { title: itinID });
	});
    }
};


/**
 * Validate a data structure for saving.
 * @param {object} data
 * @returns {bool} is it valid, or not?
*/
function isValid (data) {
    // TODO: do something in here
    return true;
}

/**
 * newUrl: make a new short url
 */
exports.newUrl = function (req, res) {
    // TODO: validation
    
    // some deliberately left out to avoid confusion
    var letters = 'abcdefghjkmnpqrstuvwxyz23456789';
    var numbers = '23456789';

    // get a new three letter code
    while (true) {
	var code = '';

	// 
	for (var i = 0; i < CODE_LENGTH; i++) {
	    // make the middle one a number so that untoward words will
	    // not be spelled out.
	    if (i == 1) {
		code += numbers[Math.round(Math.random() * (numbers.length - 1))];
	    }
	    else {
		code += letters[Math.round(Math.random() * (letters.length - 1))];
	    }
	}

	if (itineraries[code] == undefined) {
	    break;
	}
    }

    // create and validate the data structure
    var data = {};
    // http://stackoverflow.com/questions/6912584/how-to-get-get-query-string-variables-in-node-js
    data.fromCoord = req.query.fromCoord;
    data.from      = req.query.fromPlace;
    data.toCoord   = req.query.toCoord;
    data.toPlace   = req.query.toPlace;
    // delete after 24 hours
    data.lifetime  = new Date().getTime() + 24 * 60 * 60 * 1000;

    if (isValid(data)) {
	itineraries[code] = data;
	res.end(code + '\n');
    }
    else {
	res.statusCode = 400; // bad request
	res.end('bad data\n');
    }
};