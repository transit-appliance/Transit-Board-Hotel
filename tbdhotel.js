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
*/

if (typeof com == 'undefined') com = {};
if (com.transitboard == undefined) com.transitboard = {};

if (typeof console == 'undefined') console = {
    log: function (msg) {}};

com.transitboard.hotel = function (realTimeArrivals) {
    var instance = this;
    this.realTimeArrivals = realTimeArrivals;

    // we get top billing
    this.addAttribution('Transit Board&#153; Hotel, a ' +
		   '<a href="http://portlandtransport.com">Portland Transport' +
		   '</a> Production.');
 
    for (var agency in realTimeArrivals.stopsConfig) {
        this.addAttribution(
	    this.realTimeArrivals.agencyCache.agencyData(agency).rights_notice);
    }

    // set up custom CSS
    if (this.util.replaceNone(
	this.realTimeArrivals.optionsConfig.stylesheet) != undefined) {
	for (var i = 0; i < this.realTimeArrivals.optionsConfig.stylesheet.length;
	     i++)
	    $('head').append('<link rel="stylesheet" type="text/css" href="'+
			   this.realTimeArrivals.optionsConfig.stylesheet[i] +
			   '" />');
    }

    // parse out the destinations
    var destIds = this.realTimeArrivals.optionsConfig.destinations[0].split(',');
    console.log('destinations: ' + destIds.join(' '));

    // TODO:
    // Once CouchDB supports CORS, we should use the Multiple Document Interface
    this.destinations = [];

    // this will be passed to $.when so that we get a callback when all have 
    // completed
    var requests = [];

    var destLen = destIds.length;
    for (var i = 0; i < destLen; i++) {
	requests.push($.ajax({
	    url: 'http://transitappliance.couchone.com/destinations/' + 
		destIds[i],
	    dataType: 'jsonp',
	    success: function (data) {
		instance.destinations.push(data);
	    },
	    error: function () { 
		console.log('error retrieving destination ' + destIds[i]);
	    }
	}));
    }

    // figured it out from
    // comments on http://www.erichynds.com/jquery/using-deferreds-in-jquery/
    // and http://jsfiddle.net/ehynds/MU3Rq/
    $.when.apply(null, requests).done(function () {
	console.log('retrieved all destinations successfully');
	// do something cool
	instance.doDisplay();
    }).fail(function () { 
	// TODO: What to do in this case?
	console.log('failed');
    });

    // add the mapquest attribution
    this.addAttribution('Walking directions courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">');
}

// util functions in this namespace
com.transitboard.hotel.prototype.util = {};

/**
 * return undefined for '' or [''], otherwise input. Used to parse options.
 * b/c the config tool gives us options like cloudmadeStyle=''
 * @param {object} input The input
 * @returns {object}
*/
com.transitboard.hotel.prototype.util.replaceNone = function (input) {
    if (input == '' |
	input == [''])
	return undefined;
    else return input;
};

// This jump-starts the display
com.transitboard.hotel.prototype.doDisplay = function () {
    var instance = this;

    var originRaw = this.realTimeArrivals.optionsConfig.origin[0].split(',');
    var origin = new L.LatLng(Number(originRaw[0]), Number(originRaw[1]));

    // Init the map
    // allow them to set either a CloudMade style or a custom tile server
    if (this.util.replaceNone(
	this.realTimeArrivals.optionsConfig.cloudmadeStyle) != undefined) {
	// config section
	// it'd be better if the key was left as is, so that we can track traffic
	// style #46244 is the one Matt built for this project
	var tileUrl = 'http://{s}.tile.cloudmade.com/2d634343963a4426b126ab70b62bba2a/'+
	    this.realTimeArrivals.optionsConfig.cloudmadeStyle[0] +
	    '/256/{z}/{x}/{y}.png';
	
	var tileAttr = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade';
    }
    else if (this.util.replaceNone(
	this.realTimeArrivals.optionsConfig.tileUrl) != undefined) {
	var tileUrl = this.realTimeArrivals.optionsConfig.tileUrl[0]
	if (com.transitboard.hotel.replaceNone(
	    this.realTimeArrivals.optionsConfig.tileAttr) != undefined)
	    var tileAttr = this.realTimeArrivals.optionsConfig.tileAttr[0]
	else var tileAttr = '';
    }
    else {
	// config section
	// it'd be better if the key was left as is, so that we can track traffic
	// style #46244 is the one Matt built for this project
	var tileUrl = 'http://{s}.tile.cloudmade.com/2d634343963a4426b126ab70b62bba2a/46244/256/{z}/{x}/{y}.png';
	
	var tileAttr = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade.';
    }    

    this.addAttribution(tileAttr);

    var baseLayer = new L.TileLayer(tileUrl, 
				    {maxZoom: 18});

    var transitOverlayLayer = new L.TileLayer("gis/trimetTiles/{z}/{x}/{y}.png",
				       {maxZoom: 18});
    this.addAttribution('Rail line info courtesy TriMet.');

    // initially empty
    this.walkLayer = new L.MultiPolyline([]);
    this.transitLayer = new L.MultiPolyline([]);

    // make it block positioned but invisible
    // Leaflet will not init right if we put it in an invisible element
    $('#container').css('opacity', '0').css('display', 'block');
    // add this back
    this.map = new L.Map('map', {
	attributionControl: false, // attr is handled separately.
	zoomControl: false // zoom is automatic
    })
	.addLayer(baseLayer)
	.addLayer(transitOverlayLayer)
	.addLayer(this.walkLayer)
	.addLayer(this.transitLayer)
	.setView(origin, 15);

    // make sure we make it visible again! else jQuery will fade it 0 in
    // to 0
    $('#container').css('display', 'none').css('opacity', '1');

    this.addAttribution('Weather courtesy Yahoo! Weather.');
    this.updateWeather();
    // update the weather once every 20 minutes
    setInterval(this.updateWeather, 20*60*1000);

    // set up the info bar
    var hu = $(window).height() / 100;
    $('#bar').height(6*hu);
    $('#bar-location span').text(this.realTimeArrivals.optionsConfig.originName[0]);
    $('#bar-location').textfill({
	maxFontPixels: $('#bar').height()
    });
    // don't overzoom the image
    // we have to do this before inserting the image,
    // or it will force the bar large, then size to the forced size
    // just do it once, to prevent creep.
    if ($('#bar').height() < 100)
	$('#bar-icon img').attr('height', $('#bar').height() - 10);

    // update the clock every 15 seconds
    this.updateClock();
    setInterval(this.updateClock, 15*1000);

    // TODO: 8 mins correct amount of time?
    setInterval(this.updateTripPlans, 8*60*1000);
    // seed the data before we display it
    this.updateTripPlans().done(function () {
	// main loop
	instance.showDestination(0);
    });
}

com.transitboard.hotel.prototype.showDestination = function (iteration) {
    var instance = this;
    var dest = this.destinations[iteration];
    
    // this is called if the destination is unreasonable or when it is done
    var showNext = function () {
	$('#container').fadeOut(500);
	
	// wait 550 ms, then show the next slide
	setTimeout(function () {
	    iteration++;
	    if (iteration < instance.destinations.length) 
		instance.showDestination(iteration);
	    else 
		instance.showAttribution();
	}, 550)
    }
    
    // no route
    if (dest.itinerary == null) {
	showNext();
	return;
    }

    // set the sizes
    // one height unit = 1%
    var hu = $(window).height() / 100;

    // set up non-slideshow components
    // put text in spans so it will be resized
    $('#main-text').html('<span>' + dest.properties.name + '</span>');
    if (dest.properties.subtitle != null) {
	$('#subhead').html('<span>'+dest.properties.subtitle+'</span>');
	
	// now, allocate screen real estate
	var totalText = dest.properties.name.length + 
	    dest.properties.subtitle.length;
	// The weighting factors here were found by trial and (mostly) error
	var percentName = 85 * dest.properties.name.length / totalText;
	var percentSub = 90 - percentName;
    }
    // no subtitle
    else {
	var percentName = 100;
	var percentSub = 0;
	// clear out any old subtitle
	$('#subhead').text('');
    }

    $('#main-text').css('width', percentName + '%');
    $('#subhead').css('width', percentSub + '%');

    // get rid of the last destinations images
    $('.photo').remove();

    // add the slideshow images
    // there is a maximum of 4 with the current data architecture. 
    // 2 is reasonable
    var html = '';
    for (var i = 1; i <= 4; i++) {
	// stored as image[1...4]_url, since it comes from a Shapefile
	var imageUrl = dest.properties['image' + i + '_url'];
	// was _attribution
	var imageAttr = dest.properties['image' + i + '_att'];
	// was _source_url
	var imageAttrUrl = dest.properties['image' + i + '_sou'];
	if (imageUrl != null) {
	    // figure out the scaling
	    
	    html += '<li class="photo" width="100%" height="100%">' +
	    '<a href="' + imageAttrUrl + '">' +
	    '<span class="photo_attribution">' + imageAttr + '</span>' +
		// hide it until it loads
	    '<img src="' + imageUrl + '" style="display: none" />' +
	    '</li></a>\n';
	}
    }

    $('#slideshow ul').prepend(html);

    // set up the narrative
    var time = 0;
    var narr = '';
    $.each(dest.itinerary.legs, function (ind, leg) {
	if (leg.type == 'walk') {
	    // capitalize first
	    if (ind == 0) var lett = 'W';
	    else var lett = 'w';
	    narr += '<span id="narrative-leg-' + ind + 
		'" class="narrative-leg">' + 
		lett + 'alk to ' + leg.toPlace + 
		'</span>, ';
	}
	else if (leg.type == 'transit') {
	    if (ind == 0) var lett = 'B';
	    else var lett = 'b';
	    narr += '<span id="narrative-leg-' + ind + 
		'" class="narrative-leg">' + 
		lett + 'oard ' + leg.headsign +
		' <span class="rtarrivals">(next: ' + 
		// agency is hard-wired for now
		instance.formatArrivals(
		    instance.getRealTimeArrivals(
			'TriMet:' + leg.startId,
			leg.routeId,
			leg.headsign
		    )
		) +
		')</span>,' +
		' offboard at ' + leg.toPlace + 
		' (' + leg.noStops + ' stops)' +
		'</span>, ';
	}
	time += leg.time;
    });

    // get rid of the last ', '
    narr = narr.slice(0, -2) + '.';
    
    // set up the trip details
    var fare = dest.itinerary.fare;

    $('#narrative').html('<span>' + narr + '</span>');

    $('#trip-details').html('<span><span class="trip-time">' + Math.round(time) + ' min</span>'+
			    // TODO: i10n
			    '<span class="trip-fare">$' + fare.toFixed(2) + ' USD each way</span></span>');

    var imageTimeout = 
	1000 * Number(
	    this.util.replaceNone(
		this.realTimeArrivals.optionsConfig.imageTimeout) || 3);
   // set slideUps for each image in turn
    var i = 1;
    $('.photo').each(function () {
	// this is a DOM element, not a jquery element
	var photo = $(this);

	setTimeout(function () {
	    photo.slideUp(300);
	}, i * imageTimeout);
	i++;
    });

    // Do things with the map
    // this is the time the images are done hiding
    var base = ((i-1) * imageTimeout) + 300;

    // First, get all of the geometries on there, and set timeouts for them to
    // be activated
    this.walkLayer.clearLayers();
    this.transitLayer.clearLayers();
    var firstGeom; // this stores the first geometry, which will be shown
    // as soon as the container fades in

    var colors = {
	// these spans are actually hidden, but their CSS attrs are used on
	// the map
	walk: $('.map-walk-color').css('color'),
	transit: $('.map-transit-color').css('color')
    };

    var opacities = {
	walk: $('.map-walk-color').css('opacity'),
	transit: $('.map-transit-color').css('opacity')
    };

    $.each(dest.itinerary.legs, function (ind, leg) {
	if (leg.type == 'walk') {
	    var geom = new L.Polyline(leg.geometry, {color: colors.walk,
						     opacity: opacities.walk});
	    instance.walkLayer.addLayer(geom);
	}
	else if (leg.type == 'transit') {
	    var geom = new L.Polyline(leg.geometry, 
				      {color: colors.transit,
				       opacity: opacities.transit});
	    instance.transitLayer.addLayer(geom);
	}
	// 12s per leg
	// highlight the first leg immediately
	// do pan and zoom
	if (ind > 0)
	    setTimeout(function () { instance.highlightLeg(ind, geom, true) },
		       base + (ind * 12000));
	// the first leg is highlighted after the fadein, so save it
	else
	    firstGeom = geom;
    });

    // Show the next slide
    // 5s per map slide
    setTimeout(showNext, base + (dest.itinerary.legs.length * 12000));    

    // have to do this before setting sizes. You'll never see it it's so fast
    // fade in, 0.5s
    $('#container').fadeIn(500);
    
    // allow the subhead to slide over next to the head
    $('#main-text').height(10*hu).textfill({maxFontPixels: 10*hu})
	.css('width', $('#main-text span').width() + 'px');
    $('#subhead').height(10*hu).textfill({maxFontPixels: 7*hu});
    $('#head-box').height(10*hu);

    $('.photo-attribution').css('font-size', 4*hu + 'px');

    $('#slideshow').height(54*hu);

    var viewport = {x: $('#slideshow').width(), y: $('#slideshow').height()};
    // set the height of the li so that the next image is pushed down
    // out of sight.
    $('.photo').css('height', (viewport.y + 15) + 'px');

    $('.photo a img').each(function (ind, domPhoto) {
	photo = $(domPhoto);
	// set up the viewport when the photo has loaded, so that the sizes
	// are present.
	photo.load(function () {

	    // figure out the vertical and horizontal scaling to get a 15% crop on each side
	    // (the max acceptable) and then use the smaller scaling factor
	    
	    // HTML5 naturalWidth/height not yet available through jQuery, 
	    // I believe
	    // thanks to http://stackoverflow.com/questions/318630/get-real-image-width-and-height-with-javascript-in-safari-chrome
	    // for the tip to recieve image sizes
	    var photoSize = {x: domPhoto.naturalWidth, y: domPhoto.naturalHeight};
	    
	    var vert = (1.3 * viewport.y)/photoSize.y;
	    var horiz = (1.3 * viewport.x)/photoSize.x;
	    var scale = Math.min (vert, horiz);
	    
	    photo.css('width', String(photoSize.x * scale) + 'px');
	    // center
	    photo.css('position', 'relative')
		.css('top', -0.5*(photo.height() - viewport.y) + 'px')
		.css('left', -0.5*(photo.width() - viewport.x) + 'px');
	    
	    // keep the attribution on top of the image
	    photo.parent().find('.photo_attribution')
		.css('right', -0.5*(photo.width() - viewport.x) + 'px');
	    photo.css('display', 'block');
	});
    });

    // highlight the first leg
    // has to be after slideshow
    // don't pan and zoom
    instance.highlightLeg(0, firstGeom, false);

    $('#trip-box').height(26*hu);

    // nested inside trip-box
    $('#narrative').height(19*hu).textfill();
    $('#trip-details').height(6*hu).textfill();

}

/**
 * Highlight the given leg of the itinerary
 * @param {number} index The index of the leg
 * @param {L.Polyline} legGeom The leg geometry in an L.Polyline
 * @param {boolean} panZoom Whether to pan and zoom
*/
com.transitboard.hotel.prototype.highlightLeg = function (index, legGeom, panZoom) {
    $('.narrative-leg').removeClass('narrative-highlighted');
    $('#narrative-leg-' + index).addClass('narrative-highlighted');
    this.zoomToBounds(legGeom.getBounds(), panZoom);
}

/**
 * Zoom the map to the given bounds
 * @param {L.LatLngBounds} bounds The bounds to zoom to
 * @param {boolean} panZoom Whether to pan and zoom the map
*/
com.transitboard.hotel.prototype.zoomToBounds = function (bounds, panZoom) {
    // make sure the map is using its current size; it gets confused
    // sometimes what with the hide/unhide
    this.map.invalidateSize();
    // it will implicitly convert the list to a number; if you specify
    // maxZoom 2+ times, behavior is undefined
    var maxZoom = Number(this.util.replaceNone(
	this.realTimeArrivals.optionsConfig.maxZoom) || 16);
    // don't overzoom
    var z = Math.min(this.map.getBoundsZoom(bounds), maxZoom);
    this.map.setView(bounds.getCenter(), z, !panZoom);
}

com.transitboard.hotel.prototype.showAttribution = function () {
    var instance = this;
    $('#attribution').fadeIn(500);
    $('#attribution').textfill();

    setTimeout(function () {
	$('#attribution').fadeOut(500);
    }, 4500); // show for four seconds, plus fade

    setTimeout(function () {
	instance.showDestination(0);
    }, 5050); // then show the first destination 50 ms after the fade finishes.
}

// Add an attribution string
com.transitboard.hotel.prototype.addAttribution = function (attr) {
    $('#attribution span').append(attr + '<br/>');
    // Can't do textfill here b/c object is likely invisible
}

// This updates the trip plans. It runs occasionally
// This one is set up exclusively for TriMet

// it should add a .itinerary attribute to each destination, or make it
// null if there is no trip

/* here is the format of .itinerary

fromPlace (name)
fromCoord (x,y)
toPlace
toCoord
fare
time
start
end
legs [ ]

LEGS:
type == 'walk':
fromCoord
fromPlace
toCoord
toPlace
geometry (an array of L.LatLngs)
time (in mins)
distance (in meters)

type == 'transit':
Everything for walk, also:
routeId (The route ID, not publically shown)
headsign
startId (the stop ID of the start, in the format TriMet:8989
endId
noStops (the number of stops)
blockGeoWS (the param for BlockGeoWS, as returned by the TriMet API. Will be
  retired when OTP hits the scene. Looks like 9045,A,2:12 PM,10579,2:26 PM,8370)

startPlace/endPlace should be the stop or station name.

*/

com.transitboard.hotel.prototype.updateTripPlans = function () {
    var instance = this;
    console.log('updating trip plans');

    // the first time, the caller needs to know when this is done
    var df = $.Deferred();

    // keep a local copy
    var localDests = this.destinations;

    // make a list to pass to jQuery.when
    var rqs = [];

    $.each(localDests, function (ind, dest) {
	// have to use 2 deferreds, one in the getTripPlan... fcn,
	// b/c otherwise the callback on the $.when could be called
	// before the last itinerary had been saved. There is no guarantee
	// what order callbacks will be executed in, I don't believe
	var tp = $.Deferred();

	// returns a deferred, callback will save itinerary
	var rq = instance.getTripPlanForDest(dest).then(function (itin) {
	    localDests[ind].itinerary = itin;
	    tp.resolve();
	});
	rqs.push(tp);
    });

    // when all the requests return, copy localDests to destinations
    $.when.apply(null, rqs).done(function () {
	console.log('finished retrieving destinations');
	instance.destinations = localDests;

	// allow more requests to be made
	df.resolve();
	
	// force the images to be cached
	$.each(localDests, function (ind, dest) {
	    for (var i = 1; i <= 4; i++) {
		if (dest.properties['image' + i + '_url'] != null) {
		    $('#cache-force-area').append(
			'<img src="' + dest.properties['image' + i + '_url'] + '"/>'
		    );
		}
	    }
	});
    });

    return df;
}

/**
 * This function handles getting trip plans for a destination
 * @param {object} dest The destination to fetch data for.
 * @returns {jQuery.Deferred} deferred Callbacks attached to this will get the itinerary (described above) upon success.
*/
com.transitboard.hotel.prototype.getTripPlanForDest = function (dest) {
    // this consists of two steps: getting the trip plan, and then getting
    // all the geometries (walk and transit). When OTP API is implemented,
    // one API call will suffice
    var instance = this;
    var df = $.Deferred();

    this.getTripPlanOnly(dest).then(function (itin) {
	if (itin != null) {
	    instance.fillOutGeometries(itin).then(function (itin) {
		df.resolve(itin);
	    });
	}
	else df.resolve(null); // no itin found
    });					  

    return df;
}

/**
 * Talk to the TriMet TP WS.
 * @param {object} dest the destination
 * @returns {jQuery.Deferred} df Callbacks attached will receive the itinerary,
 * less the geometries.
*/
com.transitboard.hotel.prototype.getTripPlanOnly = function (dest) {
    var instance = this;

    var deferred = $.Deferred();

    // format the time to TriMet's liking
    // we have to put in a time or we get no results, as documented
    var now = timeInZone('America/Los_Angeles');
    var hour = now.getHours() % 12;
    var mins = now.getMinutes();
    
    if (mins < 10) mins = '0' + mins;

    if (hour == 0) hour = 12;
    if (now.getHours() >= 12) var ap = 'pm';
    else                      var ap = 'am';

    var time = hour + ':' + mins + ' ' + ap;

    // documented at http://developer.trimet.org/ws_docs/tripplanner_ws.shtml
    var tripPlannerParams = {
	fromPlace: this.realTimeArrivals.optionsConfig.originName[0],
	// reverse the lat,lon to be lon,lat
	fromCoord: this.realTimeArrivals.optionsConfig.origin[0].split(',')[1] 
	    + ',' + 
	    this.realTimeArrivals.optionsConfig.origin[0].split(',')[0],
	time: time,
	min: 'X', // fewest transfers
	appID: '828B87D6ABC0A9DF142696F76',
	toPlace: dest.properties.name,
	// already in lon, lat
	toCoord: dest.geometry.coordinates.join(',')
    };

    var rq = $.ajax({
	url: 'http://developer.trimet.org/ws/V1/trips/tripplanner',
	data: tripPlannerParams,
	dataType: 'xml',
	timeout: 100000,
	success: function (data) {
	    data = $(data);
	    // parachute out
	    if (data.find('error').length != 0) {
		console.log('error on destination ' +
			    dest.properties.name + ': ' +
			    data.find('error').text());
		// skip it
		deferred.resolve(null);
		return;
	    }

	    var lowCost = 1000000000;
	    var bestItin = null;
	    // loop through the itineraries, find the lowest-cost one
	    data.find('itinerary').each(function(ind, itin) {
		itin = $(itin);
		// make sure it fits hard requirements (0 transfers,
		// allowed stop), frequent service
		// TODO: allowed stop
		if (itin.find('numberOfTransfers').text() != '0') {
		    console.log('Trip has transfers!');
		    return true;
		}
	    
					
		// We don't handle throughroutes yet (issue 43)
		if (Number(itin.find('numberOfTripLegs').text()) > 3) {
		    console.log('Too many trip legs, probably issue 43!');
		    return true;
		}

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
		if ($.inArray(itin.find('leg route internalNumber')
			      .first().text(), 
			      freqService) == -1) {
		    console.log('route ' + 
				itin.find('leg route internalNumber')
				.first().text() +
				' is not Frequent Service');
		    return true;
		}

		// these two tests are both transfer safe, b/c we only care about restrictions on the first legs
		// stop id of this itin
		var sid = itin.find('leg from stopId').first().text();
		if (instance.realTimeArrivals.stopsConfig.TriMet[sid] == undefined) {
		    console.log(dest.properties.name + ': stop ' + sid + 
				' is not in the stops config for this appliance!');
		    return true;
		}

		// check for allowed route
		// it should either be explicitly stated or included with *. We assume that all routes
		// TP suggests are also in the real time feed.
		var rid = itin.find('leg route internalNumber').first().text();
		if (instance.realTimeArrivals.stopsConfig.TriMet[sid][rid] == undefined &
		    instance.realTimeArrivals.stopsConfig.TriMet[sid]['*'] == undefined) {
		    console.log(dest.properties.name + ': stop ' + sid + ' is allowed, but route ' + 
				rid + ' is specifically excluded from the configuration.');
		    return true;
		}
		
		// TODO: weights?
		var cost = Number(itin.find('time-distance duration').first().text()) +
		    0.1 * Number(itin.find('fare regular').first().text());
		
		// save this one, for now
		if (cost < lowCost) bestItin = itin;
	    });
	    
	    if (bestItin != null) {
		console.log('best itinerary for dest ' + 
			    dest.properties.name + ' via ' +
				bestItin.attr('viaRoute'));
		
		// set up the itinerary, normalize format
		var itinOut = {};
		itinOut.fromPlace = data.find('param[name="fromPlace"]').text();


		// need to switch lat, lon (y, x) to x,y
		var fromParam = data.find('param[name="fromCoord"]').text()
		    .split(', ');
		itinOut.fromCoord = fromParam[1] + ',' + fromParam[0];
		itinOut.toPlace = data.find('param[name="toPlace"]').text();

		var toParam = data.find('param[name="toCoord"]').text()
		    .split(', ');
		// for some reason, toCoord is not in TriMet return XML
		itinOut.toCoord = dest.geometry.coordinates.join(',');

		// use the total fare
		itinOut.fare = Number(bestItin.find('fare regular').first().text());

		itinOut.legs = [];

		// this should work without modification once we allow transfers
		bestItin.find('leg').each(function (ind, leg) {
		    leg = $(leg);
		    var legOut = {};
		    legOut.fromCoord = leg.find('from pos lon').text() + 
			',' + leg.find('from pos lat').text();
		    legOut.fromPlace = leg.find('from description').text();
		    legOut.toCoord = leg.find('to pos lon').text() + 
			',' + leg.find('to pos lat').text();
		    legOut.toPlace = leg.find('to description').text();
		    var from = instance.util.reverseCoord(legOut.fromCoord)
			.split(',');
		    var to = instance.util.reverseCoord(legOut.toCoord)
			.split(',');
		    legOut.geometry = [new L.LatLng(Number(from[0]),
						    Number(from[1])),
				       new L.LatLng(Number(to[0]), 
						    Number(to[1]))];

		    if (leg.attr('mode') == 'Walk') {
			legOut.type = 'walk';
		    }
		    else {
			legOut.type = 'transit'
			legOut.headsign = leg.find('route name').text();
			legOut.time = Number(leg.find('time-distance duration').text());
			legOut.startId = leg.find('from stopId').text();
			legOut.endId = leg.find('to stopId').text();
			legOut.routeId = leg.find('route internalNumber').text();
			legOut.noStops = 
			    Number(leg.find('to stopSequence').text()) -
			    Number(leg.find('from stopSequence').text());
			// for the geometries
			legOut.blockGeoWS = leg.find('lineURL').attr('param');
		    }
		    itinOut.legs.push(legOut);
		});
	    }
	    else {
		itinOut = null;
		console.log('no route to dest ' + dest.properties.name);
	    }

	    deferred.resolve(itinOut);
		
	},
	error: function (x, stat) {
	    console.log('error loading trip plan for dest ' +
			dest.properties.name + ': ' + stat);
	    // TODO: resolve df somehow
	}
    });		    
    return deferred;
}

/**
 * Fill out the transit and walk geometries
 * stubbed for now
 * @param {object} itin The itinerary to complete
 * @returns {jQuery.Deferred} deferred Callbacks will be called with the
 * completed itinerary.
*/
com.transitboard.hotel.prototype.fillOutGeometries = function (itin) {
    var instance = this;
    var df = new $.Deferred();
    var rqs = [];

    $.each(itin.legs, function(ind, leg) {
	if (leg.type == 'walk') {
	    var rq = instance.getWalkingDirections(leg.fromCoord, leg.toCoord);
	}
	else if (leg.type == 'transit') {
	    // it will return just like getWalkingDirections:
	    // {geometry: L.LatLng[], length: (int in m), time: (int in min)}
	    var rq = instance.getTransitGeometry(leg);
	}
	 
	// no need for two deferreds, b/c callbacks are called in order
	rq.then(function (result) {
	    itin.legs[ind].geometry = result.geometry;
	    itin.legs[ind].length = result.length;
	    itin.legs[ind].time = result.time;
	});
	rqs.push(rq);
    });	   

    $.when.apply(null, rqs).then(function () {
	df.resolve(itin);
    });

    return df;
}

/**
 * Reverses the order of coordinates in a coordinate string
 * @param {string} coord The coordinate to reverse
 * @returns {string} the reversed coordinates
*/
com.transitboard.hotel.prototype.util.reverseCoord = function (coord) {
    var splitC = coord.split(',');
    return splitC[1] + ',' + splitC[0];
}

/**
 * Decode a MapQuest compressed line into an array of Leaflet LatLngs
 * Copied almost verbatim from http://soulsolutions.com.au/Default.aspx?tabid=96
 * @param {string} encoded The encoded string
 * @returns {L.LatLng[]} the decoded sting
*/
com.transitboard.hotel.prototype.util.decodeCompressedLine = function (encoded) {
    var len = encoded.length;
    var index = 0;
    var array = [];
    var lat = 0;
    var lng = 0;
    try
    {
        while (index < len) {
            var b;
            var shift = 0;
            var result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            var dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lat += dlat;

            shift = 0;
            result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            var dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lng += dlng;

	    // modified to use Leaflet
            array.push(new L.LatLng((lat * 1e-5), (lng * 1e-5)));
        }
    } catch(ex)
    {
        //error in encoding.
    }
    return array;
}

/**
 * Get the distance from one lat/lon to another, in meters
 * Currently assumes WGS84 LatLngs in the State Plane Oregon North area
 * If conditions are met, results will have error <= 1 part in 10,000
 * @param {L.LatLng} from
 * @param {L.LatLng} to
*/
com.transitboard.hotel.prototype.util.distanceBetween = function (from, to) {
    var startPt = new Proj4js.Point(from.lng, from.lat);
    var endPt = new Proj4js.Point(to.lng, to.lat);
    var wgs84 = new Proj4js.Proj('EPSG:4326');
    // State Plane OR N - feet. TriMet specific.
    var sporn = new Proj4js.Proj('EPSG:2913');
    Proj4js.transform(wgs84, sporn, startPt);
    Proj4js.transform(wgs84, sporn, endPt);
    
    // now we can get the distance in feet using the Pythagoream Theorem
    var distance = Math.sqrt(Math.pow((startPt.x - endPt.x), 2) + Math.pow((startPt.y - endPt.y), 2));
    // convert to meters
    return 0.3048 * distance;
}

/**
 * Get walking directions from fromCoord (x,y/lon,lat) to toCoord
 * @param {string} fromCoord Such as "-122.123,37.363"
 * @param {string} toCoord same as fromCoord
 * @returns {jQuery.Deferred} deferred A Deferred. Callbacks attached will be 
 * called with an object - .length is the length in meters, and .geometry is an
 * array of L.LatLng representing the walk geometry
*/
com.transitboard.hotel.prototype.walkGeomCache = {};
com.transitboard.hotel.prototype.getWalkingDirections = function (fromCoord, toCoord) {
    var instance = this;
    var df = $.Deferred();
    
    // check the cache
    if (this.walkGeomCache[fromCoord] != undefined) {
	if (this.walkGeomCache[fromCoord][toCoord] != undefined) {
	    df.resolve(this.walkGeomCache[fromCoord][toCoord]);
	    return df; // jump out
	}
    }

    $.ajax({
	url: 'http://open.mapquestapi.com/directions/v0/route',
	data: {
	    outFormat: 'json',
	    from: this.util.reverseCoord(fromCoord),
	    to: this.util.reverseCoord(toCoord),
	    routeType: 'pedestrian',
	    shapeFormat: 'cmp',
	    units: 'k', // km - metric (SI) system
	    generalize: 0 // no simplification, we may be quite zoomed in
	},
	dataType: 'jsonp',
	success: function (data) {
	    console.log('received walk geometry');

	    // check if there was an error
	    if (data.info.statuscode != 0) {
		console.log('Error ' + data.info.statuscode +
			    ' retrieving walk directions from ' +
			    fromCoord + ' to ' + toCoord + ': ' +
			    data.info.messages.join('; '));

		var from = instance.util.reverseCoord(fromCoord).split(',');
		var to = instance.util.reverseCoord(toCoord).split(',');
		var geom = [new L.LatLng(Number(from[0]), Number(from[1])),
			    new L.LatLng(Number(to[0]), Number(to[1]))];

		// in an Old World street grid, the maximum distance between two points is 
		// 2^(1/2) * air distance
		var dist = 1.41421 * instance.util.distanceBetween(geom[0], geom[1]);

		// 53 m/min ~= 2 mph
		df.resolve({geometry: geom, length: dist, time: dist / 53});
		return;
	    }

	    // decode the compressed geometry
	    var geom = instance.util.decodeCompressedLine(
		data.route.shape.shapePoints
	    );

	    // add the start and end geometries
	    // the reason we do this is that MapQuest API snaps to the nearest
	    // node, which can lead to some odd-looking paths in sparse OSM 
	    // areas. This will at least give the general idea
	    var from = instance.util.reverseCoord(fromCoord).split(',');
	    var to = instance.util.reverseCoord(toCoord).split(',');
	    geom.unshift(new L.LatLng(Number(from[0]), Number(from[1])));
	    geom.push(new L.LatLng(Number(to[0]), Number(to[1])));

	    // km to m; if the route is quite short (<500m) we may get 0m;
	    // also the number may be in error by as much as 500m. Something
	    // to be aware of.
	    var length = data.route.distance * 1000; 

	    // save it in the cache
	    var route = {geometry: geom, length: length, time: data.route.time/60};
	    if (instance.walkGeomCache[fromCoord] == undefined)
		instance.walkGeomCache[fromCoord] = [];
	    instance.walkGeomCache[fromCoord][toCoord] = route;
	    df.resolve(route);
	}
    });

    return df;
}

/** 
 * Get the geometry for a transit leg from TriMet BlockGeoWS,
 * using JSON-P
 * @param {object} leg A standard leg object as used elsewhere in the app, 
 * presumably with geometry, length and time undefined (but the fcn won't check)
 * @returns {jQuery.Deferred} A deferred that will resolve with the argument
 * {geometry: L.LatLng[], length: (int m), time: (int mins)}
*/
com.transitboard.hotel.prototype.getTransitGeometry = function (leg) {
    var instance = this;
    var df = new $.Deferred();
    
    $.ajax({
	url: 'http://maps.trimet.org/ttws/transweb/ws/V1/BlockGeoWS/',
	data: {
	    appID: '828B87D6ABC0A9DF142696F76',
	    // I think this stands for block, start time, start stop ID, 
	    // end time, end ID.
	    bksTsIDeTeID: leg.blockGeoWS
	},
	dataType: 'jsonp',
	success: function (data) {
	    // reasonable defaults
	    var retval = {geometry: leg.geometry, time: leg.time, distance: 0};
	    if (data.results[0].error != undefined) {
		console.log('Error retrieving transit geometry using arg ' +
			    leg.blockGeoWS);
		// fall back to point-to-point
		df.resolve(retval);
		return;
	    }

	    // reproject OSPN -> 4326 Lat Lon
	    var the_geom = [];

	    // Oregon State Plane North, NAD83(HARN)
	    var from_proj = new Proj4js.Proj('EPSG:2913');
	    var to_proj = new Proj4js.Proj('EPSG:4326');

	    // should only be one result for a single leg
	    $.each(data.results[0].points, function (ind, pt) {
		var point = new Proj4js.Point(pt.x, pt.y);
		Proj4js.transform(from_proj, to_proj, point);
		// commented out because it produces thousands upon 
		// thousands of lines of output
		/*console.log('transformed ' + pt.x + ',' + pt.y + ' to ' +
			    point.x + ',' + point.y);*/
		the_geom.push(new L.LatLng(point.y, point.x));
	    });

	    retval.geometry = the_geom;
	    // the defaults should be fine for time, leave distance at 0 for now
	    // TODO: calculate distance
	    df.resolve(retval);
	}
    });

    return df;
}

/**
 * Get real time arrivals for a given stop and line
 * It is assumed that the headsign that is passed in is the same as the
 * one returned by the trip planning service. It is further assumed that the
 * stopId is one that arrivals have been requested for; no checking is 
 * performed
 * @param {string} stopId The stop ID arrivals are being requested for
 * @param {string} route The route this vehicle is serving
 * @param {string} headsign The headsign of the requested vehicle
 * @returns {arrivalsQueue} A queue of transit arrivals.
 */
com.transitboard.hotel.prototype.getRealTimeArrivals =  function (stopId, 
								  route, 
								  headsign) {
    // TODO: order for efficiency?
    try {
	var aq = this.realTimeArrivals.arrivalsQueue
	    .minutes(60) // show only imminent arrivals
	    .byStop()[stopId]
	    .byLine()[Number(route)] // TODO: make sure this always works
	    .byDest()[headsign]; // this really means byHeadsign
    }
    catch (err) {
	// return an empty arrivalsQueue
	console.log('no arrivals found');
	return new arrivalsQueue();
    }
    if (typeof aq != 'undefined') {
	return aq
    }
    else {
	console.log('no arrivals found for headsign ' + headsign);
	return new arrivalsQueue();
    }
}
 
/**
 * Format an arrivalsQueue into a string. For now, it assumes the queue is
 * uniform, i.e. all the trips are the same except at different times. It 
 * ignores the headsigns, &c.
 * @param {arrivalsQueue} arrivals
 * @returns {string} like 'Arr, 3 min, 5 min, 8 min, 10 min'
*/
com.transitboard.hotel.prototype.formatArrivals = function (arrivals) {
    var retval = ''
    $.each(arrivals, function (ind, arr) {
	retval += arr.minutes() + '&nbsp;min, '
    });
    // get rid of the last ', '
    return retval.slice(0, -2);
}

com.transitboard.hotel.prototype.updateWeather = function () {
    var instance = this;
    this.weather = {};

    var origin = this.realTimeArrivals.optionsConfig.origin[0].split(',');

    url = '';

    // First, get the WOEID, and save it
    if (this.weather.woeid == undefined) {
	// for now this only works in the US b/c it uses ZIP Codes
	var woeid_xhr = $.ajax({
	    // SELECT postal.content FROM geo.places WHERE text="45,-122" LIMIT 1
	    url: 'http://query.yahooapis.com/v1/public/yql?q=SELECT%20postal.content%20FROM%20geo.places%20WHERE%20text%3D%22' +
		encodeURIComponent(origin[0] + ',' + origin[1]) + 
		'%22%20LIMIT%201&format=json',
	    dataType: 'json',
	    success: function (data) {
		instance.weather.woeid = data.query.results.place.postal;
	    }
	});
    }
    else 
	var woeid_xhr = true;

    // Use $.when to wait for the request to complete; if no request was made
    // just go ahead

    $.when(woeid_xhr).done(function () {
	// SELECT item.condition FROM weather.forecast WHERE location=
	var url = 'http://query.yahooapis.com/v1/public/yql?q=SELECT%20item.condition%20from%20weather.forecast%20WHERE%20location%3D' +
	    instance.weather.woeid + '&format=json';

	$.ajax({
	    url: url,
	    dataType: 'json',
	    success: function (data) {
		instance.weather.condition = 
		    data.query.results.channel.item.condition;
		var text = instance.weather.condition.temp + '&deg; F/' +
		    Math.round((Number(instance.weather.condition.temp) - 32) * (5/9)) +
		    '&deg; C';
		$('#bar-temp span').html(text);
		$('#bar-temp').textfill({
		    maxFontPixels: $('#bar').height()
		});

		// set the icons
		// these are all the Yahoo! condition codes, from
		// http://developer.yahoo.com/weather/
		var icons = {
		    '0': 'weather-icons/severe-alert-100px.png', // tornado
		    '1': 'weather-icons/severe-alert-100px.png', // tropical storm
		    '2': 'weather-icons/severe-alert-100px.png', // hurricane
		    '3': 'weather-icons/severe-alert-100px.png', // severe thunderstorms
		    '4': 'weather-icons/storm-100px.png', // thunderstorms
		    '5': 'weather-icons/snow-100px.png', // mixed rain and snow
		    '6': 'weather-icons/snow-100px.png', // mixed rain and sleet
		    '7': 'weather-icons/snow-100px.png', // mixed snow and sleet
		    '8': 'weather-icons/snow-100px.png', // freezing drizzle
		    '9': 'weather-icons/showers-100px.png', // drizzle
		    '10': 'weather-icons/showers-100px.png', // freezing rain
		    '11': 'weather-icons/showers-100px.png', // showers
		    '12': 'weather-icons/showers-100px.png', // showers
		    '13': 'weather-icons/snow-100px.png', // snow flurries
		    '14': 'weather-icons/snow-100px.png', // light snow showers
		    '15': 'weather-icons/snow-100px.png', // blowing snow
		    '16': 'weather-icons/snow-100px.png', // snow
		    '17': 'weather-icons/snow-100px.png', // hail
		    '18': 'weather-icons/snow-100px.png', // sleet
		    '19': 'weather-icons/overcast-100px.png', // dust - ?
		    '20': 'weather-icons/overcast-100px.png', // foggy
		    '21': 'weather-icons/overcast-100px.png', // haze
		    '22': 'weather-icons/overcast-100px.png', // smoky
		    // since on these we're not sure, choose the middle ground
		    '23': 'weather-icons/few-clouds-100px.png', // blustery
		    '24': 'weather-icons/few-clouds-100px.png', // windy
		    '25': 'weather-icons/few-clouds-100px.png', // cold
		    '26': 'weather-icons/overcast-100px.png', // cloudy
		    '27': 'weather-icons/overcast-100px.png', // mostly cloudy (night)
		    '28': 'weather-icons/overcast-100px.png', // mostly cloudy (day)
		    '29': 'weather-icons/few-clouds-night-100px.png', // partly cloudy (night)
		    '30': 'weather-icons/few-clouds-100px.png', // partly cloudy (day)
		    '31': 'weather-icons/clear-night-100px.png', // clear (night)
		    '32': 'weather-icons/clear-100px.png', // sunny
		    '33': 'weather-icons/clear-night-100px.png', // fair (night)
		    '34': 'weather-icons/clear-100px.png', // fair (day)
		    '35': 'weather-icons/showers-100px.png', // mixed rain and hail
		    '36': 'weather-icons/clear-100px.png', // hot
		    '37': 'weather-icons/storm-100px.png', // isolated thunderstorms
		    '38': 'weather-icons/storm-100px.png', // scattered thunderstorms
		    '39': 'weather-icons/storm-100px.png', // scattered thunderstorms
		    '40': 'weather-icons/showers-scattered-100px.png', // scattered showers
		    '41': 'weather-icons/snow-100px.png', // heavy snow
		    '42': 'weather-icons/snow-100px.png', // scattered snow showers
		    '43': 'weather-icons/snow-100px.png', // heavy snow
		    '44': 'weather-icons/few-clouds-100px.png', // partly cloudy
		    '45': 'weather-icons/storm-100px.png', // thundershowers
		    '46': 'weather-icons/snow-100px.png', // snow showers
		    '47': 'weather-icons/storm-100px.png', // isolated thundershowers
		    '3200': '', // not available
		}

		// The height is already set once, to prevent drift; if it
		// was increased by 1px on each iteration, the info bar would
		// eventually take over the screen.

		$('#bar-icon img')
		    .attr('src', icons[instance.weather.condition.code]);
	    }	
	    // TODO: add fail handler here and above
	});
    });
}
						    

// update the clock, called every 15s
com.transitboard.hotel.prototype.updateClock = function () {
    var now = localTime();
    // is monday 0 in some places?
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var hour = now.getHours() % 12;
    var mins = now.getMinutes();
    
    if (mins < 10) mins = '0' + mins;

    if (hour == 0) hour = 12;
    if (now.getHours() >= 12) var ap = 'PM';
    else                      var ap = 'AM';

    var time = days[now.getDay()] + ' ' + hour + ':' + 
	mins + ' ' + ap;

    $('#bar-datetime span').text(time);
    $('#bar-datetime').textfill({maxFontPixels: $('#bar').height() - 5});
}

$(document).ready(function () {
    // let it be global during dev, so it's easier to debug
    //var tbdh;

    trArr({
	configString: window.location.search,
	displayInterval: 30*1000,
	displayCallback: function (data) {
	    // save the real-time arrivals; they will be ref'd later on
	    // I don't think there's any chance of this being referred to as
	    tbdh.realTimeArrivals = data;
	},
	initializeCallback: function (data) {
	    tbdh = new com.transitboard.hotel(data);
	}
    });
});