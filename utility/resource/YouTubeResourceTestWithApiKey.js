import { loadResourceLinks_ } from '../post/loadResourceLinks.js'
import YouTubeResource from './YouTubeResource.js'

function loadYouTubeLinks(content, options = {}) {
	return loadResourceLinks_(content, { youtube: YouTubeResource }, {
		...options,
		hasBeenStopped: () => false,
		addUndoOperation: () => {}
	})
}

// Returns a `Promise`.
export default function YouTubeResourceTestWithApiKey(youTubeApiKey) {
	const content = [
		[
			'Abc ',
			{
				type: 'link',
				service: 'youtube',
				url: 'https://www.youtube.com/watch?v=6CPXGQ0zoJE',
				content: 'youtube.com/watch?v=6CPXGQ0zoJE',
				contentGenerated: true
			},
			' def'
		]
	]
	const loadYouTubeLinksResult = loadYouTubeLinks(content, { youTubeApiKey })
	if (!Array.isArray(loadYouTubeLinksResult)) {
		console.error('YouTube video link load result is not an array', loadYouTubeLinksResult)
		return Promise.resolve([content])
	}
	if (loadYouTubeLinksResult.length !== 1) {
		console.error('YouTube video link load result is not an array of a single element', loadYouTubeLinksResult)
		return Promise.resolve([content])
	}
	if (!isPromise(loadYouTubeLinksResult[0])) {
		console.error('YouTube video link load result is not an array of a Promise', loadYouTubeLinksResult)
		return Promise.resolve([content])
	}
	return loadYouTubeLinksResult[0].then(
		(result) => {
			if (!isObject(result) || !result.loadable || !result.loaded) {
				console.error('Couldn\'t load YouTube video link', result)
				return [content]
			}
			return [
				// The "expanded" (mutated) `content`.
				content,
				// Should equal:
				[
					[
						"Abc ",
						{
							"type": "link",
							"service": "youtube",
							"url": "https://www.youtube.com/watch?v=6CPXGQ0zoJE",
							"content": "Samsung leaked their own phone...",
							"attachment": {
								"type": "video",
								"video": {
									"width": 1920,
									"height": 1080,
									"title": "Samsung leaked their own phone...",
									// "description": "Use offer code TECHLINKED to get 20% off your next Mack Weldon order at https://lmg.gg/8KVKv\n\nGET MERCH: www.LTTStore.com\n\nTwitter: http://twitter.com/TechLinkedYT\nInstagram: http://instagram.com/TechLinkedYT\nFacebook: http://facebook.com/TechLinked\n\nNEWS SOURCES:\n\nQUE SERA, SERA\nhttps://www.droid-life.com/2019/01/31/samsung-concept-video-teases-foldable-device/\nhttps://www.youtube.com/watch?time_continue=60&v=mWirqqd0uE4\nMight not be the real thing https://www.engadget.com/2019/02/01/samsung-foldable-phone-render-leak/\nHuawei’s folding phone coming right after https://techcrunch.com/2019/02/01/huaweis-folding-phone-debuts-this-month/\n\nFOLLOW THE RULES\nhttps://www.wired.com/story/apple-blocks-google-employee-apps/\nRestores Google: https://arstechnica.com/information-technology/2019/02/in-addition-to-facebooks-apple-restores-googles-ios-app-certificate/\nRestores Facebook: https://www.iphoneincanada.ca/news/apple-google-facebook-internal/\n\nPASSWORDS! GET YER PASSWORDS HERE\nhttps://linustechtips.com/main/topic/1028078-collection-2-credential-bugaloo-following-collection-1-collections-2-5-found-containing-25-billion-records-combined/\nhttps://www.wired.com/story/collection-leak-usernames-passwords-billions/\nhttps://www.pcworld.com/article/3336026/security/collections-2-5-leak-of-over-2-billion-email-addresses-probably-has-your-information.html\nhttps://www.techspot.com/news/78525-collections-2-5-845gb-stolen-usernames-passwords-circulating.html\nhttps://sec.hpi.de/ilc/search\n\nQUICK BITS\n\nBOBSWAN’S SWANBLOG\nhttps://newsroom.intel.com/news-releases/intel-names-robert-swan-ceo/#gs.TTkqBydB\n\nHURRY UP INTEL\nhttps://twitter.com/IntelGraphics/status/1090323155640508417\n\nLIGHTING STRUCK DOWN?\nhttps://www.cnet.com/news/next-iphone-may-swap-lightning-port-for-usb-c-have-three-rear-cameras/\n\nSWITCH TO A SMALLER SWITCH\nhttps://hexus.net/gaming/news/hardware/127073-nintendo-switch-greater-portability-works/\n\nUV BLOCKER\nhttps://lifehacker.com/make-sure-your-ultraviolet-account-is-linked-to-other-r-1832270454",
									"duration": 491,
									"aspectRatio": 1.7777777777777777,
									"picture": {
										"type": "image/jpeg",
										"url": "https://i.ytimg.com/vi/6CPXGQ0zoJE/maxresdefault.jpg",
										"width": 1280,
										"height": 720,
										"sizes": [
											{
												"type": "image/jpeg",
												"url": "https://i.ytimg.com/vi/6CPXGQ0zoJE/mqdefault.jpg",
												"width": 320,
												"height": 180
											}
										]
									},
									"provider": "YouTube",
									"id": "6CPXGQ0zoJE"
								}
							}
						},
						" def"
					]
				]
			]
		}
	)
}

const objectConstructor = {}.constructor

function isObject(object) {
  return object !== undefined && object !== null && object.constructor === objectConstructor
}

function isPromise(value) {
	return value && typeof value.then === 'function'
}