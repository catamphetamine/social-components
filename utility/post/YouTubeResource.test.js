import expectToEqual from '../expectToEqual.js'

import { loadResourceLinks } from './loadResourceLinks.js'
import YouTubeResource from './YouTubeResource.js'

function loadYouTubeLinks(content, options = {}) {
	return loadResourceLinks(content, { youtube: YouTubeResource }, options)
}

describe('loadYouTubeLinks', () => {
	it('should not load YouTube links when there\'re no links', async () => {
		expectToEqual(
			await loadYouTubeLinks(undefined),
			false
		)
		const content = [
			[
				'Abc'
			]
		]
		expectToEqual(
			await loadYouTubeLinks(content),
			false
		)
		expectToEqual(
			content,
			[
				[
					'Abc'
				]
			]
		)
	})

	it('should load YouTube links without API key', async () => {
		// Parse YouTube link without YouTube API key.
		const content = [
			[
				'Abc ',
				{
					type: 'link',
					url: 'https://www.youtube.com/watch?v=6CPXGQ0zoJE',
					service: 'youtube',
					content: 'youtube.com/watch?v=6CPXGQ0zoJE'
				},
				' def'
			]
		]
		expectToEqual(
			await loadYouTubeLinks(content),
			true
		)
		expectToEqual(
			content,
			[
				[
					'Abc ',
					{
						type: 'link',
						url: 'https://www.youtube.com/watch?v=6CPXGQ0zoJE',
						service: 'youtube',
						content: 'youtube.com/watch?v=6CPXGQ0zoJE',
						"attachment": {
							"type": "video",
							"video": {
								"picture": {
									"type": "image/jpeg",
									"url": "https://img.youtube.com/vi/6CPXGQ0zoJE/maxresdefault.jpg",
									// `Image` is not available in Node.js.
									// "width": 1280,
									// "height": 720
									"width": 120,
									"height": 90
								},
								"provider": "YouTube",
								"id": "6CPXGQ0zoJE"
							}
						}
					},
					' def'
				]
			]
		)
	})
})