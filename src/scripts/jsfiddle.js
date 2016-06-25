// This file transforms jsfiddle links to jsfiddle embeds.

const $ = require('jquery');

$.ajaxSetup({ cache: true });
$(() => {
	$('a[data-jsfiddle-href]').each((i, el) => {
		el = $(el);
		const opts = el.data('jsfiddle-opts');
		const embedUrl = `https://jsfiddle.net/${el.data('jsfiddle-href')}/embed/${opts ? opts + '/' : ''}`;

		const scriptTag = $(`<script async src="${embedUrl}"></script>`);
		el.replaceWith(scriptTag);
	});
});
