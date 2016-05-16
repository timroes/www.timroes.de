var $ = require('jquery');

$(() => {
	const linklist = $('.serieslinks-linklist');
	linklist.css('max-height', linklist.height() + 10);
	const serieslinks = $('.serieslinks').addClass('expandable');
	$('.serieslinks-label')
		.click(() => {
			$('.serieslinks').toggleClass('expanded');
		});
});
