import searchContent from './searchContent'

import expectToEqual from '../expectToEqual'

function searchContentTest(content, test, expected) {
	expectToEqual(searchContent(content, test), expected)
}

describe('searchContent', () => {
	it('should search in post content', () => {
		searchContentTest(
			[
				[
					'Abc'
				]
			],
			(text) => text === 'Abc',
			[0, 0]
		)
	})

	it('should search in post-link quote', () => {
		searchContentTest(
			[
				{
					"type": "post-link",
					"content": [
						{
							type: "quote",
							content: "Пушкин неоднократно писал о своей родословной в стихах и прозе; он видел в своих предках образец истинной «аристократии», древнего рода, честно служившего отечеству, но не снискавшего благосклонности правителей и «гонимого»."
						}
					]
				}
			],
			(text) => text.indexOf('Пушкин неоднократно писал') === 0,
			[0, 0]
		)
	})

	it('should search in post-link quote (inline content array)', () => {
		searchContentTest(
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
						}
					]
				}
			],
			(text) => text.indexOf('Александра Сергеевича Пушкина') === 0,
			[0, 0, 1]
		)
	})

	it('should search in post-link quotes', () => {
		searchContentTest(
			[
				{
					"type": "post-link",
					"content": [
						{
							type: "quote",
							content: "Происхождение Александра Сергеевича Пушкина идёт от разветвлённого нетитулованного дворянского рода Пушкиных, восходившего по генеалогической легенде к «мужу честну» Ратше."
						},
						'\n',
						{
							type: "quote",
							content: "Пушкин неоднократно писал о своей родословной в стихах и прозе; он видел в своих предках образец истинной «аристократии», древнего рода, честно служившего отечеству, но не снискавшего благосклонности правителей и «гонимого»."
						}
					]
				}
			],
			(text) => text.indexOf('Пушкин неоднократно писал') === 0,
			[0, 2]
		)
	})

	it('should search in post-link quotes (inline content array)', () => {
		searchContentTest(
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
			],
			(text) => text.indexOf('Александра Сергеевича Пушкина') === 0,
			[0, 0, 1]
		)
	})
})