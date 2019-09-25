import expectToEqual from '../expectToEqual'

import loadTwitterLinks from './loadTwitterLinks'

const messages = {
	link: 'Link'
}

// `fetch-jsonp` is not supported in Node.js, so this test is skipped.
describe.skip('loadTwitterLinks', () => {
	it('should not load Twitter links when there\'re no links', async () => {
		expectToEqual(
			await loadTwitterLinks(undefined),
			false
		)
		const content = [
			[
				'Abc'
			]
		]
		expectToEqual(
			await loadTwitterLinks(content),
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
		expectToEqual(
			await loadTwitterLinks(content, { messages }),
			true
		)
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