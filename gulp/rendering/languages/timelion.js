const SELF = 'self';

const FUNCTIONS = {
	begin: /\.[a-zA-Z]+\(/,
	end: /\)/,
	returnBegin: true,
	contains: [
		{
			// Highlight actual keyword of the function
			className: 'keyword',
			begin: /\.[A-Za-z]+/
		},
		{
			// Close the function directly after we parsed the actual function keyword
			// with the regex above
			endsParent: true
		}
	]
};

const PARAM_NAMES = {
	className: 'name',
	endsWithParent: true,
	begin: /[A-Za-z]+[=]/,
	end: /\s|\S/,
	excludeEnd: true
};

export default (hljs) => ({
	contains: [
		FUNCTIONS,
		PARAM_NAMES,
		SELF
	]
});
