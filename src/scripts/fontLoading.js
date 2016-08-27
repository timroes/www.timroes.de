const FontFaceObserver = require('fontfaceobserver');
const $ = require('jquery');

const roboto = new FontFaceObserver('Roboto', {
  weight: 300
});

roboto.load(null, 10000).then(() => {
  const now = window.performance.now();
  if (!window.performance || window.performance.now() < 1500) {
    console.log("Replace font!");
    $(document.body).addClass('font-loaded');
  } else {
    console.debug("Font loaded, but too late.", window.performance.now() / 1000);
  }
}, () => {
  console.log("Failed to load Roboto.", arguments);
});
