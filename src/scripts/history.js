var $ = require('jquery');

$(() => {
	const container = $('#post-history');
	if (container.length) {

		const historyLink = $('<a href="#" class="show-history" aria-expanded="false" aria-controls="post-history" aria-label="Toggle post changes. Next in tab order when shown." title="Show changes"><svg class="icon" aria-hidden="true" width="1em" height="1em"><use xlink:href="/assets/icons.svg#history"></use></svg> <span class="hide-small">Show changes</span></a>');

		const setAriaAttrs = function() {
			const expanded = container.is(':visible');
			historyLink.attr('aria-expanded', expanded);
			if (expanded) {
				// Track show history event to analytics if analytics are available
				if (window.gtag) {
					window.gtag('event', 'show_post_history', {
						post: location.pathname
					});
				}
			}
		};

		$('.postmeta').append(historyLink);
		historyLink.click((ev) => {
			ev.preventDefault();
			if (!container.children().length) {
				historyLink.find('svg').addClass('spin-delay');
				container.attr('aria-label', 'History is loading. Please wait.');
				container.load('./history.html', null, () => {
					// When history finished loading, remove loading aria-label and spinning icon
					historyLink.find('svg').removeClass('spin-delay');
					container.attr('aria-label', null);
				});
				container.show();
				setAriaAttrs();
			} else {
				container.slideToggle('fast', setAriaAttrs);
			}


		});
	}
});
