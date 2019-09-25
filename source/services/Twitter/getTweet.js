// `fetch-jsonp` is not supported in Node.js.
// import fetchJsonp from 'fetch-jsonp'
import fetchJsonp from '../../../fetch-jsonp'

import getTweetText from './getTweetText'

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
 * @return {object} [result] `{ url, content, authorName, authorId, authorUrl }`.
 */
export default async function getTweet(id, { messages }) {
	if (counter === Number.MAX_SAFE_INTEGER) {
		counter = 1
	}
	try {
		const response = await fetchJsonp(`https://publish.twitter.com/oembed?url=https://twitter.com/Interior/status/${id}`, {
			jsonpCallbackFunction: `jsonp_twitter_${counter++}`
		})
		return parseTweet(await response.json(), { messages })
	} catch (error) {
		console.error(error)
		return
	}
}

export function parseTweet(json, { messages }) {
	const text = getTweetText(json.html, { messages })
	if (!text) {
		return
	}
	return {
		provider: 'Twitter',
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

export function getTweetId(url) {
	const match = url.match(/\/status\/(\d+)/)
	if (match) {
		return match[1]
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