export default {
	name: '2ch',
	services: [{
		domains: [
			'2ch.hk',
			'2ch.so',
			'2ch.pm',
			'2ch.yt',
			'2ch.wf',
			'2ch.re',
			'2ch.life'
		],
		getLinkTitle(url) {
			const matchBoard = !/\.html$/.test(url.pathname) && url.pathname.match(/^\/([^\/]+)$/)
			if (matchBoard) {
				return `/${matchBoard[1]}/`
			}
			const matchThread = url.pathname.match(/^\/(.+?)\/res\/(.+)\.html$/)
			if (matchThread) {
				return `/${matchThread[1]}/${matchThread[2]}`
			}
		}
	}]
}