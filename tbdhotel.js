var realTimeArrivals;
if (typeof console == 'undefined') console = {
    log: function (msg) {}};

$(document).ready(function () {
    trArr({
	configString: window.location.search,
	displayInterval: 30*1000,
	displayCallback: function (data) {
	    // save the real-time arrivals; they will be ref'd later on
	    // I don't think there's any chance of this being referred to as
	    realTimeArrivals = data;
	},
	initializeCallback: function (data) {
	    realTimeArrivals = data;
	    setTimeout(tbdHotel, 10);
	}
    });
});

function tbdHotel() {
    // we get top billing
    addAttribution('Transit Board&#153; Hotel, a ' +
		   '<a href="http://portlandtransport.com">Portland Transport' +
		   '</a> Production.');
 
    for (var agency in realTimeArrivals.stopsConfig) {
        addAttribution(
	    realTimeArrivals.agencyCache.agencyData(agency).rights_notice);
    }

    // set up custom CSS
    if (realTimeArrivals.optionsConfig.stylesheet != undefined) {
	for (var i = 0; i < realTimeArrivals.optionsConfig.stylesheet.length;
	     i++)
	    $('head').append('<link rel="stylesheet" type="text/html" href="'+
			   realTimeArrivals.optionsConfig.stylesheet[i] +
			   '" />');
    }

    // parse out the destinations
    var destIds = realTimeArrivals.optionsConfig.destinations[0].split(',');
    console.log('destinations: ' + destIds.join(' '));

    // TODO:
    // Once CouchDB supports CORS, we should use the Multiple Document Interface
    // this is global on purpose
    destinations = [];

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
		destinations.push(data);
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
	doDisplay();
    }).fail(function () { 
	// TODO: What to do in this case?
	console.log('failed');
    });
}

// This jump-starts the display
function doDisplay() {
    var originRaw = realTimeArrivals.optionsConfig.origin[0].split(',');
    var origin = new L.LatLng(Number(originRaw[0]), Number(originRaw[1]));

    // Init the map
    // allow them to set either a CloudMade style or a custom tile server
    if (realTimeArrivals.optionsConfig.cloudmadeStyle != undefined) {
	// config section
	// it'd be better if the key was left as is, so that we can track traffic
	// style #46244 is the one Matt built for this project
	var tileUrl = 'http://{s}.tile.cloudmade.com/2d634343963a4426b126ab70b62bba2a/'+
	    realTimeArrivals.optionsConfig.cloudmadeStyle[0] +
	    '/256/{z}/{x}/{y}.png';
	
	var tileAttr = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade';
    }
    else if (realTimeArrivals.optionsConfig.tileUrl != undefined) {
	var tileUrl = realTimeArrivals.optionsConfig.tileUrl[0]
	if (realTimeArrivals.optionsConfig.tileAttr != undefined)
	    var tileAttr = realTimeArrivals.optionsConfig.tileAttr[0]
	else var tileAttr = '';
    }
    else {
	// config section
	// it'd be better if the key was left as is, so that we can track traffic
	// style #46244 is the one Matt built for this project
	var tileUrl = 'http://{s}.tile.cloudmade.com/2d634343963a4426b126ab70b62bba2a/46244/256/{z}/{x}/{y}.png';
	
	var tileAttr = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade.';
    }    

    addAttribution(tileAttr);

    var baseLayer = new L.TileLayer(tileUrl, 
				    {maxZoom: 18});

    var transitLayer = new L.TileLayer("gis/trimetTiles/{z}/{x}/{y}.png",
				       {maxZoom: 18});
    addAttribution('Rail line info courtesy TriMet.');

    // make it block positioned but invisible
    // Leaflet will not init right if we put it in an invisible element
    $('#container').css('opacity', '0').css('display', 'block');
    // add this back
    //{zoomControl: false})
    map = new L.Map('map', {
	attributionControl: false // attr is handled separately.
    })
	.addLayer(baseLayer)
	.addLayer(transitLayer)
	.setView(origin, 15);

    // make sure we make it visible again! else jQuery will fade it 0 in
    // to 0
    $('#container').css('display', 'none').css('opacity', '1');

    // seed the data before we display it
    updateTripPlans();
    // TODO: 10 mins correct amount of time?
    setInterval(updateTripPlans, 10*60*1000);

    addAttribution('Weather courtesy Yahoo! Weather.');
    updateWeather();
    // update the weather once every 20 minutes
    setInterval(updateWeather, 20*60*1000);

    // set up the info bar
    var hu = $(window).height() / 100;
    $('#bar').height(6*hu);
    $('#bar-location span').text(realTimeArrivals.optionsConfig.originName[0]);
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
    updateClock();
    setInterval(updateClock, 15*1000);

    // main loop
    showDestination(0);
}

function showDestination(iteration) {
    var dest = destinations[iteration];

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
	var percentSub = 70 - percentName;
    }
    // no subtitle
    else {
	var percentName = 100;
	var percentSub = 0;
	// clear out any old subtitle
	$('#subhead').text('');
    }

    $('#main-text').css('width', percentName + '%');
    $('#subtitle').css('width', percentSub + '%');

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
    $('#subtitle').height(10*hu).textfill({maxFontPixels: 7*hu});
    $('#head-box').height(10*hu);

    $('#slideshow').height(54*hu);
    $('#trip-box').height(23*hu);

    // nested inside trip-box
    $('#narrative').height(16*hu);
    $('#trip-details').height(6*hu);

    var imageTimeout = 
	1000 * Number(realTimeArrivals.optionsConfig.imageTimeout || 3);

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
	    if (iteration < destinations.length) 
		showDestination(iteration);
	    else 
		showAttribution();
	}, 550);
    }, base + 10*1000);    
}

function showAttribution () {
    $('#attribution').fadeIn(500);
    $('#attribution').textfill();

    setTimeout(function () {
	$('#attribution').fadeOut(500);
    }, 4500); // show for four seconds, plus fade

    setTimeout(function () {
	showDestination(0);
    }, 5050); // then show the first destination 50 ms after the fade finishes.
}

// Add an attribution string
function addAttribution (attr) {
    $('#attribution span').append(attr + '<br/>');
    // Can't do textfill here b/c object is likely invisible
}

// This updates the trip plans. It runs occasionally
// This one is set up exclusively for TriMet
function updateTripPlans() {
    console.log('updating trip plans');

    // keep a local copy
    var localDests = destinations;

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
	fromPlace: realTimeArrivals.optionsConfig.originName[0],
	// reverse the lat,lon to be lon,lat
	fromCoord: realTimeArrivals.optionsConfig.origin[0].split(',')[1] 
	    + ',' + realTimeArrivals.optionsConfig.origin[0].split(',')[0],
	time: time,
	min: 'X', // fewest transfers
	appID: '828B87D6ABC0A9DF142696F76'
    };
    
    // Two passes - one gets the trip plans, one gets geometry and
    // walking directions
    // when OTP API is implemented, we won't need this anymore

    // this keeps track of whic destinations have completed
    var destStatus = [];

    // we use $.each not for so that each iteration gets its own scope
    // otherwise i changes when the loop goes to the next iteration.
    $.each(localDests, function (ind, dest) {
	// This is resolved when this update has completed
	var deferred = jQuery.Deferred();
	destStatus.push(deferred);

	// destination specific
	var localParams = {
	    toPlace: dest.properties.name,
	    // already in lon, lat
	    toCoord: dest.geometry.coordinates.join(',')
	};

	$.extend(localParams, tripPlannerParams);

	var url = 'http://developer.trimet.org/ws/V1/trips/tripplanner' + '?' +
	    jQuery.param(localParams);

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

		    // the itinerary output
		    var itinOut = {};
		    // now, get walking directions and transit geometry
		    // transit geometries
		    deferred.resolve();

		}
		
		// no best itinerary
		else {
		    console.log('no itinerary found for dest ' + 
				dest.properties.name);
		    localDests[ind].itinerary = null;

		    // resolve this request
		    deferred.resolve();
		}
	    },
	    error: function (x, stat) {
		console.log('error loading trip plan for dest ' +
			    dest.properties.name + ': ' + stat);
	    }
	}); // initial ajax to TriMet WS
    }); // each
    
    // wait for them all to complete
    $.when.apply(null, destStatus).then(function () {
	console.log('all destinations retrieved');
	destinations = localDests;
    }).fail(function () {
	console.log('trip plans did not resolve')
    });
}

function updateWeather () {
    weather = {};

    var origin = realTimeArrivals.optionsConfig.origin[0].split(',');

    url = '';

    // First, get the WOEID, and save it
    if (weather.woeid == undefined) {
	// for now this only works in the US b/c it uses ZIP Codes
	var woeid_xhr = $.ajax({
	    // SELECT postal.content FROM geo.places WHERE text="45,-122" LIMIT 1
	    url: 'http://query.yahooapis.com/v1/public/yql?q=SELECT%20postal.content%20FROM%20geo.places%20WHERE%20text%3D%22' +
		encodeURIComponent(origin[0] + ',' + origin[1]) + 
		'%22%20LIMIT%201&format=json',
	    dataType: 'json',
	    success: function (data) {
		weather.woeid = data.query.results.place.postal;
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
	    weather.woeid + '&format=json';

	$.ajax({
	    url: url,
	    dataType: 'json',
	    success: function (data) {
		weather.condition = data.query.results.channel.item.condition;
		var text = weather.condition.temp + '&deg; F/' +
		    Math.round((Number(weather.condition.temp) - 32) * (5/9)) +
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

		$('#bar-icon img').attr('src', icons[weather.condition.code]);
	    }	
	    // TODO: add fail handler here and above
	});
    });
}
						    

// update the clock, called every 15s
function updateClock () {
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
