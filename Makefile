CLOSURE=java -jar ~/bin/compiler.jar

all : apidocs compile distribution

apidocs : tbdhotel.js
	jsdoc tbdhotel.js -d=apidocs

compile : tbdhotel.js tbdhotel.html
	$(CLOSURE) \
		--js jquery.min.js \
		--js leaflet-js/leaflet.js \
		--js assets/js/fleegix.js \
		--js assets/js/tzdate.js \
		--js assets/js/date.js \
		--js assets/js/trArrUtilities.js \
		--js assets/js/trStopCache.js \
		--js assets/js/trAgencyCache.js \
		--js assets/js/trArr.js \
		--js jquery.textfill.js \
		--js proj4js.min.js \
		--js Markdown.Converter.js \
		--js Markdown.Sanitizer.js \
		--js html-sanitizer-minified.js \
		--js jquery.qrcode.min.js \
		--js tbdhotel.js \
	    --js_output_file tbdhotel.min.js
	node build.js

distribution: compile
	zip -r 	transit-board-hotel-`git log --pretty=format:'%h' -n 1`.zip \
		tbdhotel.min.html \
		tbdhotel.min.js \
		tbdhotel.css \
		leaflet-js/leaflet.css \
		leaflet-js/images/ \
		hosted_images/ \
		assets/tz/northamerica \
		assets/js/trArrAgencyTriMet.js \
		assets/js/trArrServiceTriMet.js \
		slideshows/*.md \
		styles/*.css \
		weather-icons/*.png \
		gis/trimetTiles/ 
