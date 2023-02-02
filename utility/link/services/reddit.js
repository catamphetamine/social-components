export default {
	name: 'reddit',
	services: [{
		domains: [
			'reddit.com',
			'm.reddit.com'
		],
		getLinkTitle(url) {
			const match = url.pathname.match(/^\/([^\/]+)\/([^\/]+)\/?([^\/]+)?\/?([^\/]+)?\/?([^\/]+)?\/?([^\/]+)?$/)
			if (match) {
				if (match[1] === 'r') {
					if (!match[3]) {
						return `r/${match[2]}`
					}
					if (match[3] === 'comments') {
						const text = `r/${match[2]}/${match[5]}`
						if (match[6]) {
							return `${text}/${match[6]}`
						}
						return text
					}
					return url.pathname.slice('/'.length)
				}
				if (match[1] === 'user') {
					return `u/${match[2]}`
				}
			}
		}
	}]
}