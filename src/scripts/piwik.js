if(PIWIK_ENABLED) {
	var _paq = window._paq || [];
	_paq.push(["setDomains", [ '@@piwik.domain@@' ]]);
	_paq.push(['trackPageView']);
	_paq.push(['enableLinkTracking']);
	(function() {
		var u="@@piwik.url@@/";
		_paq.push(['setTrackerUrl', u+'piwik.php']);
		_paq.push(['setSiteId', @@piwik.siteId@@ ]);
		_paq.push([ function() {
			var loc = window.location;
			if (loc.search.indexOf('pk_campaign') > -1) {
				if (window.history.replaceState) {
					history.replaceState({}, '', loc.pathname);
				} else {
					loc.hash = '';
				}
			}
		}]);
		var d=document, g=d.createElement('script');
		g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; document.body.appendChild(g);
	})();
}
