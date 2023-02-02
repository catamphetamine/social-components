export default {
	name: 'telegram',
	services: [{
		domains: ['t.me'],
		getLinkTitle(url) {
			if (url.pathname.indexOf('/joinchat/') === 0) {
				const match = url.pathname.match(/^\/joinchat\/([^\/]+)/)
				if (match) {
					return match[1]
				}
			}
		}
	}, {
		domains: [
			'teleg.run',
			'tlg.wtf'
		]
	}]
}