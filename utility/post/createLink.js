import parseServiceLink from '../link/parseServiceLink.js'
import getHumanReadableLinkAddress from '../getHumanReadableLinkAddress.js'

/**
 * Creates post link from `url` and `content`.
 * The `url` will be parsed to see if a `service` can be detected.
 * For example, a YouTube video URL will be parsed and the resulting `link`
 * will have `service` set to `"youtube"` and `content` set to the video ID,
 * and a YouTube icon could then be shown before the link's `content`
 * when the link is rendered (or, if there's no icon for a `service`,
 * a simple `${service}:` prefix could be prepended to it).
 * @param  {string} url
 * @param  {string} [content]
 * @return {object}
 */
export default function createLink(url, content) {
	const parsedServiceLink = parseServiceLink(url)
	if (content && content !== url) {
		const link = {
			type: 'link',
			url,
			content
		}
		if (parsedServiceLink) {
			link.service = parsedServiceLink.service
		}
		return link
	}
	if (parsedServiceLink) {
		return {
			type: 'link',
			url,
			service: parsedServiceLink.service,
			content: parsedServiceLink.text,
			contentGenerated: true
		}
	}
	return {
		type: 'link',
		url,
		content: getHumanReadableLinkAddress(url),
		contentGenerated: true
	}
}