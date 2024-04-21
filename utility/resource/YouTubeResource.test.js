import expectToEqual from '../expectToEqual.js'

import { loadResourceLinks_ } from '../post/loadResourceLinks.js'
import YouTubeResource from './YouTubeResource.js'

function loadYouTubeLinks(content, options = {}) {
	return loadResourceLinks_(content, { youtube: YouTubeResource }, {
		...options,
		hasBeenStopped: () => false,
		addUndoOperation: () => {}
	})
}

describe('loadYouTubeLinks', () => {
	it('should not load YouTube links when there\'re no links', async () => {
		expectToEqual(
			loadYouTubeLinks(undefined),
			[]
		)
		const content = [
			[
				'Abc'
			]
		]
		expectToEqual(
			loadYouTubeLinks(content),
			[]
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

		const loadYouTubeLinksResult = loadYouTubeLinks(content)
		expectToEqual(Array.isArray(loadYouTubeLinksResult), true)
		expectToEqual(loadYouTubeLinksResult.length, 1)
		expectToEqual(await loadYouTubeLinksResult[0], {
			loadable: true,
			loaded: true
		})

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