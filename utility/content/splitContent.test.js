import splitContent from './splitContent.js'

import expectToEqual from '../expectToEqual.js'

function splitContentTest(content, at, expectedLeft, expectedRight) {
	let options
	if (!Array.isArray(at)) {
		options = at.options
		at = at.indexPath
	}
	expectToEqual(
		splitContent(content, at, options),
		[expectedLeft, expectedRight]
	)
}

describe('splitContent', () => {
	it('should split content (post content is an array of paragraphs; normalizes string)', () => {
		splitContentTest(
			[
				[
					'Abc (multi-paragraph)'
				],
				[{
					type: 'link',
					content: [
						'123',
						{
							type: 'text',
							content: '456'
						},
						'789'
					]
				}],
				[
					'Ghi'
				]
			],
			// At index path.
			[1, 0, 1],
			// Left part.
			[
				[
					'Abc (multi-paragraph)'
				],
				[{
					type: 'link',
					content: [
						'123',
						{
							type: 'text',
							content: '456'
						}
					]
				}]
			],
			// Right part.
			[
				[{
					type: 'link',
					content: '789'
				}],
				[
					'Ghi'
				]
			]
		)
	})

	it('should split content (post content is a paragraph; normalizes string)', () => {
		splitContentTest(
			[
				'Abc',
				{
					type: 'link',
					content: [
						'123',
						{
							type: 'text',
							content: '456'
						},
						'789'
					]
				},
				'Ghi'
			],
			// At index path.
			[1, 1],
			// Right part.
			[
				'Abc',
				{
					type: 'link',
					content: [
						'123',
						{
							type: 'text',
							content: '456'
						}
					]
				}
			],
			[
				{
					type: 'link',
					content: '789'
				},
				'Ghi'
			]
		)
	})

	it('should split content (post content is a paragraph; normalizes string; `include: false`)', () => {
		splitContentTest(
			[
				'Abc',
				{
					type: 'link',
					content: [
						'123',
						{
							type: 'text',
							content: '456'
						},
						'789'
					]
				},
				'Ghi'
			],
			// At index path.
			{
				indexPath: [1, 1],
				options: {
					include: false
				}
			},
			// Right part.
			[
				'Abc',
				{
					type: 'link',
					content: '123'
				}
			],
			[
				{
					type: 'link',
					content: '789'
				},
				'Ghi'
			]
		)
	})

	it('should split content (post content is an array of paragraphs; post-links inside)', () => {
		splitContentTest(
			[
				[
					{
						"type": "post-link",
						"content": [
							{
								type: "quote",
								content: [
									"Происхождение ",
									{
										"type": "text",
										"style": "bold",
										"content": "Александра Сергеевича Пушкина"
									},
									" идёт от разветвлённого нетитулованного дворянского рода Пушкиных, восходившего по генеалогической легенде к «мужу честну» Ратше."
								]
							},
							'\n',
							{
								type: "quote",
								content: "Пушкин неоднократно писал о своей родословной в стихах и прозе; он видел в своих предках образец истинной «аристократии», древнего рода, честно служившего отечеству, но не снискавшего благосклонности правителей и «гонимого»."
							}
						]
					}
				]
			],
			// Options.
			[0, 0, 0, 1],
			// Left part.
			[
				[
					{
						"type": "post-link",
						"content": [
							{
								type: "quote",
								content: [
									"Происхождение ",
									{
										"type": "text",
										"style": "bold",
										"content": "Александра Сергеевича Пушкина"
									}
								]
							}
						]
					}
				]
			],
			// Right part.
			[
				[
					{
						"type": "post-link",
						"content": [
							{
								type: "quote",
								content: " идёт от разветвлённого нетитулованного дворянского рода Пушкиных, восходившего по генеалогической легенде к «мужу честну» Ратше."
							},
							'\n',
							{
								type: "quote",
								content: "Пушкин неоднократно писал о своей родословной в стихах и прозе; он видел в своих предках образец истинной «аристократии», древнего рода, честно служившего отечеству, но не снискавшего благосклонности правителей и «гонимого»."
							}
						]
					}
				]
			]
		)
	})
})