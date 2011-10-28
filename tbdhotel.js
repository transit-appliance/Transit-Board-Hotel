if (typeof org == 'undefined') org = {};
if (org.transitappliance == undefined) org.transitappliance = {};

if (typeof console == 'undefined') console = {
    log: function (msg) {}};

org.transitappliance.transitboardhotel = function (realTimeArrivals) {
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
    if (this.realTimeArrivals.optionsConfig.stylesheet != undefined) {
	for (var i = 0; i < this.realTimeArrivals.optionsConfig.stylesheet.length;
	     i++)
	    $('head').append('<link rel="stylesheet" type="text/html" href="'+
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
}

// This jump-starts the display
org.transitappliance.transitboardhotel.prototype.doDisplay = function () {
    var instance = this;

    var originRaw = this.realTimeArrivals.optionsConfig.origin[0].split(',');
    var origin = new L.LatLng(Number(originRaw[0]), Number(originRaw[1]));

    // Init the map
    // allow them to set either a CloudMade style or a custom tile server
    if (this.realTimeArrivals.optionsConfig.cloudmadeStyle != undefined) {
	// config section
	// it'd be better if the key was left as is, so that we can track traffic
	// style #46244 is the one Matt built for this project
	var tileUrl = 'http://{s}.tile.cloudmade.com/2d634343963a4426b126ab70b62bba2a/'+
	    this.realTimeArrivals.optionsConfig.cloudmadeStyle[0] +
	    '/256/{z}/{x}/{y}.png';
	
	var tileAttr = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade';
    }
    else if (this.realTimeArrivals.optionsConfig.tileUrl != undefined) {
	var tileUrl = this.realTimeArrivals.optionsConfig.tileUrl[0]
	if (this.realTimeArrivals.optionsConfig.tileAttr != undefined)
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

    var transitLayer = new L.TileLayer("gis/trimetTiles/{z}/{x}/{y}.png",
				       {maxZoom: 18});
    this.addAttribution('Rail line info courtesy TriMet.');

    // make it block positioned but invisible
    // Leaflet will not init right if we put it in an invisible element
    $('#container').css('opacity', '0').css('display', 'block');
    // add this back
    //{zoomControl: false})
    this.map = new L.Map('map', {
	attributionControl: false // attr is handled separately.
    })
	.addLayer(baseLayer)
	.addLayer(transitLayer)
	.setView(origin, 15);

    // make sure we make it visible again! else jQuery will fade it 0 in
    // to 0
    $('#container').css('display', 'none').css('opacity', '1');

    // seed the data before we display it
    this.updateTripPlans();
    // TODO: 10 mins correct amount of time?
    setInterval(this.updateTripPlans, 10*60*1000);

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

    // main loop
   this.showDestination(0);
}

org.transitappliance.transitboardhotel.prototype.showDestination = function (iteration) {
    var instance = this;
    var dest = this.destinations[iteration];
    
    // TODO: check for reasonableness and skip if necessary

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
	if (imageUrl != null)
	    html += '<li class="photo">'+
	    '<img src="' + imageUrl + '" height="' + hu*52 + '"/></li>\n';
    }

    $('#slideshow ul').prepend(html);

    // have to do this before setting sizes. You'll never see it it's so fast
    // fade in, 0.1s
    $('#container').fadeIn(500);

    $('#main-text').height(10*hu).textfill({maxFontPixels: 10*hu});
    $('#subhead').height(10*hu).textfill({maxFontPixels: 7*hu});
    $('#head-box').height(10*hu);

    $('#slideshow').height(54*hu);
    $('#trip-box').height(23*hu);

    // nested inside trip-box
    $('#narrative').height(16*hu);
    $('#trip-details').height(6*hu);

    var imageTimeout = 
	1000 * Number(this.realTimeArrivals.optionsConfig.imageTimeout || 3);

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
    var base = (i * imageTimeout) + 300;

    // Show the next slide
    setTimeout(function () {
	$('#container').fadeOut(500);
	
	// wait 550 ms, then show the next slide
	setTimeout(function () {
	    iteration++;
	    if (iteration < instance.destinations.length) 
		instance.showDestination(iteration);
	    else 
		instance.showAttribution();
	}, 550);
    }, base + 10*1000);    
}

org.transitappliance.transitboardhotel.prototype.showAttribution = function () {
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
org.transitappliance.transitboardhotel.prototype.addAttribution = function (attr) {
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
route
startId (the stop ID of the start, in the format TriMet:8989
endId
stops (the number of stops)

startPlace/endPlace should be the stop or station name.

*/

org.transitappliance.transitboardhotel.prototype.updateTripPlans = function () {
    var instance = this;
    console.log('updating trip plans');

    // keep a local copy
    var localDests = this.destinations;

    // make a list to pass to jQuery.when
    var rqs = [];

    $.each(localDests, function (ind, dest) {
	// have to use 2 deferreds, one in the getTripPlan... fcn,
	// b/c otherwise the callback on the $.when could be called
	// before the last itinerary had been saved. There is no guarantee
	// what order callbacks will be executed in, I don't believe
	var df = $.Deferred();

	// returns a deferred, callback will save itinerary
	var rq = instance.getTripPlanForDest(dest).then(function (itin) {
	    localDests[ind].itinerary = itin;
	    df.resolve();
	});
	rqs.push(df);
    });

    // when all the requests return, copy localDests to destinations
    $.when.apply(null, rqs).done(function () {
	console.log('finished retrieving destinations');
	instance.destinations = localDests;
    });
}

/**
 * This function handles getting trip plans for a destination
 * @param {object} dest The destination to fetch data for.
 * @returns {jQuery.Deferred} deferred Callbacks attached to this will get the itinerary (described above) upon success.
*/
org.transitappliance.transitboardhotel.prototype.getTripPlanForDest = function (dest) {
    // this consists of two steps: getting the trip plan, and then getting
    // all the geometries (walk and transit). When OTP API is implemented,
    // one API call will suffice
    var instance = this;
    var df = $.Deferred();

    this.getTripPlanOnly(dest).then(function (itin) {
	instance.fillOutGeometries(itin).then(function (itin) {
	    df.resolve(itin);
	});
    });					  

    return df;
}

/**
 * Talk to the TriMet TP WS.
 * @param {object} dest the destination
 * @returns {jQuery.Deferred} df Callbacks attached will receive the itinerary,
 * less the geometries.
*/
org.transitappliance.transitboardhotel.prototype.getTripPlanOnly = function (dest) {
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

    // can't use data arg to ajax b/c we're going to a proxy
    var url = 'http://developer.trimet.org/ws/V1/trips/tripplanner' + '?' +
	jQuery.param(tripPlannerParams);

    var rq = $.ajax({
	// Quick proxy Matt wrote and put on Heroku
	url: 'http://falling-dawn-9259.herokuapp.com/?url=' + 
	    encodeURIComponent(url),
	dataType: 'xml',
	timeout: 100000,
	success: function (data) {
	    data = $(data);
	    // parachute out
	    if (data.find('error').length != 0) {
		console.log('error on destination ' +
			    dest.properties.name + ': ' +
			    data.find('error').text());
		return;
	    }

	    var lowCost = 1000000000;
	    var bestItin = null;
	    // loop through the itineraries, find the lowest-cost one
	    data.find('itinerary').each(function(ind, itin) {
		itin = $(itin);
		// make sure it fits hard requirements (0 transfers,
		// allowed stop)
		// TODO: allowed stop
		if (itin.find('numberOfTransfers').text() != '0')
		    return;
		
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
		itinOut.fromCoord = data.find('param[name="fromCoord"]').text();
		itinOut.toPlace = data.find('param[name="toPlace"]').text();
		itinOut.toCoord = data.find('param[name="toCoord"]').text();

		// This is the transit leg
		// for now, safe to assume only one
		var transitLeg = {type: 'transit'};
		var legXml = bestItin.find('leg').first();
		transitLeg.fromPlace = legXml.find('from description').text();
		transitLeg.fromCoord = legXml.find('from pos lon').text() + 
		    ',' + legXml.find('from pos lat').text();
		transitLeg.toPlace = legXml.find('to description').text();
		transitLeg.toCoord = legXml.find('to pos lon').text() + 
		    ',' + legXml.find('to pos lat').text();
		transitLeg.time = Number(
		    legXml.find('time-distance duration').text());

		// stub out geometry in case it doesn't update
		var from = transitLeg.fromCoord.split(',');
		var to = transitLeg.toCoord.split(',');
		transitLeg.geometry = [new L.LatLng(from[1], from[0]),
				       new L.LatLng(to[1], to[0])];
		
		var initWalk = {type: 'walk'}
		initWalk.fromCoord = itinOut.fromCoord;
		initWalk.fromPlace = itinOut.fromPlace;
		initWalk.toCoord   = transitLeg.fromCoord;
		initWalk.toPlace   = transitLeg.fromPlace;
		var from = initWalk.fromCoord.split(',');
		var to = initWalk.toCoord.split(',');
		initWalk.geometry = [new L.LatLng(from[1], from[0]),
				       new L.LatLng(to[1], to[0])];

		var finalWalk = {type: 'walk'}
		finalWalk.toCoord   = itinOut.toCoord;
		finalWalk.toPlace   = itinOut.toPlace;
		finalWalk.fromCoord = transitLeg.toCoord;
		finalWalk.fromPlace = transitLeg.toPlace;
		var from = finalWalk.fromCoord.split(',');
		var to = finalWalk.toCoord.split(',');
		finalWalk.geometry = [new L.LatLng(from[1], from[0]),
				       new L.LatLng(to[1], to[0])];
		
		itinOut.legs = [initWalk, transitLeg, finalWalk];
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
org.transitappliance.transitboardhotel.prototype.fillOutGeometries = function (itin) {
    var df = new $.Deferred();
    df.resolve(itin);
    return df;
}

org.transitappliance.transitboardhotel.prototype.updateWeather = function () {
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
org.transitappliance.transitboardhotel.prototype.updateClock = function () {
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
    $('#bar-datetime').textfill({maxFontPixels: $('#bar').height()});
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
	    tbdh = new org.transitappliance.transitboardhotel(data);
	}
    });
});