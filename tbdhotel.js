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
	
	var tileAttr = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade';
    }    
	
    var rights_string = '';
    for (var agency in realTimeArrivals.stopsConfig) {
        rights_string += realTimeArrivals.agencyCache.agencyData(agency).rights_notice+" ";
    }

    tileAttr += rights_string;

    var baseLayer = new L.TileLayer(tileUrl, 
				    {maxZoom: 18, attribution: tileAttr});

    var transitLayer = new L.TileLayer("gis/trimetTiles/{z}/{x}/{y}.png",
				       {maxZoom: 18});
    
    // add this back
    //{zoomControl: false})
    map = new L.Map(
	'map')
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

    // .apply is barely documented, but I finally figured it out from
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

    updateWeather();
    // once/hr, the max request rate
    setInterval(updateWeather, 60*60*1000);

    // set up the info bar
    var hu = $(window).height() / 100;
    $('#bar').height(6*hu);
    $('#bar-location').text(realTimeArrivals.optionsConfig.originName[0]);

    // main loop
    showDestination(0);
}

function showDestination(i) {
    var dest = destinations[i];

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

    
    
}

// This updates the trip plans. It runs occasionally
function updateTripPlans() {
    console.log('updating trip plans');
}

function updateWeather () {
    // Quick Sinatra proxy on Heroku, I had issues with YQL
    function buildProxyURL(url) {
	return 'http://falling-dawn-9259.herokuapp.com/?url=' + encodeURIComponent(url)
    }

    var origin = realTimeArrivals.optionsConfig.origin[0].split(',');

    url = 'http://graphical.weather.gov/xml/sample_products/browser_interface/ndfdXMLclient.php?whichClient=NDFDgen' +
	'&lat=' + origin[0] +
	'&lon=' + origin[1] +
	'&product=time-series&begin=2004-01-01T00%3A00%3A00&end=2015-10-15T00%3A00%3A00&Unit=e&temp=temp&wx=wx&icons=icons&Submit=Submit';

    $.ajax({
	url: buildProxyURL(url),
	dataType: 'xml',
	success: function (data) {
	    weather = data;
	    console.log('retrieved NOAA data');
	}
    });
}