// `fetch-jsonp` is not supported in Node.js.
// import fetchJsonp from 'fetch-jsonp'
import fetchJsonp from '../../utility/fetch-jsonp.js'

import getTweetText from './getTweetText.js'

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
 * @param  {object} options — `{ messages }`
 * @return {Promise<object>} [result] `{ url, content, authorName, authorId, authorUrl }`.
 */
export default function getTweet(id, { messages }) {
	if (counter === Number.MAX_SAFE_INTEGER) {
		counter = 1
	}
	return fetchJsonp(`https://publish.twitter.com/oembed?url=https://twitter.com/Interior/status/${id}`, {
		callbackFunction: `jsonp_twitter_${counter++}`
	}).then(
		(response) => {
			return response.json().then(
				(json) => {
					return parseTweet(json, { id, messages })
				}
			)
		}
	).catch((error) => {
		console.error(error)
	})
}

export function parseTweet(json, { id, messages }) {
	const text = getTweetText(json.html, { messages })
	if (!text) {
		return
	}
	return {
		provider: 'Twitter',
		id,
		url: json.url,
		content: text,
		date: parseTweetDate(json.html),
		author: {
			name: json.author_name,
			id: json.author_url.slice(json.author_url.lastIndexOf('/') + 1),
			url: json.author_url
		}
	}
}

function parseTweetDate(html) {
  const match = html.match(/<a .+?>([^<]+)<\/a><\/blockquote>/)
  if (match) {
  	return parseTweetDateText(match[1])
  }
}

// "May 5, 2014", "March 13, 2019".
export function parseTweetDateText(dateText) {
  const match = dateText.match(/^([A-Za-z]+) (\d+), (\d+)$/)
  if (match) {
  	const monthIndex = MONTHS.indexOf(match[1])
  	const day = parseInt(match[2])
  	const year = parseInt(match[3])
  	return new Date(year, monthIndex, day)
  }
}

const MONTHS = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
]