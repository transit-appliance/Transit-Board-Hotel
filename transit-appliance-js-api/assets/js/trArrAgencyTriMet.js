/*
   Copyright 2010-2011 Portland Transport

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

function trArrAgencyTriMetMakeServiceRequests(stops,options,stop_cache,service_requests) {
	
	var trArrTriMetStreetcarStops = {
		"8989": "n23mar_d",
		"3596": "loven22",
		"3595": "loven21",
		"10751": "loven18",
		"10752": "loven13",
		"10753": "n11john",
		"10754": "n11glis",
		"10755": "n11eve",
		"10756": "n11cou",
		"9600": "s11ald",
		"9633": "s11tay",
		"10759": "s11jeff",
		"10760": "s11clay",
		"11011": "marspark",
		"10762": "mars5",
		"10763": "mons5",
		"12375": "sw3harr",
		"12376": "sw1harr",
		"12377": "swharrd",
		"12378": "swrivmo",
		"12760": "swmogibb_a",
		"12880": "moodgain",
		"12881": "lowell_d",
		"12882": "bondlane",
		"12883": "bondohsu",
		"12760": "swmogibb_d",
		"12379": "swrivmo_h",
		"12380": "swharrd",
		"12381": "sw1harr",
		"12382": "sw3harr",
		"10764": "shop",
		"10766": "milspark",
		"10765": "s10clay",
		"6493": "s10mad",
		"10767": "s10yam",
		"10768": "s10ald",
		"10769": "s10wash",
		"10770": "n10cou",
		"10771": "n10ev",
		"10772": "n10glis",
		"10773": "n10john",
		"10774": "n10mar",
		"12796": "nw12north",
		"10775": "northn14",
		"10776": "northn18",
		"10777": "northn21",
		"10778": "northn22"
	};
	
	if (service_requests.TriMet == undefined) {
		service_requests.TriMet = [];
	}

	var streetcar_stops = [];
	for (var stop_id in stops) {
		var stop_data = stop_cache.stopData('TriMet',stop_id);
		var obj = {stop_id: stop_id, stop_data: stop_data, routes: []};
		if (stops[stop_id]['*']) {
			for (var i = 0; i < stop_data.routes.length; i++){
				obj.routes.push(stop_data.routes[i]);
			}
		} else {
			var route_id = undefined;
			for (var id in stops[stop_id]) {
				route_id = id;
			}
			for (var i = 0; i < stop_data.routes.length; i++){
				if (stop_data.routes[i].route_id == route_id) {
					obj.routes.push(stop_data.routes[i]);
				}
			}
		}

		service_requests.TriMet.push(obj);
		if (trArrTriMetStreetcarStops[stop_id] != undefined && ( stops[stop_id]['193'] != undefined || stops[stop_id]['*'] != undefined ) ) {
			streetcar_stops.push({stop_data: stop_data, avl_stop_id: trArrTriMetStreetcarStops[stop_id]});
		}
	}
	if (streetcar_stops.length > 0) {
		if (service_requests.NextBus == undefined) {
			service_requests.NextBus = {};
		}
		if (service_requests.NextBus['portland-sc'] == undefined) {
			service_requests.NextBus['portland-sc'] = [];
		}
		for (var i = 0; i < streetcar_stops.length; i++) { 
			var stop_data = streetcar_stops[i].stop_data;
			stop_data.avl_stop_id = streetcar_stops[i].avl_stop_id;
			var obj = {stop_id: stop_data.stop_id, stop_data: stop_data, routes: []};
			for (var j = 0; j < stop_data.routes.length; j++){
				if (stop_data.routes[j].route_id == '193') {
					stop_data.routes[j].avl_route_id = 'streetcar';
					obj.routes.push(stop_data.routes[j]);
				}
			}
			service_requests.NextBus['portland-sc'].push(obj);
		}
	}

}


