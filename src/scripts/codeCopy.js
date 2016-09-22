const Clipboard = require('clipboard');
const $ = require('jquery');

const copyLabel = 'Copy Code';

$(() => {
	$('.copycode').append(`<button class="cc-btn" style="display:none"><svg class="icon"><use xlink:href="/assets/icons.svg#clipboard"></use></svg> <span class="l">${copyLabel}</span></button>`);

	const clipboard = new Clipboard('.cc-btn', {
		target: function(trigger) {
			// Look for the code tag inside the .copycode container (should be the pre).
			return $(trigger).parent().find('code').get(0);
		}
	});

	clipboard.on('success', (e) => {
		e.clearSelection();
		$(e.trigger)
				.find('use')
				.attr('xlink:href', '/assets/icons.svg#ok')
		$(e.trigger)
				.find('.l')
				.text('Copied');
		setTimeout(() => {
			$(e.trigger)
					.find('use')
					.attr('xlink:href', '/assets/icons.svg#clipboard');
			$(e.trigger)
					.find('.l')
					.text(copyLabel);
		}, 3000);
	});

	clipboard.on('error', (e) => {
		$(e.trigger).addClass('copy-failed')
			.find('.l')
			.text('Press Ctrl+C to copy');
		setTimeout(() => {
			$(e.trigger).removeClass('copy-failed')
				.find('.l')
				.text(copyLabel);
		}, 5000);
	});
});
