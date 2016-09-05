var $ = require('jquery');

function recalculateMaxHeight() {
	const linklist = $('.serieslinks-linklist');
	if (linklist.length > 0) {
		const serieslinks = $('.serieslinks');
		linklist.css('max-height', 'none');
		serieslinks.removeClass('expandable');
		const height = linklist.height() + 10;
		console.log("[SERIES] Set related posts height to %d", height);
		linklist.css('max-height', height);
		serieslinks.addClass('expandable');
		$('.serieslinks-label')
		.click(() => {
			$('.serieslinks').toggleClass('expanded');
		});
	}
}

$(recalculateMaxHeight);
$(window).on('css:onload', recalculateMaxHeight);
