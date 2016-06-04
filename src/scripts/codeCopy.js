const Clipboard = require('clipboard');
const $ = require('jquery');

$(() => {
	$('.copycode').append(`<button class="cc-btn"><i class="icon-clipboard"></i></button>`);

	const clipboard = new Clipboard('.cc-btn', {
		target: function(trigger) {
			// Look for the code tag inside the .copycode container (should be the pre).
			return $(trigger).parent().find('code').get(0);
		}
	});

	clipboard.on('success', (e) => {
		e.clearSelection();
		$(e.trigger)
				.addClass('copied')
				.find('i')
				.removeClass('icon-clipboard')
				.addClass('icon-ok');
		setTimeout(() => {
			$(e.trigger)
					.removeClass('copied')
					.find('i')
					.removeClass('icon-ok')
					.addClass('icon-clipboard');
		}, 3000);
	});

	clipboard.on('error', (e) => {
		$(e.trigger).addClass('copy-failed');
		setTimeout(() => {
			$(e.trigger).removeClass('copy-failed');
		}, 5000);
	});
});
