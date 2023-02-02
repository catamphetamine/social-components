export default {
	name: '4chan',
	services: [{
		domains: ['boards.4channel.org', 'boards.4chan.org'],
		getLinkTitle(url) {
			const matchBoard = url.pathname.match(/^\/([^\/]+)$/)
			if (matchBoard) {
				return `/${matchBoard[1]}/`
			}
			const matchThread = url.pathname.match(/^\/(.+?)\/thread\/(.+)$/)
			if (matchThread) {
				return `/${matchThread[1]}/${matchThread[2]}`
			}
		}
	}, {
		domains: ['4chan.org']
	}]
}