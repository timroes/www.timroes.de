import $ from 'jquery';

$(() => {
	if (document.querySelector('.adsbygoogle')) {
		var d=document, g=d.createElement('script');
		g.type='text/javascript';
		g.async=true;
		g.defer=true;
		g.src='//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
		document.body.appendChild(g);

		(window.adsbygoogle = window.adsbygoogle || []).push({});
	}
});
