import $ from 'jquery';

$(() => {
	$('.ll').each((i, el) => {
		const element = $(el);
		if (element.attr('data-srcset')) {
			element.attr('srcset', element.attr('data-srcset'));
		}
		if (element.attr('data-src')) {
			element.attr('src', element.attr('data-src'));
		}
		element.removeClass('ll');
	});
});
