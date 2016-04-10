import imageSize from 'image-size';
import marked from 'marked';
import defaultLink, * as links from './linkTypes';
import * as contentModules from './contentModules';
import highlightjs from 'highlight.js';
import config from './data/config';
import paths from './paths';

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

renderer.paragraph = function(text) {
	const module = /^\[\[([^\s\]]+)(?:\s([^\]]+))?\]\]$/.exec(text);
	if (module) {
		if (module[1] in contentModules) {
			return contentModules[module[1]](module[2]);
		}
	}
	return `<p>${text}</p>`;
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

renderer.image = function(href, title, text) {
	const size = imageSize(`${paths.build}/images${href}`);
	const ratio = (size.height / size.width) * 100;

	const isFloating = /:$/.test(text);
	if (isFloating) {
		text = text.replace(/:$/, '');
	}

	let out = `<div class="image-wrapper ${isFloating ? 'floating' : ''}"
			${isFloating ? 'style="width:' + size.width + 'px;height:'+size.height+'px"' : ''}
		>
		<div class="image-placeholder" style="padding-bottom: ${ratio}%"></div>
		<img src="/images${href}"`;
	// Allow right floating images
	if (isFloating) {
		out += 'class="image-right"';
	}
	if (title) {
		out += ' title="' + title + '"';
	}
	out += `alt="${text}"></div>`;
	return out;
};

export default function (content) {
	return marked(content, {
		renderer: renderer,
		highlight: function(code, lang) {
			if (!lang) {
				return highlightjs.highlightAuto(code).value;
			} else if (lang === '-') {
				return code;
			} else {
				return highlightjs.highlight(lang, code).value;
			}
		}
	});
};
