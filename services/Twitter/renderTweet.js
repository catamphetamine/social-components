/**
 * Renders a tweet.
 * @param  {string} tweetId
 * @param  {Element} container — If container is `display: none` then Twitter API won't render it. Things like `position: absolute`, `position: fixed`, `max-width: 0`, `max-height: 0` would also screw with the tweet rendering: it's height would "jump" during the initial render. `visibility: none` doesn't seem to mess with the rendering process.
 * @param  {boolean} [options.darkMode]
 * @param  {string} [options.locale] — BCP 47 language tag.
 * @return {Promise} The `Promise` is resolved with the rendered tweet `Element`. The `Promise` might not even resolve in some cases (for example, `container` is `display: none`).
 */
export default function renderTweet (tweetId, container, { darkMode, locale } = {}) {
	return new Promise((resolve, reject) => {
		getTwitterApi().ready(() => {
			// Alternative: render a `<blockquote/>` and then call `.load()`:
			// getTwitterApi().widgets.load()
			getTwitterApi().widgets.createTweet(tweetId, container, {
				// https://developer.twitter.com/en/docs/twitter-for-websites/embedded-tweets/guides/embedded-tweet-parameter-reference
				theme: darkMode ? 'dark' : 'light',
				// https://developer.twitter.com/en/docs/twitter-for-websites/supported-languages
				// Pages which define an unsupported script or region will be mapped to the
				// closest available language: e.g. pt-BR will use pt if Portuguese is available
				// but a Brazilian regional localization is not.
				lang: locale,
				// lang: locale && getLanguageFromLocale(locale),
				// When set to true, the Tweet and its embedded page on your site
				// are not used for purposes that include personalized suggestions
				// and personalized ads.
				dnt: true,
				align: 'center'
			}).then(resolve, reject)
		})
	})
}

// https://developer.twitter.com/en/docs/twitter-for-websites/javascript-api/guides/set-up-twitter-for-websites
function getTwitterApi() {
	const id = 'twitter-wjs';
	const fjs = document.getElementsByTagName('script')[0];
	const t = window.twttr || {};
	// Return if already initialized.
	if (document.getElementById(id)) return t;
	// Insert `<script/>` element.
	const js = document.createElement('script');
	js.id = id;
	js.src = "https://platform.twitter.com/widgets.js";
	fjs.parentNode.insertBefore(js, fjs);
	// Twitter ready queue.
	t._e = [];
	t.ready = function(f) {
		t._e.push(f);
	};
	// Return Twitter API.
	return window.twttr = t;
}

// // https://developer.twitter.com/en/docs/twitter-for-websites/supported-languages
// // Pages which define an unsupported script or region will be mapped to the
// // closest available language: e.g. pt-BR will use pt if Portuguese is available
// // but a Brazilian regional localization is not.
// function getLanguageFromLocale(locale) {
// 	// A "BCP 47 language tag" has not only the language tag, but also "extlang".
// 	// https://tools.ietf.org/html/bcp47
// 	// Examples: "zh-cn" (Chinese (Simplified)), "zh-tw" (Chinese (Traditional))
// }