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
	// Remove fouf (flash of unstyled font) class (that hides the body) if it is still
	// there (i.e. if we loaded faster than 400ms)
	document.body.classList.remove('fouf');
	const now = window.performance.now();
	if (!window.performance || window.performance.now() < 2000) {
		document.body.classList.add('font-loaded');
		console.log("[FONT] Replace font after %f.", window.performance.now());
	} else {
		console.log("[FONT] Font loaded, but too late at %f.", window.performance.now());
	}
})
