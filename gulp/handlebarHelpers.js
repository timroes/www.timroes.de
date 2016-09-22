import moment from 'moment';

const date = function (date) {
	return moment(date).format('MMM D, YYYY');
};

const srDate = function (date) {
	return moment(date).format('MMMM D, YYYY');
};

/*
 * Parses the argument as a date (with moment.js) and formats it as an ISO 8601 datetime string.
 */
const dateIso = function(date) {
	return moment(date).toISOString();
};

const encode = function (str) {
	return encodeURIComponent(str);
};

const notequals = function (o1, o2, options) {
	return o1 != o2 ? options.fn(this) : null;
};

/**
 * Takes a flexible amount of parameters and will output the first one that is not falsy.
 */
const useFirst = function (...args) {
	// Search for first truthy argument and return it. Skip the last element, since
	// this is the handlebars options.
	for (let i in args) {
		if (args[i] && i < args.length - 1) {
			return args[i];
		}
	}
	return undefined;
};

const eachReverse = function (context) {
	var options = arguments[arguments.length - 1];
	var ret = '';

	if (context && context.length > 0) {
		for (var i = context.length - 1; i >= 0; i--) {
			ret += options.fn(context[i]);
		}
	} else {
		ret = options.inverse(this);
	}

	return ret;
};

const substring = function (str, start, end) {
	return str.substring(start, end);
};

/**
 * Replace the .svg in the end of a filename with .png.
 * Is used for social media images, that cannot be svg for most platforms.
 */
const svgAsPng = function (str) {
	return str.replace(/\.svg$/, '.png');
};

const svgIcon = function (icon) {
	return `<svg class="icon" aria-hidden="true" width="1em" height="1em"><use xlink:href="/assets/icons.svg#${icon}"></use></svg>`
};

const flatJoin = function (context) {
	const params = Array.prototype.slice.call(arguments, 0, -1).filter(arg => arg);
	const arr = [].concat.apply([], params);
	return arr.join(',');
};

export default {
	date,
	encode,
	notequals,
	substring,
	'flat-join': flatJoin,
	'use-first': useFirst,
	'date-iso': dateIso,
	'each-reverse': eachReverse,
	'svg-as-png': svgAsPng,
	'svg-icon': svgIcon,
	'sr-date': srDate
};
