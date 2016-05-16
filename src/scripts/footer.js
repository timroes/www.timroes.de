const $ = require('jquery');

$(() => {
	const footer = $('.postbottom');
	if (!footer.length) {
		return;
	}

	const fixedFooter = footer.clone(true);

	fixedFooter.appendTo(document.body);

	// Recalculate count of comments so cloned footer will also get the count
	if (window.DISQUSWIDGETS) {
		window.DISQUSWIDGETS.getCount({ reset: true });
	}

	const $window = $(window);
	let lastScrollTop = null;
	let footerHidden = false;

	$window.on('load', () => {
		fixedFooter.addClass('fixed');
		lastScrollTop = $window.scrollTop();
	});

	$window.on('load scroll', function(ev) {
		const scrollTop = $window.scrollTop();
		const bottomOfWindow = scrollTop + $window.height();
		const footerBottom = footer.offset().top + footer.outerHeight();

		if (bottomOfWindow  >= footerBottom) {
			fixedFooter.addClass('detached');
		} else {
			fixedFooter.removeClass('detached');
		}

		if (lastScrollTop !== null) {
			if (lastScrollTop < scrollTop) {
				if (!footerHidden) {
					fixedFooter.addClass('hidden');
					footerHidden = true;
				}
			} else {
				if (footerHidden) {
					fixedFooter.removeClass('hidden');
					footerHidden = false;
				}
			}
		}

		lastScrollTop = scrollTop;

	});
});
