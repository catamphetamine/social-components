import expectToEqual from '../expectToEqual.js'
import trimInlineContent from './trimInlineContent.js'

function trimInlineContentTest(content, options, result) {
	// `content` internals will be mutated.
	content = trimInlineContent(content, options)
	return expectToEqual(content, result)
}

describe('trimInlineContent', () => {
	it('should trim inline content', () => {
		trimInlineContentTest(
			['\n', ' ', ' Abc ', ' ', '\n'],
			{ left: false, right: false },
			['\n', ' ', ' Abc ', ' ', '\n']
		)

		trimInlineContentTest(
			['\n', ' ', ' Abc ', ' ', '\n'],
			{ left: false },
			['\n', ' ', ' Abc']
		)

		trimInlineContentTest(
			['\n', ' ', ' Abc ', ' ', '\n'],
			{ right: false },
			['Abc ', ' ', '\n']
		)

		trimInlineContentTest(
			['\n', ' ', ' Abc ', ' ', '\n'],
			{},
			['Abc']
		)
	})
})

