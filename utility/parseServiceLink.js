const WWW_REGEXP = /^www\./
const WIKIPEDIA_REGEXP = /^[a-z]+\.(m\.)?wikipedia\.org$/
// const SUBDOMAIN_REGEXP = /^[^.]+\.wikipedia\.org$/
const ABSOLUTE_URL_REGEXP = /^(https?|ftp):/
const SINGLE_PATH_ELEMENT = /^\/[^\/]+$/

/**
 * Parses popular service links.
 * @param  {string} url
 * @return {object} [result] `{ service: string, text: string }`
 */
export default function parseServiceLink(url) {
	if (!ABSOLUTE_URL_REGEXP.test(url)) {
		return
	}
	// Remove `/` in the end.
	url = url.replace(/\/$/, '')
	// Remove `/` before `?`.
	const urlQueryStartIndex = url.indexOf('?')
	if (urlQueryStartIndex > 0) {
		if (url[urlQueryStartIndex - 1] === '/') {
			url = url.slice(0, urlQueryStartIndex - 1) + url.slice(urlQueryStartIndex)
		}
	}
	// Remove `/` before `#`.
	const urlHashStartIndex = url.indexOf('#')
	if (urlHashStartIndex > 0) {
		if (url[urlHashStartIndex - 1] === '/') {
			url = url.slice(0, urlHashStartIndex - 1) + url.slice(urlHashStartIndex)
		}
	}
	// Fix same protocol links.
	if (url[0] === '/' && url[1] === '/') {
		url = getProtocol() + url
	}
	// `URL` is not available in IE11.
	try {
		url = new URL(url)
	} catch (error) {
		// Can throw "Invalid URL".
		console.error(`Incorrect URL: ${url}`)
		if (error.message.indexOf('Invalid URL') < 0) {
			console.error(error)
		}
		return
	}
	// Remove `www.` in the beginning.
	let hostname = url.hostname.replace(WWW_REGEXP, '')
	if (WIKIPEDIA_REGEXP.test(hostname)) {
		hostname = 'wikipedia.org'
	}
	// Special case for links from Google search results.
	if (hostname === 'google.com') {
		if (url.pathname === '/url' && url.searchParams.get('url')) {
			return parseServiceLink(url.searchParams.get('url'))
		}
	}
	const service = SERVICES[hostname]
	if (service) {
		return {
			service: service.name,
			text: (service.getText && service.getText(url)) ||
				(SINGLE_PATH_ELEMENT.test(url.pathname) && decodeURI(url.pathname.slice('/'.length))) ||
				decodeURI(url.pathname + url.search + url.hash) ||
				hostname
		}
	}
}

const SERVICES = {
	'vimeo.com': {
		name: 'vimeo'
	},
	'player.vimeo.com': {
		name: 'vimeo',
		getText(url) {
			if (url.pathname.indexOf('/video/') === 0) {
				const match = url.pathname.match(/^\/video\/([^\/]+)/)
				if (match) {
					return match[1]
				}
			}
		}
	},
	'youtube.com': {
		name: 'youtube',
		getText(url) {
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
	},
	'youtu.be': {
		name: 'youtube'
	},
	'github.com': {
		name: 'github',
		getText(url) {
			// Match repo URL.
			if (/^\/[^\/]+\/[^\/]+$/.test(url.pathname)) {
				return url.pathname.slice('/'.length)
			}
		}
	},
	'gitlab.com': {
		name: 'gitlab',
		getText(url) {
			// Match repo URL.
			if (/^\/[^\/]+\/[^\/]+$/.test(url.pathname)) {
				return url.pathname.slice('/'.length)
			}
		}
	},
	'twitter.com': {
		name: 'twitter',
		getText(url) {
			const postMatch = url.pathname.match(/^\/(.+?)\/status\/(.+)$/)
			if (postMatch) {
				return `${postMatch[1]}/${postMatch[2]}`
			}
		}
	},
	'docs.google.com': {
		name: 'google',
		getText(url) {
			const documentMatch = url.pathname.match(/^\/(spreadsheets|document)\/d\/(.+)$/)
			if (documentMatch) {
				let [_, documentType, documentPath] = documentMatch
				const postfixMatch = documentPath.match(/\/(edit|pub)$/)
				if (postfixMatch) {
					documentPath = documentPath.slice(0, -1 * postfixMatch[0].length)
				}
				return `${documentType}/${documentPath}`
			}
		}
	},
	'google.com': {
		name: 'google',
		getText(url) {
			if (url.pathname === '/search') {
				if (url.searchParams.get('q')) {
					return url.searchParams.get('q')
				}
				if (url.searchParams.get('tbs') && url.searchParams.get('tbs').indexOf('sbi:') === 0) {
					return '(search by image)'
				}
			}
			const coordinatesMatch = url.pathname.match(/^\/maps\/([^\/]+)/)
			if (coordinatesMatch) {
				return `maps/${coordinatesMatch[1]}`
			}
		}
	},
	'drive.google.com': {
		name: 'google',
		getText(url) {
			if (url.pathname === '/open') {
				if (url.searchParams.get('id')) {
					return 'drive/' + url.searchParams.get('id')
				}
			}
			return url.host + url.pathname + url.search + url.hash
		}
	},
	'yandex.ru': {
		name: 'yandex',
		getText(url) {
			// Yandex adds a trailing slash to the path for some weird reason.
			if (url.pathname === '/search' || url.pathname === '/search/') {
				if (url.searchParams.get('text')) {
					return url.searchParams.get('text')
				}
			}
			const coordinatesMatch = url.pathname.match(/^\/maps\/([^\/]+)/)
			if (coordinatesMatch) {
				return `maps/${url.searchParams.get('ll')}`
			}
		}
	},
	'market.yandex.ru': {
		name: 'yandex',
		getText(url) {
			const productMatch = url.pathname.match(/^\/product--([^\/]+)/)
			if (productMatch) {
				return `market/${productMatch[1]}`
			}
		}
	},
	'twitch.tv': {
		name: 'twitch',
		getText(url) {
			// Match `/videos/{id}` URL.
			if (/^\/videos\/[^\/]+$/.test(url.pathname)) {
				return url.pathname.slice('/'.length)
			}
			// Match `/{username}/videos` URL.
			if (/^\/[^\/]+\/videos$/.test(url.pathname)) {
				return url.pathname.slice('/'.length)
			}
		}
	},
	'store.steampowered.com': {
		name: 'steam',
		getText(url) {
			const gameMatch = url.pathname.match(/^\/app\/\d+\/([^\/]+)/)
			if (gameMatch) {
				return gameMatch[1].replace(/_+/g, ' ')
			}
			if (url.searchParams.get('appids')) {
				return `${url.searchParams.get('appids')}${url.pathname}`
			}
		}
	},
	'steamcommunity.com': {
		name: 'steam',
		getText(url) {
			const idPageMatch = url.pathname.match(/^\/id\/([^\/]+)/)
			if (idPageMatch) {
				return idPageMatch[1]
			}
			const profilePageMatch = url.pathname.match(/^\/profiles\/./)
			if (profilePageMatch) {
				return url.pathname.slice('/profiles/'.length)
			}
		}
	},
	'instagram.com': {
		name: 'instagram'
	},
	'discord.gg': {
		name: 'discord'
	},
	'vk.com': {
		name: 'vk',
		getText(url) {
			if (SINGLE_PATH_ELEMENT.test(url.pathname)) {
				return url.pathname.slice('/'.length).replace(/^id/, '')
			}
		}
	},
	'facebook.com': {
		name: 'facebook',
		getText(url) {
			if (url.pathname === '/profile.php' && url.searchParams.get('id')) {
				return url.searchParams.get('id')
			}
			const peopleMatch = url.pathname.match(/^\/people\/(.+?)\//)
			if (peopleMatch) {
				return peopleMatch[1]
			}
		}
	},
	'wikipedia.org': {
		name: 'wikipedia',
		getText(url) {
			const wikiPageMatch = url.pathname.match(/^\/wiki\/(.+)/)
			if (wikiPageMatch) {
				// "%D0%A4%D0%BE%D1%82%D0%BE%D1%8D%D1%84%D1%84%D0%B5%D0%BA%D1%82" -> "Фотоэффект".
				return decodeURIComponent(wikiPageMatch[1].replace(/_/g, ' '))
			}
		}
	},
	't.me': {
		name: 'telegram',
		getText(url) {
			if (url.pathname.indexOf('/joinchat/') === 0) {
				const match = url.pathname.match(/^\/joinchat\/([^\/]+)/)
				if (match) {
					return match[1]
				}
			}
		}
	},
	'teleg.run': {
		name: 'telegram'
	},
	'tlg.wtf': {
		name: 'telegram'
	},
	'archivach.org': {
		name: 'arhivach',
		getText(url) {
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
	},
	'2ch.hk': {
		name: '2ch',
		getText(url) {
			const matchBoard = !HTML_PAGE_REGEXP.test(url.pathname) && url.pathname.match(/^\/([^\/]+)$/)
			if (matchBoard) {
				return `/${matchBoard[1]}/`
			}
			const matchThread = url.pathname.match(/^\/(.+?)\/res\/(.+)\.html$/)
			if (matchThread) {
				return `/${matchThread[1]}/${matchThread[2]}`
			}
		}
	},
	'4chan.org': {
		name: '4chan'
	},
	'boards.4chan.org': {
		name: '4chan',
		getText(url) {
			const matchBoard = url.pathname.match(/^\/([^\/]+)$/)
			if (matchBoard) {
				return `/${matchBoard[1]}/`
			}
			const matchThread = url.pathname.match(/^\/(.+?)\/thread\/(.+)$/)
			if (matchThread) {
				return `/${matchThread[1]}/${matchThread[2]}`
			}
		}
	},
	'reddit.com': {
		name: 'reddit',
		getText(url) {
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
	}
}

SERVICES['google.ru'] = SERVICES['google.com']
SERVICES['google.de'] = SERVICES['google.com']
SERVICES['google.fr'] = SERVICES['google.com']
SERVICES['google.it'] = SERVICES['google.com']
SERVICES['2ch.so'] = SERVICES['2ch.hk']
SERVICES['2ch.pm'] = SERVICES['2ch.hk']
SERVICES['2ch.yt'] = SERVICES['2ch.hk']
SERVICES['2ch.wf'] = SERVICES['2ch.hk']
SERVICES['2ch.re'] = SERVICES['2ch.hk']
SERVICES['boards.4channel.org'] = SERVICES['boards.4chan.org']
SERVICES['m.youtube.com'] = SERVICES['youtube.com']
SERVICES['m.reddit.com'] = SERVICES['reddit.com']
SERVICES['arhivach.cf'] = SERVICES['archivach.org']
SERVICES['arhivach.ng'] = SERVICES['archivach.org']

function trimTrailingSlash(string) {
	if (string && string[string.length - 1] === '/') {
		return string.slice(0, -1)
	}
	return string
}

function getProtocol() {
	if (typeof window !== 'undefined') {
		return window.location.protocol
	}
	return 'https'
}

const HTML_PAGE_REGEXP = /\.html$/