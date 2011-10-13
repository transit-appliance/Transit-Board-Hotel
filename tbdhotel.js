$(document).ready(function () {
    // config section
    // it'd be better if the key was left as is, so that we can track traffic
    // style #46283 is the one Matt built for this project
    var tileUrl = 'http://{s}.tile.cloudmade.com/2d634343963a4426b126ab70b62bba2a/997/256/{z}/{x}/{y}.png';
    var tileAttr = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade';


    var baseLayer = new L.TileLayer(tileUrl, 
				    {maxZoom: 18, attribution: tileAttr});

    var transitLayer = new L.TileLayer("gis/trimetTiles/{z}/{x}/{y}.png",
				       {maxZoom: 18});
    
    var map = new L.Map(
	'map',
	{zoomControl: false})
	.setView(new L.LatLng(45.5240, -122.6810), 0)
	.addLayer(baseLayer)
	.addLayer(transitLayer);
});