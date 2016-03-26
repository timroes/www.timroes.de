import marked from 'marked';
import highlightjs from 'highlight.js';

function escape(html, encode) {
	return html
		.replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

const renderer = new marked.Renderer();

renderer.code = function(code, lang, escaped) {

	if (this.options.highlight) {
		var out = this.options.highlight(code, lang);
		if (out != null && out !== code) {
			escaped = true;
			code = out;
		}
	}

	return `<pre><code class="hljs ${lang ? this.options.langPrefix + escape(lang, true) : ''}">${escaped ? code : escape(code, true)}</code></pre>`;
};

renderer.heading = function(text, level, raw) {
	const id = this.options.headerPrefix + raw.toLowerCase().replace(/[^\w]+/g, '-');
	return `<h${level} id="${id}">
			<a class="anchorlink" href="#${id}">
			${text}
			</a>
		</h${level}>`;
};

export default function (content) {
	return marked(content, {
		renderer: renderer,
		highlight: function(code, lang) {
			if (!lang) {
				return highlightjs.highlightAuto(code).value;
			} else {
				return highlightjs.highlight(lang, code).value;
			}
		}
	});
};
