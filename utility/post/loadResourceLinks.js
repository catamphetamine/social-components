import cloneDeep from 'lodash/cloneDeep.js'

import YouTubeResource from './YouTubeResource.js'
import TwitterResource from './TwitterResource.js'
import visitPostParts from './visitPostParts.js'

import expandStandaloneAttachmentLinks from './expandStandaloneAttachmentLinks.js'
import generatePostPreview from './generatePostPreview.js'

import resolvePromises from '../resolvePromises.js'

/**
 * Loads "resource" links (such as links to YouTube and Twitter)
 * by loading the info associated with the resources.
 * For example, sets video `.attachment` on YouTube links
 * and sets "social" `.attachment` on Twitter links.
 * @param  {object} post
 * @param  {function} [options.onContentChange] — Is called on this post content change (as a result of a resource link being loaded). For example, it may re-render the post.
 * @param  {object} [options.cache] — Can be used for getting YouTube videos by ID from cache.
 * @param  {(string|string[])} [options.youTubeApiKey] — YouTube API key. If it's an array of keys then the first non-erroring one is used.
 * @param  {function} [options.loadResources] — This is a hacky point of customization to add some other custom resource loaders. Is used in `captchan` to fix `lynxchan` post attachment sizes and URLs.
 * @param  {number} [options.contentMaxLength] — If set, will re-generate `.contentPreview` if the updated `content` exceeds the limit (in "points").
 * @param  {object} [options.messages] — Localized labels for resource loading. See [Messages](#messages).
 * @param  {boolean} [options.minimizeGeneratedPostLinkBlockQuotes] — See the description of the same option of `generatePostPreview()`.
 * @return {object} Returns an object having a `cancel()` function and a `promise` property. Calling `stop()` function prevents `loadResourceLinks()` from making any further changes to the `post` object. Calling `cancel()` function multiple times or after the `promise` has finished doesn't have any effect. The `promise` is a `Promise` that resolves when all resource links have been loaded. Loading some links may potentially error (for example, if a YouTube video wasn't found). Even if the returned `Promise` errors due to some resource loader, the post content still may have been changed by other resource loaders.
 */
export default function loadResourceLinks_(post, {
	cache,
	youTubeApiKey,
	messages,
	onContentChange,
	contentMaxLength,
	// An optional list of `Promises`, each `Promise` resolving to a `boolean`.
	additionalResourceLoadingPromises,
	// `loadResources` is a legacy parameter. Use `additionalResourceLoadingPromises` parameter instead.
	loadResources,
	minimizeGeneratedPostLinkBlockQuotes,
	// sync
}) {
	// If there're no loadable links then return.
	const hasAnyLoadableLinks = visitPostParts('link', link => isLoadableLink(link, RESOURCES))

	// Clone `post.content` because it might potentially (or even likely) be changed
	// after loading any resource link.
	// It could behave a bit "smarter", only cloning `post.content` if some resource link
	// has actually been loaded, but resource loader first finds resource links in `post.content`
	// and only after that it attempts to load them, so it already has the reference to the
	// content part inside the uncloned `post.content`.
	const originalContent = cloneDeep(post.content)

	// Could also clone the post so that the original `post`
	// is only changed after the updated post has rendered.
	// This was previously used for `virtual-scroller` consistency:
	// there's a short delay between the post object being updated
	// and it being re-rendered on screen (and re-measured after that).
	// If the post isn't cloned, then there could be the cases when
	// `virtual-scroller` doesn't get the opportunity to re-measure
	// a post element before it gets hidden if the user scrolls too fast.
	// By cloning the post, a cloned object would get updated as the
	// resource links get loaded, and those changes would only be carried
	// over to the original post object after the updated "clone" object
	// has been re-measured (and then the clone would be re-created
	// on each new resource loading process step, when it's time to
	// make the changes to the post's content).
	// The described solution would keep the post's height always
	// consistent with the post object. But, currently, `virtual-scroller`
	// re-measures item heights after each render anyway, and doesn't
	// complain in case of any inconsistencies in such cases, so it
	// doesn't make a difference whether the original post object
	// is modified directly or via a "clone" proxy: the scroll position
	// would jump anyway when a user scrolls up to a post that still
	// has some non-loaded resource links left because once those links
	// are loaded (maybe instantly), the post height changes and that
	// creates a perception of a "jump" of the page content.
	// So, to simplify the code here, cloning the post object is not done.
	// Also, the whole cloning-and-copying stuff could be easlily moved
	// from here to the application layer.
	// const postBeingMutated = clonePost(post)
	// function carryOverTheChanges(from, to) {
	// 	to.content = from.content
	// 	if (contentMaxLength !== undefined) {
	// 		to.contentPreview = from.contentPreview
	// 	}
	// 	to.attachments = from.attachments
	// }

	// This function gets called whenever a resource link has been loaded
	// and an `.attachment` property has been added on that link (content part).
	const onPostLinkAttachmentLoaded = () => {
		// const postWithResourceLinksLoadedBeforeItHasRendered = clonePost(postBeingMutated)
		// "Expand" the link with the `.attachment` (`{ type: 'link', attachment: ... }`)
		// into a standalone attachment (a block-level attachment: `{ type: 'attachment' }`).
		// // No longer relevant: "that references the new attachment by an `attachmentId`".
		// // No longer relevant: "The attachment itself is moved from the link to `post.attachments`".
		expandStandaloneAttachmentLinks(post.content)
		// Post `content` has changed, so re-generate the content preview.
		if (contentMaxLength !== undefined) {
			post.contentPreview = generatePostPreview(post, {
				maxLength: contentMaxLength,
				minimizeGeneratedPostLinkBlockQuotes
			})
		}
		// Re-render the post after it has been updated.
		// There will be a short delay between the post being updated in state
		// and it being re-rendered on screen. This could result in `virtual-scroller`
		// measuring the DOM element height of the previous `post` render
		// if the `post` being updated has just been scrolled off the screen
		// resulting in it no longer being rendered, and so the next time
		// it's rendered, the items list would "jump" because now it will be
		// rendered with the new `post` data and its height will be different.
		// This edge case though is a very rare one (could be said to be
		// "very unlikely to happen") so I guess it can be ignored and won't
		// result in any UX issues.
		if (onContentChange) {
			onContentChange()
		}
	}

	let cancelled
	function onSomeResourceLinkProcessed(hasResourceBeenLoaded) {
		if (cancelled) {
			return
		}
		if (hasResourceBeenLoaded) {
			// A resource link has been found and has been loaded:
			// the `post.content` object has been changed by adding an
			// `.attachment` object to the link inside `post.content`.
			onPostLinkAttachmentLoaded()
		}
	}

	let results = [
		loadResourceLinks(post.content, RESOURCES, {
			cache,
			// sync,
			youTubeApiKey,
			messages
		})
	]

	// if (sync) {
	// 	return onSomeResourceLinkProcessed(results.findIndex(_ => _) >= 0)
	// }

	// This is a point of customization to add some other custom resource loaders.
	// Is used in `captchan` to fix `lynxchan` post attachment sizes and URLs.
	if (loadResources) {
		additionalResourceLoadingPromises = loadResources()
	}
	if (additionalResourceLoadingPromises) {
		results = results.concat(additionalResourceLoadingPromises)
	}

	return {
		promise: resolvePromises(results, onSomeResourceLinkProcessed),

		// Calling `.cancel()` prevents the `loadResourceLinks()` function
		// from making any further changes to the `post` object.
		cancel: () => {
			cancelled = true

			// Revert `post.content` to its original unmodified state.
			// The reason is that if some resource link has been loaded,
			// an `.attachment` property has been set on the link object
			// and it will be ignored if `loadResourceLinks()` gets called
			// a second time on `post.content`.
			// Calling `loadResourceLinks()` a second time happens with React
			// in development mode: it runs all "effect" hooks twice at initial mount.
			post.content = originalContent

			// Re-render the post because `post.content` has been reverted.
			if (onContentChange) {
				onContentChange()
			}
		}
	}
}

// /**
//  * Clones a post so that the original post content
//  * could be modified and new attachments added
//  * without affecting the snapshot.
//  * Doesn't use straight `cloneDeep(post)`
//  * just because I prefer keeping cloned properties explicit.
//  * @param  {object} post
//  * @return {object}
//  */
// function clonePost(post) {
// 	return {
// 		...post,
// 		// `content` is updated at arbitrarily deep levels
// 		// when loading resource links, so it's cloned "deeply".
// 		content: cloneDeep(post.content),
// 		//
// 		// `contentPreview` is not updated in-place and is instead
// 		// re-generated from scratch every time it's updated,
// 		// so no need to do a "deep cloning" of `contentPreview`:
// 		// just copying it "by reference" works, because it's virtually immutable.
// 		//
// 		// Attachments could be modified. For example, by `loadResources()`
// 		// doing `fixPictureSizes()` in `webapp-frontend`.
// 		attachments: cloneDeep(post.attachments)
// 		// No longer relevant:
// 		// // New attachments are added to `post.attachments` when loading
// 		// // resource links, so `post.attachments` are copied "shallowly".
// 		// attachments: post.attachments && post.attachments.slice()
// 	}
// }

/**
 * Loads resource `link`s: transforms those links
 * by inserting resource title as link content,
 * and also attaches an `attachment` to the `link`.
 * Returning a `Promise` instead of using `async` here
 * so that resource cache is checked synchronously
 * rather that at the next "tick" when `{ sync: true }` option is passed.
 * (`export` is just for tests)
 * @param  {any} content — Post `content`.
 * @param  {object<Resource>} Resources — Supported service resource types.
 * @param  {boolean} [options.sync] — Deprecated.
 * @param  {object} [options.cache]
 * @param  {object} [options.messages]
 * @return {(boolean|Promise)} Have any resource links been loaded
 */
export function loadResourceLinks(content, Resources, options) {
	const results = visitPostParts(
		'link',
		(link) => {
			function resultOrPromise(result) {
				if (result && typeof result.then === 'function') {
					return result
				}
				if (options.sync) {
					return result
				} else {
					return Promise.resolve(result)
				}
			}
			if (!isLoadableLink(link, Resources)) {
				return resultOrPromise(false)
			}
			const Resource = Resources[link.service]
			return resultOrPromise(loadResourceLink(link, Resource, options))
		},
		content
	)
	if (options.sync) {
		return getLoadLinksResult(results)
	} else {
		return Promise.all(results).then(getLoadLinksResult)
	}
}

function getLoadLinksResult(results) {
	return results.findIndex(_ => _) >= 0
}

/**
 * Loads a resource link.
 * Returning a `Promise` instead of using `async` here
 * so that resource cache is checked synchronously
 * rather that at the next "tick" when `{ sync: true }` option is passed.
 * @param  {object} link — `{ type: 'link' }`.
 * @param  {object} Resource
 * @param  {boolean} [options.sync] — Deprecated.
 * @param  {object} [options.cache]
 * @param  {object} [options.messages]
 * @return {(boolean|Promise<boolean>)} [result]
 */
function loadResourceLink(link, Resource, options) {
	const { url, service } = link
	const descriptor = Resource.parseUrl(url)
	if (!descriptor) {
		return false
	}
	const id = Resource.getId(descriptor)
	const { cache } = options
	const resource = cache && cache.get(service, id)
	const onLoaded = (resource) => {
		return onResourceLinkLoaded(link, resource, Resource, options)
	}
	if (resource !== undefined) {
		return onLoaded(resource)
	}
	return Resource.load(descriptor, options).then((resource) => {
		if (resource !== undefined && cache) {
			cache.put(service, id, resource)
		}
		return onLoaded(resource)
	})
}

function onResourceLinkLoaded(link, resource, Resource, options) {
	if (resource) {
		link.attachment = Resource.getAttachment(resource)
		if (link.contentGenerated) {
			const content = Resource.getContent(resource)
			if (content) {
				link.content = content
				// Unmark the link `content` as autogenerated
				// so that it's output as-is (as "Resource Title")
				// in autogenerated quotes instead of "(link to service.com)".
				delete link.contentGenerated
			}
		}
		return true
	} else if (resource === null) {
		link.notFound = true
		if (link.contentGenerated) {
			const notFoundMessage = options.messages && Resource.getNotFoundMessage && Resource.getNotFoundMessage(options.messages)
			if (notFoundMessage) {
				link.content = notFoundMessage
				delete link.contentGenerated
			}
		}
		return true
	}
}

function isLoadableLink(link, Resources) {
	// If the resource has already been loaded then skip.
	if (link.attachment || link.notFound) {
		return false
	}
	// If it's a link to a non-supported service then skip.
	// Otherwise, the link is loadable.
	const Resource = link.service && Resources[link.service]
	return Boolean(Resource)
}

export const RESOURCES = {
	'youtube': YouTubeResource,
	'twitter': TwitterResource
}