const REG_EXP = new RegExp(
	'^' +
	'(?:' +
		'(?:([a-z]+):)?' + // "https:" part of "https://example.com/path"
		'//' + // "//" part of "//example.com/path"
		'(?:[^:/]+:[^@/]+@)?' + // "username:password@" part of "https://username:password@example.com/path"
		'(?:www\.)?' + // "www." part of "https://www.example.com/path"
		'([^/:?#]+)' + // "example-site.com.org" part of "https://example-site.com.org:8080/path"
		'(?:\\:\\d+)?' + // ":8080" part of "https://example-site.com.org:8080/path"
	')?' +
	'(\/[^?#]*)?' + // "/path" part of "https://example.com/path?a=b"
	'(?:\\?[^#/]*)?' + // "?a=b" part of "https://example.com/path?a=b#c"
	'(?:#[^/]*)?' + // "#c" part of "https://example.com/path?a=b#c"
	'$'
)

export default function parseUrl(url) {
	const match = url.match(REG_EXP)
	if (match) {
		const [_, scheme, domain, path] = match
		return {
			scheme,
			domain,
			path: path || '/'
		}
	}
}