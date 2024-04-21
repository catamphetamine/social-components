import getTweet from '../../services/Twitter/getTweet.js'
import parseTweetUrl from '../../services/Twitter/parseTweetUrl.js'

// These may be passed as `options`.
const SOCIAL_AUTHOR_AND_CONTENT_TEXT = '{author}: {content}'
const SOCIAL_AUTHOR_NAME_AND_ID_TEXT = '{name} (@{id})'

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
		return getTweet(id, { messages })
	},
	getAttachment(tweet) {
		return {
			type: 'social',
			social: tweet
		}
	},
	getContent(tweet) {
		if (tweet.content) {
			const author = SOCIAL_AUTHOR_NAME_AND_ID_TEXT
				.replace('{name}', tweet.author.name)
				.replace('{id}', tweet.author.id)

			const content = tweet.content

			return SOCIAL_AUTHOR_AND_CONTENT_TEXT
				.replace('{author}', author)
				.replace('{content}', content)
		}
	}
}