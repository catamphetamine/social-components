import { canGeneratePostQuoteIgnoringNestedPostQuotes } from './generatePostQuote'

describe('canGeneratePostQuoteIgnoringNestedPostQuotes', () => {
	it('should tell that can generate post quote ignoring nested post quotes when there\'re inline post links but the limit doesn\'t reach it', () => {
		const content = [
			[
				'A text with an ',
				{
					type: 'post-link',
					content: [{
						type: 'quote',
						content: 'inline post link'
					}]
				}
			]
		]
		canGeneratePostQuoteIgnoringNestedPostQuotes({ content }, {
			maxLength: 10,
			fitFactor: 0
		}).should.equal(true)
	})

	it('should tell that can\'t generate post quote ignoring nested post quotes when there\'re inline post links', () => {
		const content = [
			[
				'A text with an ',
				{
					type: 'post-link',
					content: [{
						type: 'quote',
						content: 'inline post link'
					}]
				}
			]
		]
		canGeneratePostQuoteIgnoringNestedPostQuotes({ content }, {
			maxLength: 20,
			fitFactor: 0
		}).should.equal(false)
	})

	it('should tell that can generate post quote ignoring nested post quotes when there\'re block post links and no inline post links', () => {
		const content = [
			[
				'A text with an ',
				{
					type: 'post-link',
					_block: true,
					content: '<p>Not yet parsed</p>'
				}
			]
		]
		canGeneratePostQuoteIgnoringNestedPostQuotes({ content }, {
			maxLength: 20,
			fitFactor: 0
		}).should.equal(true)
	})
})