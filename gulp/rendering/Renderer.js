import marked from 'marked';
import imageSize from 'image-size';
import defaultLink, * as links from './linkTypes';
import * as contentModules from './contentModules';
import highlightjs from 'highlight.js';
import config from '../data/config';
import paths from '../paths';

function escape(html, encode) {
	return html
		.replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

/**
 * The actual "marked" renderer, that will be used for rendering the slightly
 * modified markdown that is used in this blog. This markdown has e.g. custom
 * links and special image rendering and more.
 * It also calculates the estimate reading time for the HTML it rendered.
 */
class ReadingTimeCalculatingRenderer extends marked.Renderer {

	constructor() {
		super();
		this._readingTime = 0;
	}

	get readingTime() {
		return this._readingTime;
	}

	code(code, lang, escaped) {
		if (this.options.highlight) {
			var out = this.options.highlight(code, lang);
			if (out != null && out !== code) {
				escaped = true;
				code = out;
			}
		}

		return `<pre><code class="hljs ${lang ? this.options.langPrefix + escape(lang, true) : ''}">${escaped ? code : escape(code, true)}</code></pre>`;
	}

	heading(text, level, raw) {
		const id = this.options.headerPrefix + raw.toLowerCase().replace(/[^\w]+/g, '-');
		return `<h${level} id="${id}">
				<a class="anchorlink" href="#${id}">
				${text}
				</a>
			</h${level}>`;
	}

	paragraph(text) {
		const module = /^\[\[([^\s\]]+)(?:\s([^\]]+))?\]\]$/.exec(text);
		if (module) {
			if (module[1] in contentModules) {
				return contentModules[module[1]](module[2]);
			}
		}
		return `<p>${text}</p>`;
	}

	link(href, title, text) {
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

		href = linkdata.href || linkParts[2];
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
	}

	image(href, title, text) {
		const size = imageSize(`${paths.content.base}/images${href}`);
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
	}
}

/**
 * This is the renderer used for rendering markdown strings to HTML and provide
 * additional information about the rendered output or the rendering process.
 */
export default class Renderer {

	/**
	 * Render the markdown passed to this method and return a result that returns
	 * the following keys:
	 * - html: the rendered HTML
	 * - readingTime: the estimated reading time for that post in minutes
	 */
	render(markdown) {
		const renderer = new ReadingTimeCalculatingRenderer();

		const html = marked(markdown, {
			renderer: renderer,
			highlight: this._highlight
		});

		return {
			html: html,
			readingTime: renderer.readingTime
		};
	}

	_highlight(code, lang) {
		if (!lang) {
			return highlightjs.highlightAuto(code).value;
		} else if (lang === '-') {
			return code;
		} else {
			return highlightjs.highlight(lang, code).value;
		}
	}

}
