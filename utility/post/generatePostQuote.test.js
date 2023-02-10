import generatePostQuote, { canGeneratePostQuoteIgnoringNestedPostQuotes } from './generatePostQuote.js'

const messages = {
	textContent: {
		block: {
			picture: 'Picture'
		}
	}
}

describe('generatePostQuote', () => {
	it('should generate post quote prepending title', () => {
		generatePostQuote({
			title: 'Title',
			content: 'Content'
		}, { maxLength: 100 }).should.equal('Title\nContent')
	})

	it('should generate post quote using just title when there\'s no text', () => {
		generatePostQuote({
			title: 'Title'
		}, { maxLength: 100 }).should.equal('Title')
	})

	it('should generate post quote with just the text when there\'s no title', () => {
		generatePostQuote({
			content: 'Content'
		}, { maxLength: 100 }).should.equal('Content')
	})

	it('should generate post quote with untitled image embedded (embedded attachment)', () => {
		let attachment
		generatePostQuote({
			content: [{
				type: 'attachment',
				attachmentId: 1
			}],
			attachments: [{
				id: 1,
				type: 'picture',
				picture: {}
			}]
		}, {
			maxLength: 100,
			messages,
			onUntitledAttachment: _ => attachment = _
		}).should.equal('Picture')
		attachment.id.should.equal(1)
	})

	it('should generate post quote with untitled image embedded (non-embedded attachment)', () => {
		let attachment
		generatePostQuote({
			attachments: [{
				id: 1,
				type: 'picture',
				picture: {}
			}]
		}, {
			maxLength: 100,
			messages,
			onUntitledAttachment: _ => attachment = _
		}).should.equal('Picture')
		attachment.id.should.equal(1)
	})
})

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
			maxLength: 10
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
			maxLength: 20
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
			maxLength: 20
		}).should.equal(true)
	})
})