import timelion from './timelion';

export default function registerAdditionalLanguages(hljs) {
	hljs.registerLanguage('timelion', timelion);
}
