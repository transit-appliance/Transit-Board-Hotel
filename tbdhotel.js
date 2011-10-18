var realTimeArrivals;
if (console.log != undefined) var log = console.log;
else var log = function (m) {};

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
 
    for (var agency in realTimeArrivals.stopsConfig) {
        addAttribution(
	    realTimeArrivals.agencyCache.agencyData(agency).rights_notice);
    }

    var baseLayer = new L.TileLayer(tileUrl, 
				    {maxZoom: 18});

    var transitLayer = new L.TileLayer("gis/trimetTiles/{z}/{x}/{y}.png",
				       {maxZoom: 18});
    addAttribution('Rail line info courtesy TriMet.');
    
    // add this back
    //{zoomControl: false})
    map = new L.Map('map', {
	attributionControl: false // attr is handled separately.
    })
	.setView(new L.LatLng(45.5240, -122.6810), 14)
	.addLayer(baseLayer)
	.addLayer(transitLayer);


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
    
    // pretty far in
    map.setView(origin, 15);

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
function updateTripPlans() {
    console.log('updating trip plans');
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

    console.log(time);
    $('#bar-datetime span').text(time);
    $('#bar-datetime').textfill();
}
