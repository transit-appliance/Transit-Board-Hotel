jQuery(document).ready(function () {
    // make sure they are displayed as block
    jQuery('a.selector').css('display', 'block');
    
    jQuery('a.selector').click(function (e) {
	e.preventDefault(); // don't want to follow the link
	var link = jQuery(e.target);
	jQuery('iframe.selected').slideUp().remove();
	link.after('<iframe src="' + link.attr('href') + '"=' +
		   'style="display: none" frameborder="0"' +
		   'scrolling="no" width="1000" height="563"' +
		   'class="selected" />').slideDown();
    });
});