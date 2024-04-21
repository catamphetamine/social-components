import expectToEqual from '../expectToEqual.js'

import compileWordPatterns from './compileWordPatterns.js'

describe('compileWordPatterns', () => {
	it('should expand ^ and $ and .', () => {
		const filters = compileWordPatterns(['^a.b$'], 'en')
		expectToEqual(filters.length, 4)

		expectFilterToEqual(filters.pop(), {
			includesWordStart: true,
			includesWordEnd: true,
			regexp: '/[^a-z]a[a-z]b[^a-z]/i'
		})

		expectFilterToEqual(filters.pop(), {
			includesWordStart: true,
			includesWordEnd: false,
			regexp: '/[^a-z]a[a-z]b$/i'
		})

		expectFilterToEqual(filters.pop(), {
			includesWordStart: false,
			includesWordEnd: true,
			regexp: '/^a[a-z]b[^a-z]/i'
		})

		expectFilterToEqual(filters.pop(), {
			includesWordStart: false,
			includesWordEnd: false,
			regexp: '/^a[a-z]b$/i'
		})
	})
})

function expectFilterToEqual(filter, expected) {
	expectToEqual(filter.includesWordStart, expected.includesWordStart)
	expectToEqual(filter.includesWordEnd, expected.includesWordEnd)
	expectToEqual(filter.regexp.toString(), expected.regexp)
}