import getInlineContentText from './getInlineContentText.js'

import expectToEqual from '../expectToEqual.js'

function getInlineContentTextTest(post, options, text) {
	if (text === undefined) {
		text = options
		options = {}
	}
	expectToEqual(getInlineContentText(post, options), text)
}

describe('getInlineContentText', () => {
	it('should get inline content text', () => {
		getInlineContentTextTest(
			'Abc',
			'Abc'
		)

		getInlineContentTextTest(
			['Abc'],
			'Abc'
		)

		getInlineContentTextTest(
			['Abc', 'Def'],
			'AbcDef'
		)

		getInlineContentTextTest(
			['Abc', '\n', 'Def'],
			'Abc\nDef'
		)

		getInlineContentTextTest(
			['Abc', { type: 'spoiler', censored: true, content: 'cock' }, 'Def'],
			'Abc░​░​░​░​Def'
		)
	})
})