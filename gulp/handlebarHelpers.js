import moment from 'moment';

const date = function (date) {
	return moment(date).format('MMM D, YYYY');
};

const encode = function (str) {
	return encodeURIComponent(str);
};

export default {
	date,
	encode
};
