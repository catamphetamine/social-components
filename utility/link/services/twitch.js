export default {
	name: 'twitch',
	services: [{
		domains: ['twitch.tv'],
		getLinkTitle(url) {
			// Match `/videos/{id}` URL.
			if (/^\/videos\/[^\/]+$/.test(url.pathname)) {
				return url.pathname.slice('/'.length)
			}
			// Match `/{username}/videos` URL.
			if (/^\/[^\/]+\/videos$/.test(url.pathname)) {
				return url.pathname.slice('/'.length)
			}
		}
	}]
}