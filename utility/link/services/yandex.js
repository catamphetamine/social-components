export default {
	name: 'yandex',
	services: [{
		domains: [
			'yandex.ru',
			'yandex.com',
			'yandex.com.tr',
			'yandex.kz',
			'yandex.by',
			'yandex.uz'
		],
		getLinkTitle(url) {
			// Yandex adds a trailing slash to the path for some weird reason.
			if (url.pathname === '/search' || url.pathname === '/search/') {
				if (url.searchParams.get('text')) {
					return url.searchParams.get('text')
				}
			}
			const coordinatesMatch = url.pathname.match(/^\/maps\/([^\/]+)/)
			if (coordinatesMatch) {
				return `maps/${url.searchParams.get('ll')}`
			}
		}
	}, {
		domains: [
			'market.yandex.ru',
			'market.yandex.kz',
			'market.yandex.by'
		],
		getLinkTitle(url) {
			const productMatch = url.pathname.match(/^\/product--([^\/]+)/)
			if (productMatch) {
				return `market/${productMatch[1]}`
			}
		}
	}]
}