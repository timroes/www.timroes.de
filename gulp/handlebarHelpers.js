import moment from 'moment';

const date = function (date) {
	return moment(date).format('MMM D, YYYY');
};

const encode = function (str) {
	return encodeURIComponent(str);
};

const notequals = function (o1, o2, options) {
	return o1 != o2 ? options.fn(this) : null;
};

export default {
	date,
	encode,
	notequals
};
