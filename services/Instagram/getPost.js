// Instagram doesn't allow CORS on their oEmbed API.
// So it doesn't work in a web browser.

// `fetch-jsonp` is not supported in Node.js.
// import fetchJsonp from 'fetch-jsonp'
import fetchJsonp from '../../utility/fetch-jsonp.js'

import getMimeType from '../../utility/getMimeType.js'

let counter = 1
/**
 * Returns tweet data.
 * Can return `undefined`.
 * Twitter has a proper API but that API is an OAuth one
 * meaning that a client has a special key which is used to obtain
 * the actual API access keys (which expire over time).
 * The "get API access key" endpoint doesn't allow CORS.
 * There are many discussions about that on StackOverflow,
 * Twitter just doesn't care. But the "/oembed" API endpoint
 * does allow CORS, and also doesn't require any API keys,
 * so it's much simpler to use. It returns an object of shape:
 * `{ url, html, author_url, author_name }`.
 * @param  {string} id
 * @return {Promise<object>} [result] `{ url, content, authorName, authorId, authorUrl }`.
 */
export default function getInstagramPost(id) {
	if (counter === Number.MAX_SAFE_INTEGER) {
		counter = 1
	}
	return fetchJsonp(`https://api.instagram.com/oembed/?url=http://instagram.com/p/${id}`, {
		callbackFunction: `jsonp_instagram_${counter++}`
	}).then(
		(response) => {
			return response.json().then(
				(json) => {
					return parseInstagramPost(json, { id })
				}
			)
		}
	).catch((error) => {
		console.error(error)
	})
}

export function parseInstagramPost(json, { id }) {
	return {
		provider: 'Instagram',
		id,
		url: parseUrl(json.html),
		content: json.title,
		date: parseDate(json.html),
		author: {
			name: parseAuthorName(json.html, json.author_name),
			id: json.author_name,
			url: json.author_url
		},
		attachments: [{
			type: 'picture',
			picture: {
				type: getMimeType(json.thumbnail_url),
				width: json.thumbnail_width,
				height: json.thumbnail_height,
				url: json.thumbnail_url
			}
		}]
	}
}

function parseUrl(html) {
	const match = html.match(/data-instgrm-permalink="([^?"]+)/)
	if (match) {
		return match[1]
	}
}

function parseDate(html) {
	const match = html.match(/ datetime="([^"]+)/)
	if (match) {
		return new Date(match[1])
	}
}

function parseAuthorName(html, authorId) {
	const match = html.match(new RegExp(`<a .+?>\\s?([^><]+)<\\/a> \\(@${authorId}\\)`))
	if (match) {
		return match[1]
	}
}