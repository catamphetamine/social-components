import findLastSentenceEnd from './findLastSentenceEnd.js'

import expectToEqual from '../expectToEqual.js'

function test(input, expected) {
	expectToEqual(findLastSentenceEnd(input), expected)
}

describe('findLastSentenceEnd', () => {
	it('should detect sentence end if there\'s whitespace after sentence-end character', () => {
		test('A b c. D e f. G h', 12)
	})

	it('should detect sentence end if there\'s no whitespace after sentence-end character in the end of text', () => {
		test('A b c. D e f. G h.', 17)
	})

	it('shouldn\'t detect sentence end if there\'s whitespace after sentence-end character and it\'s not in the end of text', () => {
		test('A b c. D e f. G h i.J', 12)
	})

	it('should accept other sentence-end characters', () => {
		test('A b c. D e f! G h', 12)
		test('A b c. D e f? G h', 12)
		test('A b c. D e f… G h', 12)
	})

	it('should return -1 if sentence end not found', () => {
		test('A b c D e f G h i', -1)
	})

	it('should find last sentence end starting from index', () => {
		expectToEqual(findLastSentenceEnd('A b c. D e f. G h', 10), 5)
	})

	it('should not confuse shortenings with end of sentence', () => {
		expectToEqual(findLastSentenceEnd('Ab c.d. efg', 10), -1)
	})

	it('should accept start from index not fitting within text', () => {
		expectToEqual(findLastSentenceEnd('Abc.', 10), 3)
	})
})