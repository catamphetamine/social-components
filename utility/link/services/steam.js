export default {
	name: 'steam',
	services: [{
		domains: ['store.steampowered.com'],
		getLinkTitle(url) {
			const gameMatch = url.pathname.match(/^\/app\/\d+\/([^\/]+)/)
			if (gameMatch) {
				return gameMatch[1].replace(/_+/g, ' ')
			}
			if (url.searchParams.get('appids')) {
				return `${url.searchParams.get('appids')}${url.pathname}`
			}
		}
	}, {
		domains: ['steamcommunity.com'],
		getLinkTitle(url) {
			const idPageMatch = url.pathname.match(/^\/id\/([^\/]+)/)
			if (idPageMatch) {
				return idPageMatch[1]
			}
			const profilePageMatch = url.pathname.match(/^\/profiles\/./)
			if (profilePageMatch) {
				return url.pathname.slice('/profiles/'.length)
			}
		}
	}]
}