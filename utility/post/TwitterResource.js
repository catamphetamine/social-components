import getTweet from '../../services/Twitter/getTweet.js'
import parseTweetUrl from '../../services/Twitter/parseTweetUrl.js'

export default {
	parseUrl(url) {
		const { id } = parseTweetUrl(url)
		if (id) {
			return { id }
		}
	},
	getId({ id }) {
		return id
	},
	load({ id }, { messages }) {
		return getTweet(id, {
			messages: messages && messages.contentType
		})
	},
	getAttachment(tweet) {
		return {
			type: 'social',
			social: tweet
		}
	},
	getContent(tweet) {
		if (tweet.content) {
			return `${tweet.author.name} (@${tweet.author.id}): ${tweet.content}`
		}
	}
}