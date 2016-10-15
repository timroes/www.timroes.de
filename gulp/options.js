import gutil from 'gulp-util';

export default {

	noNetwork() {
		return gutil.env.network === false;
	}

}
