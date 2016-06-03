var $ = require('jquery');

$(() => {
	const dialog = $('#post-history');
	if (dialog.length) {
		$('.dialog-backdrop').click(() => {
			$('html').removeClass('dialog-open');
			dialog.removeClass('open');
		});

		$('.show-post-history').click(() => {
			$('html').addClass('dialog-open');
			dialog.addClass('open');
		});
	}
});
