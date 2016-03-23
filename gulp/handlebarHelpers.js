import moment from 'moment';

const date = function (date) {
	return moment(date).format('MMM D, YYYY');
};

export default {
	date
};
