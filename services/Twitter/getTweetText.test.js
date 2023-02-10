import getTweetText from './getTweetText.js'

import expectToEqual from '../../utility/expectToEqual.js'

const messages = {
	textContent: {
		inline: {
			link: '(link)',
			attachment: '(attachment)'
		}
	}
}

function getTweetTextTest(html, text) {
	expectToEqual(getTweetText(html, { messages }), text)
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

	it('should detect "cash tags" (stock market)', () => {
		getTweetTextTest(
			"\u003Cblockquote class=\"twitter-tweet\"\u003E\u003Cp lang=\"en\" dir=\"ltr\"\u003EDROPS IN NASDAQ SHORTS: \u003Ca href=\"https:\/\/twitter.com\/search?q=%24AAPL&amp;src=ctag&amp;ref_src=twsrc%5Etfw\"\u003E$AAPL\u003C\/a\u003E \u003Ca href=\"https:\/\/twitter.com\/search?q=%24TSLA&amp;src=ctag&amp;ref_src=twsrc%5Etfw\"\u003E$TSLA\u003C\/a\u003E \u003Ca href=\"https:\/\/twitter.com\/search?q=%24TLRY&amp;src=ctag&amp;ref_src=twsrc%5Etfw\"\u003E$TLRY\u003C\/a\u003E \u003Ca href=\"https:\/\/twitter.com\/search?q=%24MRNA&amp;src=ctag&amp;ref_src=twsrc%5Etfw\"\u003E$MRNA\u003C\/a\u003E \u003Ca href=\"https:\/\/twitter.com\/search?q=%24MCHP&amp;src=ctag&amp;ref_src=twsrc%5Etfw\"\u003E$MCHP\u003C\/a\u003E \u003Ca href=\"https:\/\/twitter.com\/search?q=%24PTEN&amp;src=ctag&amp;ref_src=twsrc%5Etfw\"\u003E$PTEN\u003C\/a\u003E \u003Ca href=\"https:\/\/twitter.com\/search?q=%24FOSL&amp;src=ctag&amp;ref_src=twsrc%5Etfw\"\u003E$FOSL\u003C\/a\u003E \u003Ca href=\"https:\/\/twitter.com\/search?q=%24MU&amp;src=ctag&amp;ref_src=twsrc%5Etfw\"\u003E$MU\u003C\/a\u003E \u003Ca href=\"https:\/\/twitter.com\/search?q=%24DKNG&amp;src=ctag&amp;ref_src=twsrc%5Etfw\"\u003E$DKNG\u003C\/a\u003E \u003Ca href=\"https:\/\/twitter.com\/search?q=%24REAL&amp;src=ctag&amp;ref_src=twsrc%5Etfw\"\u003E$REAL\u003C\/a\u003E \u003Ca href=\"https:\/\/twitter.com\/search?q=%24PAAS&amp;src=ctag&amp;ref_src=twsrc%5Etfw\"\u003E$PAAS\u003C\/a\u003E \u003Ca href=\"https:\/\/twitter.com\/search?q=%24UAL&amp;src=ctag&amp;ref_src=twsrc%5Etfw\"\u003E$UAL\u003C\/a\u003E \u003Ca href=\"https:\/\/twitter.com\/search?q=%24PLAY&amp;src=ctag&amp;ref_src=twsrc%5Etfw\"\u003E$PLAY\u003C\/a\u003E \u003Ca href=\"https:\/\/twitter.com\/search?q=%24WKHS&amp;src=ctag&amp;ref_src=twsrc%5Etfw\"\u003E$WKHS\u003C\/a\u003E \u003Ca href=\"https:\/\/twitter.com\/search?q=%24QCOM&amp;src=ctag&amp;ref_src=twsrc%5Etfw\"\u003E$QCOM\u003C\/a\u003E \u003Ca href=\"https:\/\/twitter.com\/search?q=%24BBBY&amp;src=ctag&amp;ref_src=twsrc%5Etfw\"\u003E$BBBY\u003C\/a\u003E \u003Ca href=\"https:\/\/twitter.com\/search?q=%24CRON&amp;src=ctag&amp;ref_src=twsrc%5Etfw\"\u003E$CRON\u003C\/a\u003E \u003Ca href=\"https:\/\/twitter.com\/search?q=%24ETSY&amp;src=ctag&amp;ref_src=twsrc%5Etfw\"\u003E$ETSY\u003C\/a\u003E \u003Ca href=\"https:\/\/twitter.com\/search?q=%24AMRN&amp;src=ctag&amp;ref_src=twsrc%5Etfw\"\u003E$AMRN\u003C\/a\u003E \u003Ca href=\"https:\/\/twitter.com\/search?q=%24APPS&amp;src=ctag&amp;ref_src=twsrc%5Etfw\"\u003E$APPS\u003C\/a\u003E \u003Ca href=\"https:\/\/twitter.com\/search?q=%24APA&amp;src=ctag&amp;ref_src=twsrc%5Etfw\"\u003E$APA\u003C\/a\u003E \u003Ca href=\"https:\/\/twitter.com\/search?q=%24BCRX&amp;src=ctag&amp;ref_src=twsrc%5Etfw\"\u003E$BCRX\u003C\/a\u003E \u003Ca href=\"https:\/\/twitter.com\/search?q=%24IRWD&amp;src=ctag&amp;ref_src=twsrc%5Etfw\"\u003E$IRWD\u003C\/a\u003E \u003Ca href=\"https:\/\/twitter.com\/search?q=%24CMCSA&amp;src=ctag&amp;ref_src=twsrc%5Etfw\"\u003E$CMCSA\u003C\/a\u003E \u003Ca href=\"https:\/\/twitter.com\/search?q=%24KTOV&amp;src=ctag&amp;ref_src=twsrc%5Etfw\"\u003E$KTOV\u003C\/a\u003E \u003Ca href=\"https:\/\/t.co\/ec5MdRH0v6\"\u003Epic.twitter.com\/ec5MdRH0v6\u003C\/a\u003E\u003C\/p\u003E&mdash; JE$US (@WallStJesus) \u003Ca href=\"https:\/\/twitter.com\/WallStJesus\/status\/1304809935839145984?ref_src=twsrc%5Etfw\"\u003ESeptember 12, 2020\u003C\/a\u003E\u003C\/blockquote\u003E\n\u003Cscript async src=\"https:\/\/platform.twitter.com\/widgets.js\" charset=\"utf-8\"\u003E\u003C\/script\u003E\n",
			'DROPS IN NASDAQ SHORTS: $AAPL $TSLA $TLRY $MRNA $MCHP $PTEN $FOSL $MU $DKNG $REAL $PAAS $UAL $PLAY $WKHS $QCOM $BBBY $CRON $ETSY $AMRN $APPS $APA $BCRX $IRWD $CMCSA $KTOV (attachment)'
		)
	})
})