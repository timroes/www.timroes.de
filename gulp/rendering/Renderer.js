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
 * Count the words in a given text.
 */
function wordCount(text) {
	return text.split(/\s+/).length;
}

/**
 * The actual "marked" renderer, that will be used for rendering the slightly
 * modified markdown that is used in this blog. This markdown has e.g. custom
 * links and special image rendering and more.
 * It also calculates the estimate reading time for the HTML it rendered.
 */
class ReadingTimeCalculatingRenderer extends marked.Renderer {

	constructor(options) {
		super();
		options = options || {};
		// Apply default values for reading time factors
		// Time per regular text word (usualy inside lists or such)
		this.timePerTextWord = options.timePerTextWord || 0.35;
		// Time per word in a paragraph (this usually falls back to the time per text word)
		this.timePerParagraphWord = options.timePerParagraphWord || this.timePerTextWord;
		// Time per word in a headline, if not set this is just slightly above paragraph
		// words to compensate for pauses between chapters
		this.timePerHeadingWord = options.timePerHeadingWord || this.timePerParagraphWord + 0.1;
		// Fixed time per image to add
		this.timePerImage = options.timePerImage || 3;
		// Time per word in a code block. These usually take longer to read than regular text
		this.timePerCodeWord = options.timePerCodeWord || (this.timePerTextWord * 5);
		// Time per word in a table cell. Usually takes also longer than regular text
		this.timePerTableWord = options.timePerTableWord || (this.timePerTextWord * 2)
		this._readingTime = 0;
	}

	get readingTime() {
		const minutes = Math.ceil(this._readingTime / 60);
		// Everything above 15 minutes round up to 5 minutes
		return minutes <= 15 ? minutes : (Math.ceil(minutes / 5) * 5);
	}

	code(code, lang, escaped) {
		this._readingTime += wordCount(code) * this.timePerCodeWord;
		if (this.options.highlight) {
			var out = this.options.highlight(code, lang);
			if (out != null && out !== code) {
				escaped = true;
				code = out;
			}
		}

		return `<pre><code class="hljs ${lang ? this.options.langPrefix + escape(lang, true) : ''}">${escaped ? code : escape(code, true)}</code></pre>`;
	}

	/**
	 * Render a heading in the markdown.
	 * This will also add a link to every heading, that links to the id of that
	 * heading itself. Users can click and copy the heading to link to that section.
	 */
	heading(text, level, raw) {
		this._readingTime += wordCount(text) * this.timePerHeadingWord;
		const id = raw.toLowerCase().replace(/[^\w]+/g, '-');
		return `<h${level} id="${id}">
				<a class="anchorlink" href="#${id}">
				${text}
				</a>
			</h${level}>`;
	}

	paragraph(text) {
		this._readingTime += wordCount(text) * this.timePerParagraphWord;
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
		this._readingTime += this.timePerImage;
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

	listitem(text) {
		this._readingTime += wordCount(text) * this.timePerTextWord;
		return super.listitem(text);
	}

	tablecell(content, flags) {
		this._readingTime += wordCount(content) * this.timePerTableWord;
		return super.tablecell(content, flags);
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