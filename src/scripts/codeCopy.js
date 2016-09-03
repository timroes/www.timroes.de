const Clipboard = require('clipboard');
const $ = require('jquery');

$(() => {
	$('.copycode').append(`<button class="cc-btn"><svg class="icon"><use xlink:href="/assets/icons.svg#icon-clipboard"></use></svg></button>`);

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
				.find('use')
				.attr('xlink:href', '/assets/icons.svg#icon-ok');
		setTimeout(() => {
			$(e.trigger)
					.removeClass('copied')
					.find('use')
					.attr('xlink:href', '/assets/icons.svg#icon-clipboard');
		}, 3000);
	});

	clipboard.on('error', (e) => {
		$(e.trigger).addClass('copy-failed');
		setTimeout(() => {
			$(e.trigger).removeClass('copy-failed');
		}, 5000);
	});
});
