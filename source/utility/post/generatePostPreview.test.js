import generatePostPreview from './generatePostPreview'

import expectToEqual from '../expectToEqual'

function getPostPreviewTest(post, options, expected) {
	if (Array.isArray(post)) {
		post = {
			content: post
		}
	}
	// The default `fitFactor` is not 0 by default.
	if (options.fitFactor === undefined && !options.useDefaultFitFactor) {
		options.fitFactor = 0
	}
	expectToEqual(generatePostPreview(post.content, post.attachments, options), expected)
}

describe('getPostText', () => {
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
				fitFactor: 0
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
				fitFactor: 0.3
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
				fitFactor: 0.2
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
				fitFactor: 0.2
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
				fitFactor: 0.2
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
				fitFactor: 0.2
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
				fitFactor: 0.2
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
				fitFactor: 0.2
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
				fitFactor: 0.2
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
				fitFactor: 0.2
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
				fitFactor: 0.2
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
})