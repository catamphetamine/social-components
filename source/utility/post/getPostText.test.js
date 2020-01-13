import getPostText from './getPostText'

import expectToEqual from '../expectToEqual'

function getPostTextTest(post, options, text) {
	if (text === undefined) {
		text = options
		options = {}
	}
	expectToEqual(getPostText(post, options), text)
}

const messages = {
	contentType: {
		picture: 'Picture',
		video: 'Video'
	}
}

describe('getPostText', () => {
	it('should get post text', () => {
		getPostTextTest(
			{
				content: 'Abc'
			},
			'Abc'
		)

		getPostTextTest(
			{
				content: ['Abc']
			},
			'Abc'
		)

		getPostTextTest(
			{
				content: [['Abc']]
			},
			'Abc'
		)

		getPostTextTest(
			{
				content: ['Abc', 'Def']
			},
			'Abc\n\nDef'
		)

		getPostTextTest(
			{
				content: [['Abc', 'Def']]
			},
			'AbcDef'
		)

		getPostTextTest(
			{
				content: [['Abc', '\n', 'Def']]
			},
			'Abc\nDef'
		)
	})

	it('should trim whitespace', () => {
		getPostTextTest(
			{
				content: [
					[
						"Embrace the 2d edition",
						"\n",
						"\n",
						"HIS GENERAL ISN'T JUST ABOUT SLAVE TRAINERS OTHER GENRES OF GAMES FIT HERE ALSO (Please read the next part for further clarification).",
						"\n"
					]
				]
			},
			"Embrace the 2d edition\n\nHIS GENERAL ISN'T JUST ABOUT SLAVE TRAINERS OTHER GENRES OF GAMES FIT HERE ALSO (Please read the next part for further clarification)."
		)
	})

	it('should support "post-link"s', () => {
		getPostTextTest(
			{
				content:
				[
					[
						{
							type: 'post-link',
							content: [
								{
									type: 'quote',
									content: 'Quote 1'
								},
								'\n',
								{
									type: 'quote',
									content: 'Quote 2'
								}
							]
						},
						'\n',
						'Abc'
					]
				]
			},
			{},
			'«Quote 1»\n«Quote 2»\nAbc'
		)
	})

	it('should not skip autogenerated inline quotes when "skipGeneratedPostQuoteBlocks" is "true"', () => {
		getPostTextTest(
			{
				content:
				[
					[
						{
							type: 'post-link',
							content: [{
								type: 'quote',
								content: 'Quote',
								generated: true
							}]
						},
						'\n',
						'Abc'
					]
				]
			},
			{
				skipGeneratedPostQuoteBlocks: true
			},
			'«Quote»\nAbc'
		)
	})

	it('should skip autogenerated block quotes when "skipGeneratedPostQuoteBlocks" is "true"', () => {
		getPostTextTest(
			{
				content:
				[
					[
						{
							type: 'post-link',
							content: [{
								type: 'quote',
								content: 'Quote',
								generated: true,
								block: true
							}]
						},
						'\n',
						'Abc'
					]
				]
			},
			{
				skipGeneratedPostQuoteBlocks: true
			},
			'Abc'
		)
	})

	it('should not skip non-autogenerated quotes when "skipGeneratedPostQuoteBlocks" is "true"', () => {
		getPostTextTest(
			{
				content:
				[
					[
						{
							type: 'post-link',
							content: [{
								type: 'quote',
								content: 'Quote'
							}]
						},
						'\n',
						'Abc'
					]
				]
			},
			{
				skipGeneratedPostQuoteBlocks: true
			},
			'«Quote»\nAbc'
		)
	})

	it('should convert quotes to text', () => {
		getPostTextTest(
			{
				content:
				[
					[
						{
							type: 'quote',
							content: 'Quote'
						},
						'\n',
						'Abc'
					]
				]
			},
			'«Quote»\nAbc'
		)
	})

	it('should get post text from nested blocks', () => {
		getPostTextTest(
			{
				content:
				[
					[
						{
							type: 'text',
							style: 'bold',
							content: [
								{
									type: 'link',
									url: 'https://google.com',
									content: 'Google'
								},
								' ',
								{
									type: 'text',
									style: 'italic',
									content: 'link'
								}
							]
						},
						'\n',
						'Abc'
					]
				]
			},
			'Google link\nAbc'
		)

		getPostTextTest(
			{
				content:
				[
					[
						{
							type: 'quote',
							content: [
								{
									type: 'link',
									url: 'https://google.com',
									content: 'Google'
								},
								' ',
								{
									type: 'text',
									style: 'italic',
									content: 'link'
								}
							]
						},
						'\n',
						'Abc'
					]
				]
			},
			'«Google link»\nAbc'
		)
	})

	it('should get post text when attachments are embedded (no messages passed)', () => {
		getPostTextTest(
			{
				content:
				[
					[
						'Abc'
					],
					{
						type: 'attachment',
						attachmentId: 1
					},
					[
						'Def'
					],
					{
						type: 'attachment',
						attachmentId: 2
					},
					[
						'Ghi'
					]
				],
				attachments: [{
					id: 1,
					type: 'video',
					video: {}
				}, {
					id: 2,
					type: 'picture',
					picture: {}
				}]
			},
			'Abc\n\nDef\n\nGhi'
		)
	})

	it('should get post text when attachments are embedded (messages passed)', () => {
		getPostTextTest(
			{
				content: [
					[
						'Abc'
					],
					{
						type: 'attachment',
						attachmentId: 1
					},
					[
						'Def'
					],
					{
						type: 'attachment',
						attachmentId: 2
					},
					[
						'Ghi'
					]
				],
				attachments: [{
					id: 1,
					type: 'video',
					video: {}
				}, {
					id: 2,
					type: 'picture',
					picture: {}
				}]
			},
			{
				messages,
				skipAttachments: false,
				skipUntitledAttachments: false
			},
			'Abc\n\nVideo\n\nDef\n\nPicture\n\nGhi'
		)
	})

	it('should get post text when attachments are embedded (messages passed) (attachments have titles)', () => {
		getPostTextTest(
			{
				content:
				[
					[
						'Abc'
					],
					{
						type: 'attachment',
						attachmentId: 1
					},
					[
						'Def'
					],
					{
						type: 'attachment',
						attachmentId: 2
					},
					[
						'Ghi'
					]
				],
				attachments: [{
					id: 1,
					type: 'video',
					video: {
						title: 'Video Title'
					}
				}, {
					id: 2,
					type: 'picture',
					picture: {
						title: 'Picture Title'
					}
				}]
			},
			{
				messages,
				skipAttachments: false
			},
			'Abc\n\n«Video Title»\n\nDef\n\n«Picture Title»\n\nGhi'
		)
	})

	it('should get post text when attachments are embedded (messages passed) (attachments not found)', () => {
		getPostTextTest(
			{
				content: [
					[
						'Abc'
					],
					{
						type: 'attachment',
						attachmentId: 3
					},
					[
						'Def'
					],
					{
						type: 'attachment',
						attachmentId: 4
					},
					[
						'Ghi'
					]
				],
				attachments: [{
					id: 1,
					type: 'video',
					video: {}
				}, {
					id: 2,
					type: 'picture',
					picture: {}
				}]
			},
			{
				messages,
				skipAttachments: false
			},
			'Abc\n\nDef\n\nGhi'
		)
	})

	it('should skip embedded attachments when "skipAttachments" is "true"', () => {
		getPostTextTest(
			{
				content: [
					[
						'Abc'
					],
					{
						type: 'attachment',
						attachmentId: 1
					},
					[
						'Def'
					],
					{
						type: 'attachment',
						attachmentId: 2
					},
					[
						'Ghi'
					]
				],
				attachments: [{
					id: 1,
					type: 'video',
					video: {
						title: 'Video Title'
					}
				}, {
					id: 2,
					type: 'picture',
					picture: {
						title: 'Picture Title'
					}
				}]
			},
			{
				messages
			},
			'Abc\n\nDef\n\nGhi'
		)
	})

	it('should skip untitled attachments when "skipUntitledAttachments" is "true"', () => {
		getPostTextTest(
			{
				content: [
					[
						'Abc'
					],
					{
						type: 'attachment',
						attachmentId: 1
					},
					[
						'Def'
					],
					{
						type: 'attachment',
						attachmentId: 2
					},
					[
						'Ghi'
					]
				],
				attachments: [{
					id: 1,
					type: 'video',
					video: {}
				}, {
					id: 2,
					type: 'picture',
					picture: {
						title: 'Picture Title'
					}
				}]
			},
			{
				messages,
				skipAttachments: false
			},
			'Abc\n\nDef\n\n«Picture Title»\n\nGhi'
		)
	})

	it('should skip non-embedded attachments by default when "skipAttachments" is "false"', () => {
		expect(getPostText(
			{
				attachments: [{
					id: 1,
					type: 'video',
					video: {
						title: 'Video Title'
					}
				}, {
					id: 2,
					type: 'picture',
					picture: {
						title: 'Picture Title'
					}
				}]
			},
			{
				messages,
				skipAttachments: false
			}
		)).to.be.undefined
	})

	it('should return attachment title when there\'s no post text and "skipAttachments" is "false"', () => {
		getPostTextTest(
			{
				content: [
					{
						type: 'attachment',
						attachmentId: 1
					},
					{
						type: 'attachment',
						attachmentId: 2
					}
				],
				attachments: [{
					id: 1,
					type: 'video',
					video: {
						title: 'Video Title'
					}
				}, {
					id: 2,
					type: 'picture',
					picture: {
						title: 'Picture Title'
					}
				}]
			},
			{
				messages,
				skipAttachments: false
			},
			'«Video Title»\n\n«Picture Title»'
		)
	})

	it('should return attachment placeholder when there\'s no post text and the attachment is untitled and "skipAttachments" is "false"', () => {
		getPostTextTest(
			{
				content: [
					{
						type: 'attachment',
						attachmentId: 1
					},
					{
						type: 'attachment',
						attachmentId: 2
					}
				],
				attachments: [{
					id: 1,
					type: 'video',
					video: {}
				}, {
					id: 2,
					type: 'picture',
					picture: {}
				}]
			},
			{
				messages,
				skipAttachments: false,
				skipUntitledAttachments: false
			},
			'Video\n\nPicture'
		)
	})

	// it('shouldn\'t return attachment placeholder when there\'s no post text and "ignoreAttachments" is "true"', () => {
	// 	getPostTextTest(
	// 		{
	// 			content: [
	// 				{
	// 					type: 'attachment',
	// 					attachmentId: 1
	// 				},
	// 				{
	// 					type: 'attachment',
	// 					attachmentId: 2
	// 				}
	// 			],
	// 			attachments: [{
	// 				id: 1,
	// 				type: 'video',
	// 				video: {}
	// 			}, {
	// 				id: 2,
	// 				type: 'picture',
	// 				picture: {}
	// 			}]
	// 		},
	// 		{
	// 			messages,
	// 			ignoreAttachments: true
	// 		},
	// 		''
	// 	)
	// })

	it('should get post text when social attachments are present', () => {
		getPostTextTest(
			{
				content: [
					[
						'Abc'
					],
					{
						type: 'attachment',
						attachmentId: 1
					}
				],
				attachments: [{
					id: 1,
					type: 'social',
					social: {
						provider: 'Instagram',
						content: 'My favorite cat from tonight\'s episode- a true winner. #newgirl',
						url: 'https://www.instagram.com/p/V8UMy0LjpX/',
						author: {
							name: 'Zooey Deschanel',
							id: 'zooeydeschanel',
							url: 'https://www.instagram.com/zooeydeschanel'
						},
						date: new Date('2013-02-20T06:17:14+00:00'),
						attachments: [{
							type: 'picture',
							picture: {
								type: 'image/jpeg',
								width: 612,
								height: 612,
								url: 'https://scontent-arn2-1.cdninstagram.com/vp/fe285833a2d6da37c81165bc7e03f8d8/5D3E22F2/t51.2885-15/e15/11262720_891453137565191_1495973619_n.jpg?_nc_ht=scontent-arn2-1.cdninstagram.com'
							}
						}]
					}
				}]
			},
			{
				messages,
				skipAttachments: false
			},
			'Abc\n\nZooey Deschanel (@zooeydeschanel): «My favorite cat from tonight\'s episode- a true winner. #newgirl»'
		)
	})

	it('should shorten code blocks', () => {
		getPostTextTest(
			{
				content: [
					[{
						type: 'code',
						content: 'console.log("first line")\nconsole.log("second line")'
					}]
				]
			},
			undefined,
			'console.log("first line")'
		)
	})

	it('shouldn\'t shorten single-line code blocks', () => {
		getPostTextTest(
			{
				content: [
					[{
						type: 'code',
						content: 'console.log("first line")'
					}]
				]
			},
			undefined,
			'console.log("first line")'
		)
	})

	it('should return on new line', () => {
		getPostTextTest(
			{
				content: [
					[
						'Abc',
						'\n',
						'Def'
					]
				]
			},
			{
				stopOnNewLine: true
			},
			'Abc'
		)
	})

	it('should return on new line (paragraph)', () => {
		getPostTextTest(
			{
				content: [
					[
						'Abc'
					],
					[
						'Def'
					]
				]
			},
			{
				stopOnNewLine: true
			},
			'Abc'
		)
	})

	it('should replace autogenerated links with "link to domain"', () => {
		getPostTextTest(
			{
				content: [
					[
						{
							type: 'link',
							url: 'https://www.google.com/ru/maps?x=y',
							contentGenerated: true,
							content: 'google.com/ru/maps?x=y'
						}
					]
				]
			},
			{
				messages: {
					contentType: {
						linkTo: 'link to {0}'
					}
				}
			},
			'(link to google.com)'
		)
	})

	it('shouldn\'t replace non-autogenerated links with "link to domain"', () => {
		getPostTextTest(
			{
				content: [
					[
						{
							type: 'link',
							url: 'https://www.google.com/ru/maps?x=y',
							content: 'Abc'
						}
					]
				]
			},
			'Abc'
		)
	})
})