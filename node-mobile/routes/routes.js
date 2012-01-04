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

// length of the codes for trips
var CODE_LENGTH = 3;
var itineraries = {};

/**
 * clean out the URLs
 */
setInterval(function () {
    var now = new Date().getTime();
    for (var i in itineraries) {
	if (now < itineraries[i].lifetime) {
	    itineraries[i] = undefined;
	}
    }
}, 10 * 60 * 1000);

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
	res.render('index', { title: itinID })
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
    data.fromCoord = req.params.fromCoord;
    data.from      = req.params.fromPlace;
    data.toCoord   = req.params.toCoord;
    data.toPlace   = req.params.toPlace;
    // delete after 24 hours
    data.lifetime  = new Date().getTime() + 1 * 10 * 60 * 1000;

    if (isValid(data)) {
	itineraries[code] = data;
	res.end(code + '\n');
    }
    else {
	res.statusCode = 400; // bad request
	res.end('bad data\n');
    }
};