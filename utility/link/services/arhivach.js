export default {
	name: 'arhivach',
	services: [{
		domains: [
			'archivach.org',
			'arhivach.cf',
			'arhivach.ng'
		],
		getLinkTitle(url) {
			if (url.pathname.indexOf('/thread/') === 0) {
				const match = url.pathname.match(/^\/thread\/([^\/]+)/)
				if (match) {
					return match[1]
				}
			}
			if (url.searchParams.get('tags')) {
				return url.searchParams.get('tags')
			}
		}
	}]
}