import getTweetText from './getTweetText'

import expectToEqual from '../../utility/expectToEqual'

function getTweetTextTest(html, text) {
	expectToEqual(getTweetText(html, {
		messages: {
			link: 'Link',
			attachment: 'Attachment'
		}
	}), text)
}

describe('getTweetText', () => {
	it('should get tweet text', () => {
		getTweetTextTest(
			'<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Sunsets don&#39;t get much better than this one over <a href="https://twitter.com/GrandTetonNPS?ref_src=twsrc%5Etfw">@GrandTetonNPS</a>. <a href="https://twitter.com/hashtag/nature?src=hash&amp;ref_src=twsrc%5Etfw">#nature</a> <a href="https://twitter.com/hashtag/sunset?src=hash&amp;ref_src=twsrc%5Etfw">#sunset</a> <a href="http://t.co/YuKy2rcjyU">pic.twitter.com/YuKy2rcjyU</a></p>&mdash; US Department of the Interior (@Interior) <a href="https://twitter.com/Interior/status/463440424141459456?ref_src=twsrc%5Etfw">May 5, 2014</a></blockquote>',
			'Sunsets don\'t get much better than this one over @GrandTetonNPS. #nature #sunset (attachment)'
		)
	})

	it('should filter-out tags in the beginning and in the end, but not in the middle', () => {
		getTweetTextTest(
			"\u003Cblockquote class=\"twitter-tweet\"\u003E\u003Cp lang=\"en\" dir=\"ltr\"\u003E\u003Ca href=\"https:\/\/twitter.com\/hashtag\/Russia?src=hash&amp;ref_src=twsrc%5Etfw\"\u003E#start\u003C\/a\u003E We, the undersigned 26 international human rights, media and Internet freedom organisations call on \u003Ca href=\"https:\/\/twitter.com\/hashtag\/Russia?src=hash&amp;ref_src=twsrc%5Etfw\"\u003E#Russia\u003C\/a\u003E to stop blocking \u003Ca href=\"https:\/\/twitter.com\/telegram?ref_src=twsrc%5Etfw\"\u003E@Telegram\u003C\/a\u003E and cease its relentless attacks on Internet freedom more broadly. \u003Ca href=\"https:\/\/twitter.com\/hashtag\/Russia?src=hash&amp;ref_src=twsrc%5Etfw\"\u003E#end\u003C\/a\u003E \u003Ca href=\"https:\/\/t.co\/oi7tcu91RC\"\u003Ehttps:\/\/t.co\/oi7tcu91RC\u003C\/a\u003E \u003Ca href=\"https:\/\/t.co\/bVvopZnPjy\"\u003Epic.twitter.com\/bVvopZnPjy\u003C\/a\u003E\u003C\/p\u003E&mdash; Amnesty Eastern Europe &amp; Central Asia (@AmnestyEECA) \u003Ca href=\"https:\/\/twitter.com\/AmnestyEECA\/status\/991281853763072000?ref_src=twsrc%5Etfw\"\u003EMay 1, 2018\u003C\/a\u003E\u003C\/blockquote\u003E\n\u003Cscript async src=\"https:\/\/platform.twitter.com\/widgets.js\" charset=\"utf-8\"\u003E\u003C\/script\u003E\n",
			'#start We, the undersigned 26 international human rights, media and Internet freedom organisations call on #Russia to stop blocking @Telegram and cease its relentless attacks on Internet freedom more broadly. #end (link) (attachment)'
		)
	})
})