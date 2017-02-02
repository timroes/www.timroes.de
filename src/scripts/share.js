const $ = require('jquery');

$(() => {
	if (navigator.share !== undefined && $('.postsocials').length) {
		const shareLink = $('<a href="#" class="webshare" aria-label="Share this post"><svg class="icon"><use xlink:href="/assets/icons.svg#share"></use></svg> Share</a>');
		shareLink.click((ev) => {
			ev.preventDefault();
			navigator.share({
				title: document.title,
				url: location.href
			});
		});
		$('.postsocials').html(shareLink);
	}
});
