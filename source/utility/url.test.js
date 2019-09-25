import { getDomainName } from './url'

import expectToEqual from './expectToEqual'

describe('url', () => {
	it('should get domain from URL (no www, http)', () => {
		expectToEqual(
			getDomainName('http://google.com/ru/maps?x=y'),
			'google.com'
		)
	})

	it('should get domain from URL (www, https)', () => {
		expectToEqual(
			getDomainName('https://www.yandex.ru/maps?x=y'),
			'yandex.ru'
		)
	})
})