#!/usr/bin/python

# Instructions: run this script and then paste the output into CouchDB
# You may have to save the _rev value.

try:
    import json
except:
    import simplejson as json

output = dict()
output['title'] = 'Transit Board(tm) Hotel'
output['agencies'] = ['TriMet']
output['description'] = 'Display routes to popular destinations'
output['url_template'] = 'http://transit-appliance.github.com/Transit-Board-Hotel/tbdhotel.html?${multi_agency_stop_string}&${application.fully_qualified_option_string}'
output['application_id'] = 'com.transitboard.hotel'
output['_id'] = 'com.transitboard.hotel'
output['secondary'] = True

output['fields'] = list()

output['fields'].append(dict(
        label='Human-readable location of the appliance',
        advice='',
        html='<input type="text" width="80" id="originName" name="originName" />'))

output['fields'].append(dict(
        label='Exact appliance location',
        advice='Drag the marker to the exact location of your appliance',
        html='''
      <script type="text/javascript">
// this won't be executed until the element has been built because the
// script won't be added to the page
$(document).ready( function () {
    var pos = new google.maps.LatLng(
		trApp.current_appliance.private.lat,
		trApp.current_appliance.private.lng
    );
    $('#origin').val(pos.lat() + ',' + pos.lng());

    var map = new google.maps.Map(
	jQuery('#tbdhmap').get(0),
	{
	    zoom: 15,
	    center: pos,
	    mapTypeId: google.maps.MapTypeId.ROADMAP
	});

    var marker = new google.maps.Marker({
	position: pos,
	map: map,
	title: 'Appliance Location',
	draggable: true
    });

    google.maps.event.addListener(marker, 'dragend', function () {
	var pos = marker.getPosition();
	$('#origin').val(pos.lat() + ',' + pos.lng());
    });
});
      </script>
      <div id="tbdhmap" style="width: 600px; height: 400px"></div>
      <input type="hidden" name="origin" id="origin" />
'''))

output['fields'].append(dict(
        label='Destinations',
        advice='The destination IDs for this appliance',
        html='<input type="text" width="80" name="destinations" />'))

output['fields'].append(dict(
        label='Custom stylesheet',
        advice='The URL of a custom stylesheet for this appliance',
        html='<input type="text" width="80" name="stylesheet" />'))

output['fields'].append(dict(
        label='imageTimeout',
        advice='The timeout for the destination slide shows',
        html='<input type="text" width="5" name="imageTimeout" />'))

output['fields'].append(dict(
        label='CloudMade Style ID',
        advice='The CloudMade Style ID for the preferred basemap',
        html='<input type="text" width="80" name="cloudmadeStyle" />'))

output['fields'].append(dict(
        label='Alternate Tile URL',
        advice='An alternate tile URL for the basemap',
        html='<input type="text" width="120" name="tileUrl" />'))

output['fields'].append(dict(
        label='Basemap attribution',
        advice='The attribution for the custom tile layer. Only honored if a custom tile URL is specified',
        html='<input type="text" width="80" name="tileAttr" />'))

output['fields'].append(dict(
        label='Maximum Zoom Level',
        advice='The maximum zoom level for the basemap. Default 16.',
        html='<input type="text" width="80" name="maxZoom" />'))

print json.dumps(output)
