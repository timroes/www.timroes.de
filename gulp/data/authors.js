import glob from 'glob';
import path from 'path';
import yaml from 'yamljs';
import paths from '../paths';

/**
 * Return all author informations by parsing the authors yaml files in content/authors/.
 * This will return a map from the author id (i.e. the filename) to the parsed information
 * in that file.
 */
export default function() {
	const authors = {};
	glob.sync(paths.content.authors).forEach(file => {
		authors[path.basename(file, '.yml')] = yaml.load(file.toString());
	});
	return authors;
}
