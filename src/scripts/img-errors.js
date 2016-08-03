const $ = require('jquery');

$(() => {
	$('img').on('error', function(ev) {
		// If an image failed loading set the failed class to the image-wrapper
		// and remove the image from the DOM.
		const wrapper = $(this).parent('.image-wrapper').addClass('failed');
		$(this).remove();
	});
});
