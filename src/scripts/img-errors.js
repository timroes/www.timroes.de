const $ = require('jquery');

$(() => {
	$('img').on('error', function(ev) {
		// If an image failed loading set the failed class to the image-wrapper
		// and remove the image from the DOM.
		$(this).parent('.image-wrapper').addClass('failed');
		$(this).remove();
	}).on('load', function() {
		// If image loaded successfully add 'ok' class to it
		$(this).addClass('ok');
	});
});
