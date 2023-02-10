// This function is currently not used.
// I guess this function could be replaced with using the `URL` class.
export default function parseUrlQueryString(queryString) {
	return queryString.split('&').reduce((query, part) => {
		const [key, value] = part.split('=')
		query[decodeURIComponent(key)] = decodeURIComponent(value)
		return query
	}, {})
}
