import generatePostPreview_ from './generatePostPreview.js'

import expectToEqual from '../expectToEqual.js'

function generatePostPreview(content, attachments, options) {
	return generatePostPreview_({ content, attachments }, {
		...options,
		maxLength: options.limit,
		limit: undefined
	})
}

function getPostPreviewTest(post, options, expected) {
	if (Array.isArray(post)) {
		post = {
			content: post
		}
	}
	// // The default `minFitFactor` is not 1 by default.
	// if (options.minFitFactor === undefined && !options.useDefaultFitFactor) {
	// 	options.minFitFactor = 1
	// }
	// The default `maxFitFactor` is not 1 by default.
	if (options.maxFitFactor === undefined && !options.useDefaultFitFactor) {
		options.maxFitFactor = 1
	}
	expectToEqual(generatePostPreview(post.content, post.attachments, options), expected)
}

describe('generatePostPreview', () => {
	it('should return `undefined` if no preview is required (when post is small enough)', () => {
		getPostPreviewTest(
			[
				[
					'Abc'
				],
				[
					'Def'
				]
			],
			{
				limit: 100,
				useDefaultFitFactor: true
			},
			undefined
		)
	})

	it('should truncate on whitespace when there\'re no ends of sentence', () => {
		getPostPreviewTest(
			[
				[
					'Thefirstsentence.'
				]
			],
			{
				limit: 10,
				useDefaultFitFactor: true
			},
			[
				[
					'Thefirstse…',
					{ type: 'read-more' }
				]
			]
		)
	})

	it('should truncate on whitespace when there\'re no ends of sentence (not a nested array)', () => {
		getPostPreviewTest(
			[
				'Thefirstsentence.'
			],
			{
				limit: 10,
				useDefaultFitFactor: true
			},
			[
				[
					'Thefirstse…',
					{ type: 'read-more' }
				]
			]
		)
	})

	it('should truncate at limit when when there\'re no ends of sentence or whitespace', () => {
		const content = [
			[
				'The firstsentence.'
			]
		]
		getPostPreviewTest(
			content,
			{
				limit: 5,
				useDefaultFitFactor: true
			},
			[
				[
					'The …',
					{ type: 'read-more' }
				]
			]
		)
	})

	it('should truncate on end of sentence mid-paragraph', () => {
		getPostPreviewTest(
			[
				[
					'The first sentence. The second sentence.'
				]
			],
			{
				limit: 24
			},
			[
				[
					'The first sentence.',
					{ type: 'read-more' }
				]
			]
		)
	})

	it('should truncate paragraphs at sentence end (exclamation mark)', () => {
		getPostPreviewTest(
			[
				[
					'The first sentence! The second sentence.'
				]
			],
			{
				limit: 24
			},
			[
				[
					'The first sentence!',
					{ type: 'read-more' }
				]
			]
		)
	})

	it('should truncate paragraphs at sentence end (question mark)', () => {
		getPostPreviewTest(
			[
				[
					'The first sentence? The second sentence.'
				]
			],
			{
				limit: 24
			},
			[
				[
					'The first sentence?',
					{ type: 'read-more' }
				]
			]
		)
	})

	it('should trim the preview', () => {
		getPostPreviewTest(
			[
				[
					'Text.',
					'\n',
					'\n',
					'\n',
					'\n'
				]
			],
			{
				limit: 50
			},
			[
				[
					'Text.'
				],
				{ type: 'read-more' }
			]
		)
	})

	it('should not trim mid-paragraph if there\'s enough text in a preview', () => {
		getPostPreviewTest(
			[
				[
					'The first sentence. Some text. More text. More text. More text. More text. More text. More text. More text. More text.',
					'\n',
					'The second sentence is a longer one. More text. More text. More text. More text. More text. More text. More text. More text.'
				]
			],
			{
				limit: 190
			},
			[
				[
					'The first sentence. Some text. More text. More text. More text. More text. More text. More text. More text. More text.',
				],
				{ type: 'read-more' }
			]
		)
	})

	it('should trim mid-line if there\'s not enough text in a preview', () => {
		getPostPreviewTest(
			[
				[
					'The first paragraph with a long line of text. The first paragraph with a long line of text.'
				],
				[
					'The second paragraph is a longer one. Is a longer one.'
				]
			],
			{
				limit: 200
			},
			[
				[
					'The first paragraph with a long line of text. The first paragraph with a long line of text.'
				],
				[
					'The second paragraph is a longer one.',
					{ type: 'read-more' }
				]
			]
		)
	})

	it('should not trim mid-paragraph if there\'s enough text in a preview', () => {
		getPostPreviewTest(
			[
				[
					'The first sentence. Some text. More text. More text. More text. More text. More text. More text. More text. More text.'
				],
				[
					'The second sentence is a longer one. Some text. More text. More text. More text. More text. More text. More text. More text.'
				]
			],
			{
				limit: 190
			},
			[
				[
					'The first sentence. Some text. More text. More text. More text. More text. More text. More text. More text. More text.'
				],
				{ type: 'read-more' }
			]
		)
	})

	it('should generate preview in case of embedded attachments', () => {
		getPostPreviewTest(
			{
				content: [
					{
						type: 'attachment',
						attachmentId: 1
					},
					[
						'The first paragraph.'
					],
					[
						'The second paragraph.'
					]
				],
				attachments: [{
					id: 1,
					type: 'picture'
				}]
			},
			{
				limit: 600
			},
			[
				{
					type: 'attachment',
					attachmentId: 1
				},
				[
					'The first paragraph.'
				],
				{ type: 'read-more' }
			]
		)
	})

	it('should trim mid-paragraph when there\'s not enough text (skip embedded attachments when counting text length)', () => {
		getPostPreviewTest(
			{
				content: [
					{
						type: 'attachment',
						attachmentId: 1
					},
					[
						'The first sentence. Some text. More text. More text. More text. More text. More text. More text. More text. More text.'
					]
				],
				attachments: [{
					id: 1,
					type: 'picture'
				}]
			},
			{
				limit: 600
			},
			[
				{
					type: 'attachment',
					attachmentId: 1
				},
				[
					'The first sentence. Some text. More text. More text.',
					{ type: 'read-more' }
				]
			]
		)
	})

	it('should trim at embedded attachments', () => {
		getPostPreviewTest(
			{
				content: [
					{
						type: 'attachment',
						attachmentId: 1
					},
					{
						type: 'attachment',
						attachmentId: 2
					},
					{
						type: 'attachment',
						attachmentId: 3
					},
					[
						'The first sentence.'
					]
				],
				attachments: [
					{
						id: 1,
						type: 'picture'
					},
					{
						id: 2,
						type: 'video'
					},
					{
						id: 3,
						type: 'picture'
					}
				]
			},
			{
				limit: 1200
			},
			[
				{
					type: 'attachment',
					attachmentId: 1
				},
				{
					type: 'attachment',
					attachmentId: 2
				},
				{ type: 'read-more' }
			]
		)
	})

	it('should generate a preview for a twitter attachment (not add "read-more" button)', () => {
		getPostPreviewTest(
			{
				content: [
					{
						"type": "attachment",
						"attachmentId": 1
					}
				],
				attachments: [
					{
						"type": "picture",
						"picture": {
							"type": "image/jpeg",
							"width": 625,
							"height": 625,
							"size": 66560,
							"url": "https://2ch.hk/v/src/6110466/16082780608970.jpg",
							"sizes": [
								{
									"type": "image/jpeg",
									"width": 250,
									"height": 250,
									"url": "https://2ch.hk/v/thumb/6110466/16082780608970s.jpg"
								}
							]
						}
					},
					{
						"id": 1,
						"type": "social",
						"social": {
							"provider": "Twitter",
							"id": "1339809601932439552",
							"url": "https://twitter.com/DedPerded1988/status/1339809601932439552",
							"content": "На плойке киберпанк убрали из магаза из-за мнимых технических проблем. Типа консолебомжам не понравились просадки фпс, типа ниже гигантских 30 падает, ахахаха. Ебать, этим долбаебам тогда стоит убрать из магазина вообще все игры, потому что они все работают как говно полнейшее.",
							"date": "2020-12-17T21:00:00.000Z",
							"author": {
								"name": "Илья Мэддисон",
								"id": "DedPerded1988",
								"url": "https://twitter.com/DedPerded1988"
							}
						}
					}
				]
			},
			{
				limit: 500
			},
			[
				{
					"type": "attachment",
					"attachmentId": 1
				}
			]
		)
	})

	it('should trim mid-paragraph when non-text parts are used too (and insert ellipsis inside those non-text parts)', () => {
		getPostPreviewTest(
			[
				[
					'Text ',
					{
						type: 'spoiler',
						content: 'spoilerrr text'
					},
					' text text text. Another text.'
				]
			],
			{
				limit: 15
			},
			[
				[
					'Text ',
					{
						type: 'spoiler',
						content: 'spoilerrr …'
					},
					{ type: 'read-more' }
				]
			]
		)
	})

	it('should not generate preview if rest content fits within threshold', () => {
		getPostPreviewTest(
			[
				[
					'Some long enough sentence so that it surpasses the limit but still fits within threshold.'
				]
			],
			{
				limit: 70,
				maxFitFactor: 1
			},
			[
				[
					'Some long enough sentence so that it surpasses the limit but still …',
					{ type: 'read-more' }
				]
			]
		)

		getPostPreviewTest(
			[
				[
					'Some long enough sentence so that it surpasses the limit but still fits within threshold.'
				]
			],
			{
				limit: 70,
				maxFitFactor: 1.3
			},
			undefined
		)

		getPostPreviewTest(
			[
				[
					'Some long enough sentence so that it surpasses the limit but still fits within 2x threshold.'
				]
			],
			{
				limit: 70,
				maxFitFactor: 1.2
			},
			undefined
		)

		getPostPreviewTest(
			[
				[
					'Some long enough sentence so that it surpasses the limit but still fits within threshold even with x2 fit factor.'
				]
			],
			{
				limit: 70,
				maxFitFactor: 1.2
			},
			[
				[
					'Some long enough sentence so that it surpasses the limit but still …',
					{ type: 'read-more' }
				]
			]
		)
	})

	it('should trim at sentence end', () => {
		getPostPreviewTest(
			[
				[
					"Анон, мне 23, живу с мамой, в универе не доучился, ни разу в жизни не работал. Понятное дело, что рано или поздно я буду вынужден обеспечивать себя самостоятельно. Но меня тянет блевать об одной мысле о работе, я не хочу быть рабом. Я скорее выпилюсь, чем буду хуярить за копейки до старости."
				],
				[
					"Лет с 16 я надеялся, что придумаю лёгкий способ подняться и никогда не буду работать. В прошлом году я пытался вкатиться в хакинг, чтобы взломать какую-нибудь криптобиржу. Но у меня ничего не вышло. Сейчас пытаюсь придумать какую-нибудь наёбку, но начал сомневаться что у меня получится."
				],
				[
					"Как вы смирились с тем, что в рабы?"
				]
			],
			{
				limit: 500,
				maxFitFactor: 1.2
			},
			[
				[
					"Анон, мне 23, живу с мамой, в универе не доучился, ни разу в жизни не работал. Понятное дело, что рано или поздно я буду вынужден обеспечивать себя самостоятельно. Но меня тянет блевать об одной мысле о работе, я не хочу быть рабом. Я скорее выпилюсь, чем буду хуярить за копейки до старости."
				],
				[
					"Лет с 16 я надеялся, что придумаю лёгкий способ подняться и никогда не буду работать.",
					{ type: 'read-more' }
				]
			]
		)
	})

	it('should compensate for short lines of text (inline level)', () => {
		getPostPreviewTest(
			[
				[
					"A1",
					"\n",
					"B2",
					"\n",
					"C3",
					"\n",
					"D4",
					"\n",
					"E5"
				]
			],
			{
				limit: 200,
				maxFitFactor: 1.2
			},
			[
				[
					"A1",
					"\n",
					"B2"
				],
				{ type: 'read-more' }
			]
		)
	})

	it('should compensate for short lines of text (paragraph level)', () => {
		getPostPreviewTest(
			[
				[
					"A1"
				],
				[
					"B2"
				],
				[
					"C3"
				],
				[
					"D4"
				],
				[
					"E5"
				]
			],
			{
				limit: 100,
				maxFitFactor: 1.2
			},
			[
				[
					"A1"
				],
				{ type: 'read-more' }
			]
		)
	})

	it('should add "read more" button in a new paragraph when trimming content at paragraph-level due to a fit factor', () => {
		getPostPreviewTest(
			[
				[
					{
						"type": "text",
						"style": "bold",
						"content": "Попаданца рулетка"
					}
				],
				[
					"Анон, ты попадаешь в опрелеленный год, определенное место и с определенными компаньонами. Все определяется роллом."
				],
				[
					"1513371488xyz"
				],
				[
					"х — ролл времени"
				],
				[
					"1 — 1935"
				],
				[
					"2 — 1905"
				],
				[
					"3 — 1915"
				],
				[
					"4 — 1850"
				],
				[
					"5 — 1530"
				],
				[
					"6 — 1700"
				],
				[
					"7 — 1900"
				],
				[
					"8 — 1337"
				],
				[
					"9 — 1870"
				],
				[
					"0 — 2007"
				]
			],
			{
				limit: 500,
				maxFitFactor: 1.2
			},
			[
				[
					{
						"type": "text",
						"style": "bold",
						"content": "Попаданца рулетка"
					}
				],
				[
					"Анон, ты попадаешь в опрелеленный год, определенное место и с определенными компаньонами. Все определяется роллом."
				],
				[
					"1513371488xyz"
				],
				[
					"х — ролл времени"
				],
				{ type: 'read-more' }
			]
		)
	})

	it('should trim at sentence end when fit factor is used', () => {
		getPostPreviewTest(
			[
				[
					{
						"type": "text",
						"style": "bold",
						"content": "НАРУГАЛА БАБА"
					}
				],
				[
					"Анон, я живу на первом, и сейчас, по своему обыкновению, стоял в трусах (на надо сказать, что дома я только в трусах хожу) и чесал живот, а живот у меня большой и волосатый. Ну вот стою чешу, смотрю на улицу, а там баба с коляской и не может че-то с ней сделать, застряла она в бордюре, ну я улыбаюсь своему, а она заметила это и стала орать, что мне надо выйти и помочь ей, а не в трусах стоять у окна, ну я охуел от такого и послал её на хуй, через форточку, а она стала еще больше ругаться, что я даже закрыл шторки и сейчас это пишу. Пару минут назад её муж спустился с 5 этажа и долбил мне в двери. Анон, какова вероятность дальнейшего конфликта? Этот питекантроп орал, что голову мне отвернет сквозь дверь, ну я не отвечал молча и затаился возле. ",
					{
						"type": "spoiler",
						"censored": true,
						"content": "Блядь"
					},
					", что за хуйня?"
				]
			],
			{
				limit: 500,
				maxFitFactor: 1.2
			},
			[
				[
					{
						"type": "text",
						"style": "bold",
						"content": "НАРУГАЛА БАБА"
					}
				],
				[
					"Анон, я живу на первом, и сейчас, по своему обыкновению, стоял в трусах (на надо сказать, что дома я только в трусах хожу) и чесал живот, а живот у меня большой и волосатый. Ну вот стою чешу, смотрю на улицу, а там баба с коляской и не может че-то с ней сделать, застряла она в бордюре, ну я улыбаюсь своему, а она заметила это и стала орать, что мне надо выйти и помочь ей, а не в трусах стоять у окна, ну я охуел от такого и послал её на хуй, через форточку, а она стала еще больше ругаться, что я даже закрыл шторки и сейчас это пишу.",
					{
						"type": "read-more"
					}
				]
			]
		)
	})

	it('should generate a preview for a long post-link quote', () => {
		getPostPreviewTest(
			[
				[
					{
						"type": "post-link",
						"content": [
							{
								"type": "quote",
								"content": "Происхождение Александра Сергеевича Пушкина идёт от разветвлённого нетитулованного дворянского рода Пушкиных, восходившего по генеалогической легенде к «мужу честну» Ратше."
							}
						]
					}
				]
			],
			{
				limit: 100,
				maxFitFactor: 1.2
			},
			[
				[
					{
						"type": "post-link",
						"content": [
							{
								"type": "quote",
								"content": "Происхождение Александра Сергеевича Пушкина идёт от разветвлённого нетитулованного дворянского рода …"
							}
						]
					},
					{
						"type": "read-more"
					}
				]
			]
		)
	})

	it('should generate a preview for long post-link quotes (multiple quotes for a post link)', () => {
		getPostPreviewTest(
			[
				[
					{
						"type": "post-link",
						"content": [
							{
								"type": "quote",
								"content": "Происхождение Александра Сергеевича Пушкина идёт от разветвлённого нетитулованного дворянского рода Пушкиных, восходившего по генеалогической легенде к «мужу честну» Ратше."
							},
							{
								"type": "quote",
								"content": "Пушкин неоднократно писал о своей родословной в стихах и прозе; он видел в своих предках образец истинной «аристократии», древнего рода, честно служившего отечеству, но не снискавшего благосклонности правителей и «гонимого»."
							}
						]
					}
				]
			],
			{
				limit: 200,
				maxFitFactor: 1.2
			},
			[
				[
					{
						"type": "post-link",
						"content": [
							{
								"type": "quote",
								"content": "Происхождение Александра Сергеевича Пушкина идёт от разветвлённого нетитулованного дворянского рода Пушкиных, восходившего по генеалогической легенде к «мужу честну» Ратше."
							}
						]
					},
					{
						"type": "read-more"
					}
				]
			]
		)
	})

	it('should skip auto-generated post-link block quotes (when `minimizeGeneratedPostLinkBlockQuotes: true`)', () => {
		getPostPreviewTest(
			[
				[
					{
						"type": "post-link",
						"content": [
							{
								"type": "quote",
								"block": true,
								"generated": true,
								"content": "Происхождение Александра Сергеевича Пушкина идёт от разветвлённого нетитулованного дворянского рода Пушкиных, восходившего по генеалогической легенде к «мужу честну» Ратше."
							}
						]
					},
					'\n',
					{
						"type": "post-link",
						"content": [
							{
								"type": "quote",
								"block": true,
								"generated": true,
								"content": "Пушкин неоднократно писал о своей родословной в стихах и прозе; он видел в своих предках образец истинной «аристократии», древнего рода, честно служившего отечеству, но не снискавшего благосклонности правителей и «гонимого»."
							}
						]
					}
				]
			],
			{
				limit: 200,
				maxFitFactor: 1.2,
				minimizeGeneratedPostLinkBlockQuotes: true
			},
			undefined
		)
	})
})