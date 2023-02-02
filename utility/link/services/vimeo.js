export default {
	name: 'vimeo',
	services: [{
		domains: ['vimeo.com']
	}, {
		domains: ['player.vimeo.com'],
		getLinkTitle(url) {
			if (url.pathname.indexOf('/video/') === 0) {
				const match = url.pathname.match(/^\/video\/([^\/]+)/)
				if (match) {
					return match[1]
				}
			}
		}
	}]
}