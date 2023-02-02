export default {
	name: 'twitter',
	services: [{
		domains: ['twitter.com'],
		getLinkTitle(url) {
			const postMatch = url.pathname.match(/^\/(.+?)\/status\/(.+)$/)
			if (postMatch) {
				return `${postMatch[1]}/${postMatch[2]}`
			}
		}
	}]
}