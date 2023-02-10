export default function getUrlQueryStringForParameters(parameters) {
	const keys = Object.keys(parameters)
	if (keys.length === 0) {
		return ''
	}
	return '?' + keys.map(key => encodeURIComponent(key) + '=' + encodeURIComponent(parameters[key])).join('&')
}