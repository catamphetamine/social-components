import parseUrl from './parseUrl.js'

describe('parseUrl', function() {
	it('should parse URLs', function() {
		parseUrl('https://some-example.com.org/path?a=b#c').should.deep.equal({
			scheme: 'https',
			domain: 'some-example.com.org',
			path: '/path'
		})
	})

	it('should parse URLs with no path', function() {
		parseUrl('https://example.com?a=b#c').should.deep.equal({
			scheme: 'https',
			domain: 'example.com',
			path: '/'
		})
	})

	it('should parse URLs with no path or query', function() {
		parseUrl('https://example.com#c').should.deep.equal({
			scheme: 'https',
			domain: 'example.com',
			path: '/'
		})
	})

	it('should parse URLs with no path or query or hash', function() {
		parseUrl('https://example.com').should.deep.equal({
			scheme: 'https',
			domain: 'example.com',
			path: '/'
		})
	})

	it('should parse URLs with a port number', function() {
		parseUrl('https://example.com:8080/path?a=b#c').should.deep.equal({
			scheme: 'https',
			domain: 'example.com',
			path: '/path'
		})
	})

	it('should parse URLs with no scheme', function() {
		parseUrl('//example.com/path?a=b#c').should.deep.equal({
			scheme: undefined,
			domain: 'example.com',
			path: '/path'
		})
	})

	it('should parse relative URLs', function() {
		parseUrl('/path?a=b#c').should.deep.equal({
			scheme: undefined,
			domain: undefined,
			path: '/path'
		})
	})

	it('should parse relative URLs with no path', function() {
		parseUrl('?a=b#c').should.deep.equal({
			scheme: undefined,
			domain: undefined,
			path: '/'
		})
	})

	it('should parse relative URLs with no path or query', function() {
		parseUrl('?#c').should.deep.equal({
			scheme: undefined,
			domain: undefined,
			path: '/'
		})
	})

	it('should parse relative URLs with no path or query or hash', function() {
		parseUrl('?#').should.deep.equal({
			scheme: undefined,
			domain: undefined,
			path: '/'
		})
	})
})