import glob from 'glob';
import path from 'path';
import yaml from 'yamljs';
import paths from '../paths';

/**
 * Return all configuration options from the config folder.
 * This will create an object with the file name of the config file as a key
 * and all options in it as a value.
 */
export default function() {
	const config = {};
	glob.sync(paths.content.config).forEach(file => {
		config[path.basename(file, '.yml')] = yaml.load(file.toString());
	});
	return config;
}
