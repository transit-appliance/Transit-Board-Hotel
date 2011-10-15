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

function trApplicationCache(callback) {
	
	// ensure this is called as constructor
	
	if (!(this instanceof trApplicationCache)) {
		return new trApplicationCache(callback);
	}
	
	// make this a singleton
	
	if (typeof trApplicationCache.instance === "object") {
		// run callback
		callback();
		return trApplicationCache.instance;
	}
	
	trApplicationCache.instance = this;
	
	this.cache = {}; // our cache element
	
	// load all applications
	$.ajax({
	  url: "http://transitappliance.couchone.com/applications_production/_design/apps/_view/all",
	  dataType: "jsonp",
	  success: function(data) {
	  	jQuery.each(data.rows,function(index,row) {
	  		var application = row.key;
	  		delete application._id;
	  		delete application._rev;
	  		trApplicationCache.instance.cache[application.application_id] = application;
	  	});
	  	callback();
	  }
	});
		
	this.applicationData = function(application_id) {
		if (this.cache[application_id]) {
			return this.cache[application_id];
		} else {
			return undefined;
		}
	}
	
	this.applicationIds = function() {
		var ids = new Array;
		for (var id in this.cache) {
			ids.push(id);
		}
		return ids;
	}

}


