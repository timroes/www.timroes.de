const $ = require('jquery');

$(() => {
	$('img').on('error', function(ev) {
		const img = $(this);
		// If an image failed loading set the failed class to the image-wrapper
		// and remove the image from the DOM.
		img.parent('.image-wrapper').addClass('failed')
			// If the image loading failed and we are about to remove the image from DOM
			// give the wrapper also an img role and copy the aria-labelledby attribute
			// from the image to it, so the screenreader will still behave like the
			// image would be in DOM.
			.attr('aria-labelledby', img.attr('aria-labelledby'))
			.attr('role', 'img');
		img.remove();
	}).on('load', function() {
		// If image loaded successfully add 'ok' class to it
		$(this).addClass('ok');
		$(this).parent('.image-wrapper').addClass('ok');
	});
});
