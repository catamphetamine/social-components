import expectToEqual from '../expectToEqual.js'
import trimContent from './trimContent.js'

function trimContentTest(content, result) {
	// `content` internals will be mutated.
	content = trimContent(content)
	return expectToEqual(content, result)
}

describe('trimContent', () => {
	it('should trim new lines (simple text)', () => {
		trimContentTest(
			[
				[
					'\n',
					'\n',
					'\n',
					'abc',
					'\n',
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

	it('should trim new lines and whitespace (simple text)', () => {
		trimContentTest(
			[
				[
					'\n',
					' ',
					'\n',
					'   ',
					'\n',
					' abc ',
					'\n',
					'\t',
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

	it('should trim new lines (nested blocks)', () => {
		trimContentTest(
			[
				[
					'\n',
					{
						type: 'text',
						style: 'bold',
						content: [
							'\n',
							'\n',
							{
								type: 'text',
								style: 'italic',
								content: [
									'\n',
									'abc',
									'\n',
									'\n',
									'def',
									'\n'
								]
							},
							'\n'
						]
					},
					'\n',
					'\n'
				]
			],
			[
				[
					{
						type: 'text',
						style: 'bold',
						content: [
							{
								type: 'text',
								style: 'italic',
								content: [
									'abc',
									'\n',
									'\n',
									'def'
								]
							}
						]
					}
				]
			]
		)
	})

	it('should trim new lines (nested blocks + trailing content)', () => {
		trimContentTest(
			[
				[
					'\n',
					{
						type: 'text',
						style: 'bold',
						content: [
							'\n',
							'\n',
							{
								type: 'text',
								style: 'italic',
								content: [
									'\n',
									'abc',
									'\n',
									'\n',
									'def',
									'\n'
								]
							},
							'\n'
						]
					},
					'\n',
					'ghi',
					'\n'
				]
			],
			[
				[
					{
						type: 'text',
						style: 'bold',
						content: [
							{
								type: 'text',
								style: 'italic',
								content: [
									'abc',
									'\n',
									'\n',
									'def',
									'\n'
								]
							},
							'\n'
						]
					},
					'\n',
					'ghi'
				]
			]
		)
	})
})

