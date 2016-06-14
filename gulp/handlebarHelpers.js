import moment from 'moment';

const date = function (date) {
	return moment(date).format('MMM D, YYYY');
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

export default {
	date,
	encode,
	notequals,
	substring,
	'use-first': useFirst,
	'date-iso': dateIso,
	'each-reverse': eachReverse
};
