var $ = require('jquery');

$(() => {
	const container = $('#post-history');
	if (container.length) {

		const historyLink = $('<a href="#" class="show-history" aria-expanded="false" aria-controls="post-history" aria-label="Toggle post changes. Next in tab order when shown." title="Show changes"><svg class="icon" aria-hidden="true"><use xlink:href="/assets/icons.svg#history"></use></svg> <span class="hide-small">Show changes</span></a>');

		const setAriaAttrs = function() {
			const expanded = container.is(':visible');
			historyLink.attr('aria-expanded', expanded);
			if (expanded) {
				// Track show history event to analytics if analytics are available
				if (window._paq) {
					window._paq.push(['trackEvent', 'Show Post History', location.pathname]);
				}
			}
		};

		$('.postmeta').append(historyLink);
		historyLink.click((ev) => {
			ev.preventDefault();
			if (!container.children().length) {
				container.load('./history.html');
				container.show();
				setAriaAttrs();
			} else {
				container.slideToggle('fast', setAriaAttrs);
			}


		});
	}
});
