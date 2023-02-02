import getServiceByDomain from './getServiceByDomain.js'

const WWW_REGEXP = /^www\./
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
	const domain = url.hostname.replace(WWW_REGEXP, '')
	const service = getServiceByDomain(domain)
	if (service) {
		if (service.getLinkTitle) {
			let linkToParse
			const title = service.getLinkTitle(url, {
				// Special case for links from Google search results:
				// `https://google.com/url?url=https://another.site.com` → `https://another.site.com`.
				parseLink: (link) => {
					linkToParse = link
					return undefined
				}
			})
			if (title) {
				return {
					service: service.provider,
					text: title
				}
			}
			if (linkToParse) {
				return parseServiceLink(linkToParse)
			}
		}
		return {
			service: service.provider,
			text:
				SINGLE_PATH_ELEMENT.test(url.pathname)
					? decodeURI(url.pathname.slice('/'.length))
					: (decodeURI(url.pathname + url.search + url.hash) || domain)
		}
	}
}

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