/**
 * Unescapes HTML-escaped text: replaces "&gt;" with ">", etc.
 * https://en.wikipedia.org/wiki/Character_encodings_in_HTML#HTML_character_references
 * @param  {string} string
 * @return {string}
 */
export default function unescapeContent(string) {
	return string
		.replace(/&quot;/g, '"')
		.replace(/&amp;/g, '&')
		.replace(/&gt;/g, '>')
		.replace(/&lt;/g, '<')
		.replace(/&apos;/g, '\'')
		// .replace(/&#39;/g, '\'')
		// .replace(/&#47;/g, '/')
		// .replace(/&#92;/g, '\\')
		.replace(/&#([0-9]{1,3});/gi, (match, code) => String.fromCharCode(parseInt(code, 10)))
}