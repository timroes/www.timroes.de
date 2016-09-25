const FontFaceObserver = require('fontfaceobserver/fontfaceobserver.js');

const fonts = [
	{ family: 'Roboto', weight: 300, style: 'normal' },
	{ family: 'Roboto', weight: 700, style: 'normal' },
	{ family: 'Roboto', weight: 300, style: 'italic' },
	{ family: 'Roboto', weight: 700, style: 'italic' },
	{ family: 'Source Code Pro', weight: 'normal', style: 'normal' }
];

console.log("[FONT] Start font loading at %f", window.performance.now())
const fontPromises = fonts.map(font => {
	return new FontFaceObserver(font.family, { weight: font.weight, style: font.style }).load(null, 5000);
});

Promise.all(fontPromises).then(() => {
	// Remove fout (flash of unstyled text) class (that hides the body) if it is still
	// there (i.e. if we loaded faster than 400ms)
	document.body.classList.remove('fout');
	const perf = window.performance;
	if (!perf || // If there is no performance API available, or ...
			!perf.timing.domContentLoadedEventStart || // the DOM content hasn't yet been completed loaded, or ...
			// the DOM loaded event (the time the user most likely has a rendered page the first time)
			// isn't more than 2 seconds away (-> user haven't started reading much)
			(perf.now() + perf.timing.navigationStart - perf.timing.domContentLoadedEventStart) < 2000) {
		document.body.classList.add('font-loaded');
		console.log("[FONT] Replace font after %f. (%f since DOMContentLoaded)",
				window.performance.now(),
				(perf.now() + perf.timing.navigationStart - perf.timing.domContentLoadedEventStart));
	} else {
		console.log("[FONT] Font loaded, but too late at %f.", window.performance.now());
	}
})
