all : apidocs

apidocs : tbdhotel.js
	jsdoc tbdhotel.js -d=apidocs