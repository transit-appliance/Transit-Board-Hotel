// use doc.ready because we don't want it to run each time the page is changed
$(document).ready(function () {
    var map = null;

    // we need to wait until the page has finished transitioning, so the map
    // is a reasonable size
    $('#mapPage').live('pageshow', function (e) {
	// we wait until now to init the map, no point in wasting bandwidth
	// if the user does not request it
	if (map == null) {
	    var tileUrl = 'http://{s}.tile.cloudmade.com/2d634343963a4426b126ab70b62bba2a/46244/256/{z}/{x}/{y}.png';
	    var tileAttr = 'Basemap data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade';

	    var baseLayer = new L.TileLayer(tileUrl, 
				    {maxZoom: 18, attribution: tileAttr});

	    $('#map')
		.css('height', String($(window).height() - 
				      $('#mapReturnBtn').height() -
				      15) + 'px' )
		.css('width', $(window).width() + 'px')
		.text('');

	    map = new L.Map('map')
		.addLayer(baseLayer)
		.setView(new L.LatLng(45.524, -122.681), 14);
	}
    });
});
	    