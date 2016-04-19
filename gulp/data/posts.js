import rawPosts from './rawPosts';
import Renderer from '../rendering/Renderer';

const renderer = new Renderer();

/**
 * 
 */
export default function() {
	return rawPosts().map(post => {
		const renderingResult = renderer.render(post.markdown);
		post.content = renderingResult.html;
		post.readingTime = renderingResult.readingTime;
		return post;
	});
}
