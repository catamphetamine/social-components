// I guess this should be replaced with `URL`.
export function parseQueryString(queryString) {
	return queryString.split('&').reduce((query, part) => {
		const [key, value] = part.split('=')
		query[decodeURIComponent(key)] = decodeURIComponent(value)
		return query
	}, {})
}

// const ABSOLUTE_URL_REGEXP = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i
// Modified to extract domain as the first capturing group.
const ABSOLUTE_URL_REGEXP = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?((?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i

export function isValidUrl(url) {
	return ABSOLUTE_URL_REGEXP.test(url)
}

export function isValidRelativeUrl(url) {
	return url && url[0] === '/' && url[1] !== '/'
}

export function getDomainName(url) {
	const match = url.match(ABSOLUTE_URL_REGEXP)
	if (match) {
		let domain = match[1]
		if (domain) {
			if (domain.indexOf('www.') === 0) {
				domain = domain.slice('www.'.length)
			}
			return domain
		}
	}
}

export function getUrlQueryPart(parameters) {
	const keys = Object.keys(parameters)
	if (keys.length === 0) {
		return ''
	}
	return '?' + keys.map(key => encodeURIComponent(key) + '=' + encodeURIComponent(parameters[key])).join('&')
}