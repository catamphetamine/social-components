import getMimeType from './getMimeType'

import expectToEqual from './expectToEqual'

describe('getMimeType', () => {
	it('should get MIME type from filename', () => {
		expectToEqual(
			getMimeType('picture.gif'),
			'image/gif'
		)
	})
	it('should get MIME type from "ext"', () => {
		expectToEqual(
			getMimeType('.webm'),
			'video/webm'
		)
	})
	it('should get MIME type from URL', () => {
		expectToEqual(
			getMimeType('https://google.ru/pic.png'),
			'image/png'
		)
	})
	it('should get MIME type from URL with parameters', () => {
		expectToEqual(
			getMimeType('https://google.ru/pic.png?q=abc'),
			'image/png'
		)
	})
})