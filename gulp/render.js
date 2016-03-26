import marked from 'marked';
import defaultLink, * as links from './linkTypes';
import highlightjs from 'highlight.js';
import config from './data/config';

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

renderer.link = function(href, title, text) {
	if (this.options.sanitize) {
		try {
			var prot = decodeURIComponent(unescape(href))
				.replace(/[^\w:]/g, '')
				.toLowerCase();
		} catch (e) {
			return '';
		}
		if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0) {
			return '';
		}
	}

	const linkParts = /([^:]+):(.*)/.exec(href);

	const linkParser = (linkParts[1] in links) ? links[linkParts[1]] : defaultLink.bind(defaultLink, linkParts[1]);

	const linkdata = linkParser(linkParts[2], title, text);

	href = linkdata.href || href;
	title = linkdata.title || title;
	text = linkdata.text || text;
	const blank = linkdata.blank === false ? false : true;
	const classes = linkdata.classes || [];

	let out = `<a href="${href}"`;
	if (title) {
		out += ` title="${title}"`;
	}
	if (classes.length) {
		out += ` class="${classes.join(' ')}"`;
	}
	if (blank) {
		out += ` target="_blank"`;
	}
	out += `>${text}</a>`;
	return out;
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
