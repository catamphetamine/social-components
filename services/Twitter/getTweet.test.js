import getTweet, { parseTweet, parseTweetDateText } from './getTweet.js'

import expectToEqual from '../../utility/expectToEqual.js'

const NASA_TWEET = {"url":"https:\/\/twitter.com\/Interior\/status\/463440424141459456","author_name":"US Department of the Interior","author_url":"https:\/\/twitter.com\/Interior","html":"\u003Cblockquote class=\"twitter-tweet\"\u003E\u003Cp lang=\"en\" dir=\"ltr\"\u003ESunsets don&#39;t get much better than this one over \u003Ca href=\"https:\/\/twitter.com\/GrandTetonNPS?ref_src=twsrc%5Etfw\"\u003E@GrandTetonNPS\u003C\/a\u003E. \u003Ca href=\"https:\/\/twitter.com\/hashtag\/nature?src=hash&amp;ref_src=twsrc%5Etfw\"\u003E#nature\u003C\/a\u003E \u003Ca href=\"https:\/\/twitter.com\/hashtag\/sunset?src=hash&amp;ref_src=twsrc%5Etfw\"\u003E#sunset\u003C\/a\u003E \u003Ca href=\"http:\/\/t.co\/YuKy2rcjyU\"\u003Epic.twitter.com\/YuKy2rcjyU\u003C\/a\u003E\u003C\/p\u003E&mdash; US Department of the Interior (@Interior) \u003Ca href=\"https:\/\/twitter.com\/Interior\/status\/463440424141459456?ref_src=twsrc%5Etfw\"\u003EMay 5, 2014\u003C\/a\u003E\u003C\/blockquote\u003E\n\u003Cscript async src=\"https:\/\/platform.twitter.com\/widgets.js\" charset=\"utf-8\"\u003E\u003C\/script\u003E\n","width":550,"height":null,"type":"rich","cache_age":"3153600000","provider_name":"Twitter","provider_url":"https:\/\/twitter.com","version":"1.0"}

const NASA_TWEET_PARSED = {
	provider: 'Twitter',
	id: '463440424141459456',
	content: 'Sunsets don\'t get much better than this one over @GrandTetonNPS. #nature #sunset (link)',
	url: 'https://twitter.com/Interior/status/463440424141459456',
	date: new Date(2014, 4, 5),
	author: {
		name: 'US Department of the Interior',
		id: 'Interior',
		url: 'https://twitter.com/Interior'
	}
}

const messages = {
	textContent: {
		inline: {
			link: '(link)'
		}
	}
}

// `fetch-jsonp` is not supported in Node.js,
// so this test is skipped.
describe.skip('getTweet', () => {
	it('should get tweet by id', async () => {
		expectToEqual(
			await getTweet('463440424141459456', { messages }),
			NASA_TWEET_PARSED
		)
	})
})

describe('parseTweet', () => {
	it('should parse tweet', () => {
		expectToEqual(
			parseTweet(NASA_TWEET, { messages, id: NASA_TWEET_PARSED.id }),
			NASA_TWEET_PARSED
		)
	})
})

describe('parseTweetDateText', () => {
	it('should parse tweet date', () => {
		expectToEqual(
			parseTweetDateText('May 5, 2014'),
			new Date(2014, 4, 5)
		)
		expectToEqual(
			parseTweetDateText('March 13, 2019'),
			new Date(2019, 2, 13)
		)
	})
})