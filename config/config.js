// [compilehidden]
trApp = {
    current_appliance: {
	private: {lat: 45.451, lng: -122.312}
    }
}

// [/compilehidden]

jQuery(document).ready(function () {
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