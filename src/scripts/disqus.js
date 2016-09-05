import $ from 'jquery';

$(() => {
	if ($('a[name="comments"]').length > 0) {
		var d = document, s = d.createElement('script');
		s.src = '//timroes.disqus.com/embed.js';
		s.async = true;
		s.setAttribute('data-timestamp', +new Date());
		d.head.appendChild(s);

		s = d.createElement('script');
		s.src = '//timroes.disqus.com/count.js';
		s.id = 'dsq-count-scr';
		s.async = true;
		d.head.appendChild(s);
	}
});
