import {postData} from '../handlebarData';
import posts from '../data/posts';
import merge from 'merge-stream';
import runSequence from 'run-sequence';
import Git from 'nodegit';

const git = Git.Repository.open('.');

function loadGitHistory(post) {
	let repo, walker, historyCommits = [];

	const compileHistory = function(commits) {
		let previousCommitSha;
		if (historyCommits.length > 0) {
			previousCommitSha = historyCommits[historyCommits.length - 1].commit.sha();
			if (commits.length === 1 && commits[0].commit.sha() === previousCommitSha) {
				return historyCommits;
			}
		}

		commits.forEach(function(entry) {
			historyCommits.push(entry);
		});

		const prevCommit = historyCommits[historyCommits.length - 1];
		if (!prevCommit) {
			// If the previous commit cannot be found abort here. This can happen if
			// a) the post has never been commited (currently working before the first commit)
			// b) not the full history has been cloned and the previous commit is outside clone depth
			return historyCommits;
		}
		previousCommitSha = prevCommit.commit.sha();

		walker = repo.createRevWalk();
		walker.push(previousCommitSha);
		walker.sorting(Git.Revwalk.SORT.Time);

		return walker.fileHistoryWalk(post.file, 1000)
			.then(compileHistory);
	};

	return git.then(r => {
			repo = r;
			return repo.getHeadCommit();
		}).then(commit => {
			walker = repo.createRevWalk();
			walker.push(commit.sha());
			walker.sorting(Git.Revwalk.SORT.Time);

			return walker.fileHistoryWalk(post.file, 1000);
		}).then(compileHistory).then(history => {
			// Sort by date (there might be some situations where it isn't sorted correctly)
			history.sort((a, b) => b.commit.date() - a.commit.date());
			const shas = {};
			post.history = history
				.map(entry => {
					const commit = entry.commit;
					return {
						sha: commit.sha().substr(0, 6),
						sha_full: commit.sha(),
						message: commit.message(),
						date: commit.date()
					};
				})
				// Filter out duplicate commits (may happen also)
				.filter(commit => shas.hasOwnProperty(commit.sha_full) ? false : (shas[commit.sha_full] = true));
			return post;
		});
}

export default function(gulp, paths, _, watch, pipelines) {

	const mtimes = {};

	/**
	 * If buildAll is true all posts will be build. Otherwise only posts where
	 * the actual markdown file has changed will be build.
	 */
	function buildPosts(buildAll) {
		const postPromises = posts().filter(post => {
			// Filter out posts that haven't been modified since last run of this task
			return buildAll || !mtimes[post.id] || !post.mtime.isSame(mtimes[post.id]);
		}).map(loadGitHistory);

		// Once all asynchronous loading tasks have finished...
		return Promise.all(postPromises)
				.then((posts) => {
					// Once all asynchronous tasks has been finished, start building the posts
					const streams = posts.map(post => {
						mtimes[post.id] = post.mtime;
						_.util.log(`Building output for post '${_.util.colors.cyan(post.id)}'...`);
						const postStreams = [gulp.src(paths.sources.index)
								.pipe(pipelines.handlebars(postData(post)))
								.pipe(_.rename(post.url + '/index.html'))
								.pipe(pipelines.html())];

						if (post.history.length > 0) {
							postStreams.push(gulp.src(paths.sources.history)
									.pipe(pipelines.handlebars(postData(post)))
									.pipe(_.rename(post.url + '/history.html'))
									.pipe(pipelines.html()));
						}

						return merge(...postStreams);
					});

					// If there is at least one stream, merge all streams together into one
					// convert this to a promise and return it (so gulp knows when this task finished)
					if (streams.length > 0) {
						return new Promise((resolve, reject) => {
							const mergedStream = merge(...streams)
							.pipe(_.size({
								gzip: true,
								showFiles: true,
								pretty: false
							}))
							.pipe(gulp.dest(paths.build))
							.pipe(_.connect.reload())
							.on('end', resolve)
							.on('error', reject);
						});
					}

				});
	}

	gulp.task('posts', ['resources'], (done) => {
		runSequence('posts-no-deps', done);
	});

	// Task that will rebuild all posts (without any dependet tasks, like resources).
	gulp.task('posts-no-deps', buildPosts.bind(null, true));

	// Task that will rebuild only the posts where the content files has changed.
	gulp.task('posts-content-changed', buildPosts.bind(null, false))

	watch([
		paths.sources.index,
		paths.sources.templates,
		paths.sources.history
	], ['posts-no-deps']);

	watch([
		paths.content.posts,
		paths.content.authors
	], ['posts-content-changed']);

	return {
		build: 'posts'
	};

}
