import marked from 'marked';
import highlightjs from 'highlight.js';

export default function (content) {
	return marked(content, {
		highlight: function(code, lang) {
			if (!lang) {
				return highlightjs.highlightAuto(code).value;
			} else {
				return highlightjs.highlight(lang, code).value;
			}
		}
	});
};
