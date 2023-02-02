export default {
	name: 'wikipedia',
	services: [{
		domains: [
			'wikipedia.org',
			/^[a-z]+\.(m\.)?wikipedia\.org$/
		],
		getLinkTitle(url) {
			const wikiPageMatch = url.pathname.match(/^\/wiki\/(.+)/)
			if (wikiPageMatch) {
				// "%D0%A4%D0%BE%D1%82%D0%BE%D1%8D%D1%84%D1%84%D0%B5%D0%BA%D1%82" -> "Фотоэффект".
				return decodeURIComponent(wikiPageMatch[1].replace(/_/g, ' '))
			}
		}
	}]
}