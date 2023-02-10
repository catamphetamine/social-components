import expectToEqual from './expectToEqual.js'
import getHumanReadableLinkAddress from './getHumanReadableLinkAddress.js'

describe('getHumanReadableLinkAddress', () => {
	it('should get human-readable link address', () => {
		expectToEqual(
			getHumanReadableLinkAddress('http://youtube.org'),
			'youtube.org'
		)

		expectToEqual(
			getHumanReadableLinkAddress('https://youtube.org'),
			'youtube.org'
		)

		expectToEqual(
			getHumanReadableLinkAddress('https://www.youtube.org'),
			'youtube.org'
		)
	})

	it('should return the original URL when there\'s no human-readable form for it', function() {
		expectToEqual(
			getHumanReadableLinkAddress('https://www./'),
			'https://www./'
		)
	})
})