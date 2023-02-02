export default {
	name: 'youtube',
	services: [{
		domains: [
			'youtube.com',
			'm.youtube.com',
			'youtu.be'
		],
		getLinkTitle(url) {
			if (url.pathname === '/watch' && url.searchParams.get('v')) {
				return url.searchParams.get('v')
			}
			if (url.pathname.indexOf('/user/') === 0) {
				const match = url.pathname.match(/^\/user\/(.+)/)
				if (match) {
					return match[1].replace(/\/videos$/, '')
				}
			}
			if (url.pathname.indexOf('/channel/') === 0) {
				const match = url.pathname.match(/^\/channel\/(.+)/)
				if (match) {
					return match[1].replace(/\/videos$/, '')
				}
			}
			if (url.pathname.indexOf('/c/') === 0) {
				const match = url.pathname.match(/^\/c\/(.+)/)
				if (match) {
					// Sometimes people post `https://youtube.com/c/username`
					// instead of `https://youtube.com/username`.
					return decodeURI(match[1].replace(/\/videos$/, ''))
				}
			}
			if (url.pathname === '/playlist' && url.searchParams.get('list')) {
				return `playlist/${url.searchParams.get('list')}`
			}
		}
	}]
}