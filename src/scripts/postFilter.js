const $ = require('jquery');

$(() => {
	if (!$('.postlist').length) return;

	// Find all available tags
	const tags = $('.postlink').map((i, el) => {
		return $(el).data('tags').split(',');
	})
		.get()
		.filter(el => el)
		.filter((item, i, array) => {
			return i === array.indexOf(item);
		})
		.sort();

	const select = $('.postlist-filter-list');
	select.empty();
	select.append($(`<input type="radio" value="" name="postfilter" id="all" checked><label for="all">Show all</label>`));
	$.each(tags, (i, el) => {
		select.append($(`<input type="radio" value="${el}" name="postfilter" id="${el}"><label for="${el}">${el}</label>`));
	});

	$('input[name="postfilter"]:radio').change(() => {
		// If the user changes the filter, search for matching posts and only show these.
		const val = $('input[name="postfilter"]:checked').val();
		$('.postlink').show();
		if (val) {
			$(`.postlink:not([data-tags*="${val}"])`).hide();
		}
		$('.postlist-header').removeClass('expanded');
		// Track filter event to analytics if analytics are available
		if (window._paq) {
			window._paq.push(['trackEvent', 'Filter Posts', val]);
		}
	});

	// Show/hide filter list on click on toggle button
	$('.postlist-filter-toggle').click((ev) => {
		ev.preventDefault();
		$('.postlist-header').toggleClass('expanded');
		$('.postlist-filter-list').slideToggle();
	});

	// We finished initializing the postlist header, so show it now.
	$('.postlist-header').show();
});
