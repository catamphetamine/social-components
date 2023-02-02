export default {
	name: 'gitlab',
	services: [{
		domains: ['gitlab.com'],
		getLinkTitle(url) {
			// Match repo URL.
			if (/^\/[^\/]+\/[^\/]+$/.test(url.pathname)) {
				return url.pathname.slice('/'.length)
			}
		}
	}]
}