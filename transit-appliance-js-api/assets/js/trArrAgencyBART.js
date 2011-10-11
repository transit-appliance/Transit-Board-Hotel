/*
   trArrAgencyBART.js
   $Id$

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

   Authors:
   Matt Conway: main code

*/

function trArrAgencyBARTMakeServiceRequests (stops, options, stop_cache, service_requests) {
    if (service_requests.BART == undefined) {
	service_requests.BART = {};
    }
    
    if (service_requests.BART['BART'] == undefined) {
	service_requests.BART['BART'] = [];
    }

    for (var stop_id in stops) {
	var stop = stop_cache.stopData('BART', stop_id);
	
	// RealBART (also BART-ETD) doesn't have a good way to determine routes, if it's handled at all, it should be in
	// the updaters section
	service_requests.BART['BART'].push({stop_id: stop.stop_id, stop_data: stop, routes: []});
    }
}