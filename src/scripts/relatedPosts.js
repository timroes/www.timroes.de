var $ = require('jquery');

function recalculateMaxHeight() {
	const linklist = $('.serieslinks-linklist');
	const serieslinks = $('.serieslinks');
	linklist.css('max-height', 'none');
	serieslinks.removeClass('expandable');
	const height = linklist.height() + 10;
	console.log("[SERIES] Set related posts height to %d", height);
	linklist.css('max-height', height);
	serieslinks.addClass('expandable');
	$('.serieslinks-label').off('click');
	$('.serieslinks-label')
	.click(() => {
		$('.serieslinks').toggleClass('expanded');
	});
}

function triggerRecalculateMaxHeight() {
	if ($('.serieslinks-linklist').length > 0) {
		// Check whether the body still has the fout class. In this case the height
		// of the element can't be calculated yet, so postpone the calculation for 400ms
		// which is the max amount of time the fout class is set at all. Most likely
		// the class will be removed way earlier, but it's not so much of a harm, if we wait
		// longer. In the end without this calculation the related posts are just not collapsed,
		// so we don't lose any important functionality.
		if ($(document.body).hasClass('fout')) {
			setTimeout(recalculateMaxHeight, 400);
		} else {
			recalculateMaxHeight();
		}
	}
}

$(triggerRecalculateMaxHeight);
$(window).on('css:onload', triggerRecalculateMaxHeight);
