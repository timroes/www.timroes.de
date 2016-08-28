const $ = require('jquery');

$.ajax({
	url: '/assets/icons.svg',
	cache: true
}).done((data, status, result) => {
	const x = document.createElement('x');
	x.innerHTML = result.responseText;
	const svg = x.getElementsByTagName('svg')[0];
	if (svg) {
		// Add svg loaded from jquery to body
		document.body.insertBefore(svg, document.body.firstChild);
		document.body.classList.add('icons-loaded');
	}
});
