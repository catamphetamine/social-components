export default {
	name: 'github',
	services: [{
		domains: ['github.com'],
		getLinkTitle(url) {
			// Match repo URL.
			if (/^\/[^\/]+\/[^\/]+$/.test(url.pathname)) {
				return url.pathname.slice('/'.length)
			}
		}
	}]
}