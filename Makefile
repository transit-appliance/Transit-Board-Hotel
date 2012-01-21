CLOSURE=java -jar ~/bin/compiler.jar

all : apidocs

apidocs : tbdhotel.js
	jsdoc tbdhotel.js -d=apidocs

compile : tbdhotel.js tbdhotel.html
	$(CLOSURE) --js tbdhotel.js --js_output_file tbdhotel.min.js
	cat tbdhotel.html | sed s/tbdhotel\.js/tbdhotel.min.js/g > tbdhotel.min.html
