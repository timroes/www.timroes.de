window.cookieconsent_options = {
	"message": "This website uses cookies to ensure you get the best experience and customization.",
	"dismiss": "Got it!",
	"learnMore": "More info",
	"link": "/privacypolicy",
	"theme": "dark-bottom"
};

const script = document.createElement('script');
script.src = '//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/1.0.9/cookieconsent.min.js';
script.async = true;
document.body.appendChild(script);
