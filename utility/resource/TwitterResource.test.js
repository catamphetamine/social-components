import expectToEqual from '../expectToEqual.js'

import { loadResourceLinks_ } from '../post/loadResourceLinks.js'
import TwitterResource from './TwitterResource.js'

function loadTwitterLinks(content, options = {}) {
	return loadResourceLinks_(content, { twitter: TwitterResource }, {
		...options,
		hasBeenStopped: () => false,
		addUndoOperation: () => {}
	})
}

// `fetch-jsonp` is not supported in Node.js, so this test is skipped.
describe.skip('loadTwitterLinks', () => {
	it('should not load Twitter links when there\'re no links', async () => {
		expectToEqual(
			loadTwitterLinks(undefined),
			[]
		)
		const content = [
			[
				'Abc'
			]
		]
		expectToEqual(
			loadTwitterLinks(content),
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

	it('should load Twitter links', async () => {
		const content = [
			[
				'Abc ',
				{
					type: 'link',
					url: 'https://twitter.com/HaloCodex/status/1049097736211980288',
					service: 'twitter',
					content: 'HaloCodex/1049097736211980288'
				},
				' def'
			]
		]

		const loadTwitterLinksResult = loadTwitterLinks(content, { messages })
		expectToEqual(Array.isArray(loadTwitterLinksResult), true)
		expectToEqual(loadTwitterLinksResult.length, 1)
		expectToEqual(await loadTwitterLinksResult[0], {
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
						url: 'https://twitter.com/HaloCodex/status/1049097736211980288',
						service: 'twitter',
						content: 'Halo Codex (@HaloCodex): The Halo 2 voice acting was amazing. @joestaten @MartyTheElder  #Halo2 (link)',
						attachment: {
							type: 'social',
							social: {
								provider: "Twitter",
								url: 'https://twitter.com/HaloCodex/status/1049097736211980288',
								content: "The Halo 2 voice acting was amazing. @joestaten @MartyTheElder  #Halo2 (link)",
								date: new Date(2018, 9, 8),
								author: {
									id: 'HaloCodex',
									name: 'Halo Codex',
									url: 'https://twitter.com/HaloCodex'
								}
							}
						}
					},
					' def'
				]
			]
		)
	})
})