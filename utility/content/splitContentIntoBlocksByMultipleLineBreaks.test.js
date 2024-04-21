import splitContentIntoBlocksByMultipleLineBreaks from './splitContentIntoBlocksByMultipleLineBreaks.js'

describe('splitContentIntoBlocksByMultipleLineBreaks', () => {
	it('shouldn\'t split paragraphs if there\'s no split', () => {
		splitContentIntoBlocksByMultipleLineBreaksTest(
			[
				[
					'abc',
					'def'
				]
			],
			[
				[
					'abc',
					'def'
				]
			]
		)
	})

	it('should skip empty paragraphs when splitting paragraphs (simple text)', () => {
		splitContentIntoBlocksByMultipleLineBreaksTest(
			[
				[
					'abc',
					'\n',
					'\n',
					'\n',
					'\n',
					'\n',
					'\n',
					'\n',
					'\n',
					'\n',
					'def'
				]
			],
			[
				[
					'abc'
				],
				[
					'def'
				]
			]
		)
	})

	it('should skip empty paragraphs when splitting paragraphs (simple text, empty paragraphs removed)', () => {
		splitContentIntoBlocksByMultipleLineBreaksTest(
			[
				[
					"Abc.\n",
					"\n",
					"\n",
					"\n",
					"\nDef.\n",
					"\n",
					"\n",
					"\n",
					"\n"
				]
			],
			[
				[
					'Abc.\n'
				],
				[
					"\nDef.\n"
				]
			]
		)
	})

	it('should trim empty paragraphs', () => {
		splitContentIntoBlocksByMultipleLineBreaksTest(
			[
				[
					'abc',
					'\n',
					'\n'
				]
			],
			[
				[
					'abc'
				]
			]
		)
	})

	it('should trim empty paragraphs', () => {
		splitContentIntoBlocksByMultipleLineBreaksTest(
			[
				[
					'\n',
					'\n',
					'abc'
				]
			],
			[
				[
					'abc'
				]
			]
		)
	})

	it('should trim multiple empty lines at the start', () => {
		splitContentIntoBlocksByMultipleLineBreaksTest(
			[
				[
					'\n',
					'\n',
					'\n',
					'abc'
				]
			],
			[
				[
					'abc'
				]
			]
		)
	})

	it('should not trim single empty line at the start', () => {
		splitContentIntoBlocksByMultipleLineBreaksTest(
			[
				[
					'\n',
					'abc'
				]
			],
			[
				[
					'\n',
					'abc'
				]
			]
		)
	})

	it('should split paragraphs when <br>s are separated with spaces', () => {
		splitContentIntoBlocksByMultipleLineBreaksTest(
			[
				[
					'abc',
					'\n',
					' ',
					' ',
					'\n',
					'def'
				]
			],
			[
				[
					'abc'
				],
				[
					'def'
				]
			]
		)
	})

	it('should split paragraphs (nested blocks)', () => {
		splitContentIntoBlocksByMultipleLineBreaksTest(
			[
				[
					'abc',
					{
						type: 'text',
						style: 'bold',
						content: [
							'def',
							{
								type: 'text',
								style: 'italic',
								content: [
									'ghi',
									'\n',
									'\n',
									'\n',
									'jkl'
								]
							},
							{
								type: 'text',
								style: 'italic',
								content: [
									'mno'
								]
							}
						]
					},
					'pqr'
				]
			],
			[
				[
					'abc',
					{
						type: 'text',
						style: 'bold',
						content: [
							'def',
							{
								type: 'text',
								style: 'italic',
								content: 'ghi'
							}
						]
					}
				],
				[
					{
						type: 'text',
						style: 'bold',
						content: [
							{
								type: 'text',
								style: 'italic',
								content: 'jkl'
							},
							{
								type: 'text',
								style: 'italic',
								content: [
									'mno'
								]
							}
						]
					},
					'pqr'
				]
			]
		)
	})
})

function splitContentIntoBlocksByMultipleLineBreaksTest(content, result) {
	return expectToEqual(splitContentIntoBlocksByMultipleLineBreaks(content), result)
}

function expectToEqual(a, b) {
	return expect(a).to.deep.equal(b)
}