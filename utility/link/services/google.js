export default {
	name: 'google',
	services: [{
		domains: [
			'google.com',
			'google.ru',
			'google.de',
			'google.fr',
			'google.it'
		],
		getLinkTitle(url, { parseLink }) {
			if (url.pathname === '/search') {
				if (url.searchParams.get('q')) {
					return url.searchParams.get('q')
				}
				if (url.searchParams.get('tbs') && url.searchParams.get('tbs').indexOf('sbi:') === 0) {
					return '(search by image)'
				}
			}
			// Special case for links from Google search results:
			// `https://google.com/url?url=https://another.site.com` → `https://another.site.com`.
			else if (url.pathname === '/url') {
				if (url.searchParams.get('url')) {
					return parseLink(url.searchParams.get('url'))
				}
			}
			else {
				const coordinatesMatch = url.pathname.match(/^\/maps\/([^\/]+)/)
				if (coordinatesMatch) {
					return `maps/${coordinatesMatch[1]}`
				}
			}
		}
	}, {
		domains: ['drive.google.com'],
		getLinkTitle(url) {
			if (url.pathname === '/open') {
				if (url.searchParams.get('id')) {
					return 'drive/' + url.searchParams.get('id')
				}
			}
			return url.host + url.pathname + url.search + url.hash
		}
	}, {
		domains: ['docs.google.com'],
		getLinkTitle(url) {
			const documentMatch = url.pathname.match(/^\/(spreadsheets|document)\/d\/(.+)$/)
			if (documentMatch) {
				let [_, documentType, documentPath] = documentMatch
				const postfixMatch = documentPath.match(/\/(edit|pub)$/)
				if (postfixMatch) {
					documentPath = documentPath.slice(0, -1 * postfixMatch[0].length)
				}
				return `${documentType}/${documentPath}`
			}
		}
	}]
}