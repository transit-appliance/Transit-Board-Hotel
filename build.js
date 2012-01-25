var fs = require('fs');
var $ = require('jquery');

// OK to be sync here
text = fs.readFileSync('tbdhotel.html', 'utf-8');


// This strips script tags
h = $(text);

// add one, got to be a little tricky so jQuery doesn't strip the
// <script> tag
h.find('head').get(0).innerHTML += '<script src="tbdhotel.min.js" type="text/javascript"></script>';

fs.writeFileSync('tbdhotel.min.html', '<html>' + h[0].innerHTML + '</html>', 'utf-8');

