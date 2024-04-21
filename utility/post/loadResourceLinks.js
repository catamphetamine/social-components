// import cloneDeep from 'lodash/cloneDeep.js'

import YouTubeResource from '../resource/YouTubeResource.js'
import TwitterResource from '../resource/TwitterResource.js'

import visitContentParts from '../content/visitContentParts.js'
import expandStandaloneAttachmentLinks from '../content/expandStandaloneAttachmentLinks.js'
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
 * @return {object} Returns an object having properties: `stop()`, `cancel()` and a `promise` that resolves to `undefined`. Calling `stop()` function prevents `loadResourceLinks()` from making any further changes to the `post` object. Calling `stop()` function multiple times or after the `promise` has finished doesn't have any effect. Calling `cancel()` function stops `loadResourceLinks()` function and reverts any changes to the `post` object. The `promise` is a `Promise` that resolves to `undefined` when all resource links have been loaded (not necessarily "successfully"). Loading some links may potentially error (for example, if a YouTube video wasn't found).
 */
export default function loadResourceLinks(post, {
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
	const hasAnyLoadableLinks = visitContentParts('link', link => isLoadableLink(link, RESOURCES))

	// In case `loadResourceLinks()` will be cancelled, the original
	// `post.content` and `post.contentPreview` should be restored.
	// That is done by performing a list of "undo" operations
	// rather than keeping and restoring a "reference" to the original `post.content`
	// because `post.content` will be mutated (updated "in place" rather than via "copy-on-write").
	const postContentChangeUndoOperations = []
	const addUndoOperation = (operation) => {
		postContentChangeUndoOperations.push(operation)
	}

	// `post.content` will be changed ("mutated") every time it has loaded a resource link.
	// At the same time, it should restore the original `post.content` on cancel.
	// For that, it uses "undo operations".
	//
	// As an alternative approach, it could also simply deeply clone `post.content`
	// and then modify the deeply cloned copy, and if the application calls `cancel()`
	// then it could simply restore the original `post.content` reference.
	//
	// It could also optimize the cloning approach by only cloning `post.content`
	// in case any resource link was loaded, which would skip the cloning part
	// for the majority of `post`s which don't have any resource links.
	// But this resource loader first finds resource links in `post.content`
	// and only after that it attempts to load those links, so it would become
	// a "chicken and egg" issue: it would have already captured the reference to a link object
	// inside the original (uncloned) `post.content` so it would mutate the original `post.content` anyway.
	//
	// const originalContent = cloneDeep(post.content)
	const originalContentPreview = post.contentPreview

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

	function onSomeResourceLinkProcessed(result) {
		// Migrate legacy `result: boolean` to a new `result: object` format.
		if (result === true) {
			result = { loadable: true }
		} else if (result === false || result === undefined) {
			result = { loadable: false }
		}
		// If `loadResourceLinks()` function was stopped while loading this resource
		// then no changes have been made to `post.content`.
		if (result.stopped) {
			return
		}
		// If `result.loadable` is `true`, it means that `link.content` has been changed.
		// Even if `result.error` is `true`, `link.content` still might've been changed.
		// For example, when a YouTube video is not found, it sets `link.content` to "Video not found".
		if (result.loadable) {
			// A resource link has been found and has been loaded (possibly with an error):
			// the `post.content` object has been changed by adding an
			// `.attachment` object to the link inside `post.content`.
			onPostLinkAttachmentLoaded()
		}
	}

	let cancelled
	let stopped
	let finished

	let promises = loadResourceLinks_(post.content, RESOURCES, {
		cache,
		// sync,
		youTubeApiKey,
		messages,
		addUndoOperation,
		hasBeenStopped: () => stopped
	})

	// if (sync) {
	// 	return onSomeResourceLinkProcessed(results.findIndex(_ => _) >= 0)
	// }

	// This is a point of customization to add some other custom resource loaders.
	// Is used in `captchan` to fix `lynxchan` post attachment sizes and URLs.
	if (loadResources) {
		console.warn('`loadResources` parameter of `loadResourceLinks()` is deprecated, use `additionalResourceLoadingPromises` parameter instead')
		additionalResourceLoadingPromises = loadResources()
	}
	if (additionalResourceLoadingPromises) {
		promises = promises.concat(additionalResourceLoadingPromises)
	}

	// Calling `.stop()` prevents the `loadResourceLinks()` function
	// from making any further changes to the `post` object.
	const stop = () => {
		// Ignore if `.stop()` is called more than one time,
		// or after `.cancel()`.
		if (stopped) {
			return
		}
		// Set `stopped` flag to `true`.
		stopped = true
	}

	return {
		promise: resolvePromises(promises, onSomeResourceLinkProcessed).then(() => {
			// "Finished" means "all resources have been loaded with either success or error".
			// I.e. `finished === true` doesn't mean "successfully finished" but rather just "finished".
			finished = true
		}),

		// Calling `.stop()` prevents the `loadResourceLinks()` function
		// from making any further changes to the `post` object.
		stop,

		// Calling `.cancel()` stops `loadResourceLinks()` function
		// and reverts any changes that may have been made to the `post` object.
		cancel: () => {
			// Ignore if `.cancel()` is called more than one time.
			if (cancelled) {
				return
			}

			cancelled = true

			stop()

			// Revert `post.content` to its original unmodified state.
			//
			// The reason is that if some resource link has been loaded,
			// an `.attachment` property has been set on the link object
			// and it will be ignored if `loadResourceLinks()` gets called
			// a second time on `post.content`.
			//
			// Calling `loadResourceLinks()` a second time happens with React
			// in development mode: it runs all "effect" hooks twice at initial mount.
			//
			// post.content = originalContent
			if (postContentChangeUndoOperations.length > 0) {
				// Revert the changes to `post.content`.
				for (const undoOperation of postContentChangeUndoOperations) {
					undoOperation()
				}
				// Revert the changes to `post.contentPreview`.
				post.contentPreview = originalContentPreview

				// Re-render the post because `post.content` has been reverted to its original state.
				if (onContentChange) {
					onContentChange()
				}
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
 * @param  {(string|string[])} [options.youTubeApiKey]
 * @param  {object} [options.messages]
 * @param  {function} [options.addUndoOperation]
 * @param  {function} [options.hasBeenStopped]
 * @return {(object|Promise<object>)[]} An array of result objects having properties: `stopped: boolean?`, `loadable: boolean?`, `loaded: boolean?`, `error: boolean?`.
 */
export function loadResourceLinks_(content, Resources, {
	// sync,
	...options
}) {
	function getPromiseThatResolvesToValue(result) {
		if (result && typeof result.then === 'function') {
			return result
		}
		// if (sync) {
		// 	return result
		// } else {
			return Promise.resolve(result)
		// }
	}

	return visitContentParts(
		'link',
		(link) => {
			if (!isLoadableLink(link, Resources)) {
				return getPromiseThatResolvesToValue({ loadable: false })
			}
			const Resource = Resources[link.service]
			return getPromiseThatResolvesToValue(loadResourceLink(link, Resource, options))
		},
		content
	)

	// if (sync) {
	// 	return results
	// } else {
	// 	return results
	// }
}

/**
 * Loads a resource link.
 * Returning a `Promise` instead of using `async` here
 * so that resource cache is checked synchronously
 * rather that at the next "tick" when `{ sync: true }` option is passed.
 * @param  {object} link — `{ type: 'link' }`.
 * @param  {object} Resource
 * @param  {object} [options.cache]
 * @param  {(string|string[])} [options.youTubeApiKey]
 * @param  {object} [options.messages]
 * @param  {function} [options.addUndoOperation]
 * @param  {function} [options.hasBeenStopped]
 * @return {(object|Promise<object>)} Result object having properties: `stopped: boolean?`, `loadable: boolean?`, `loaded: boolean?`, `error: boolean?`.
 */
function loadResourceLink(link, Resource, {
	cache,
	youTubeApiKey,
	messages,
	addUndoOperation,
	hasBeenStopped
}) {
	const { url, service } = link
	const descriptor = Resource.parseUrl(url)
	if (!descriptor) {
		return {
			loadable: false
		}
	}
	const onLoaded = (resource) => {
		if (hasBeenStopped()) {
			return {
				stopped: true
			}
		}
		if (resource) {
			onResourceLinkLoadedSuccess(link, resource, { Resource, addUndoOperation })
			return {
				loadable: true,
				loaded: true
			}
		} else if (resource === null) {
			onResourceLinkLoadedError(link, { Resource, messages, addUndoOperation })
			return {
				loadable: true,
				error: true
			}
		} else {
			return {
				loadable: false
			}
		}
	}
	const id = Resource.getId(descriptor)
	const resource = cache && cache.get(service, id)
	if (resource !== undefined) {
		return onLoaded(resource)
	}
	return Resource.load(descriptor, { youTubeApiKey, messages }).then((resource) => {
		if (resource !== undefined && cache) {
			cache.put(service, id, resource)
		}
		return onLoaded(resource)
	})
}

// Replaces autogenerated `link.content` with the new `content`.
function replaceLinkGeneratedContentWith(link, content, { addUndoOperation }) {
	const originalContent = link.content

	// Set `link.content` and `link.contentGenerated`.
	link.content = content
	// Unmark the link `content` as autogenerated
	// so that it's output as-is (as "Resource Title")
	// in autogenerated quotes instead of "(link to service.com)".
	delete link.contentGenerated

	addUndoOperation(() => {
		// Restores the original `link.content`.
		link.content = originalContent
		// Restores the original `link.contentGenerated`.
		link.contentGenerated = true
	})
}

// Updates the `link` object after it has attempted to load the resource:
// * If the resource was loaded then it sets `link.content`/`link.contentGenerated` and also sets `link.attachment`.
// * If the resource was not loaded then it sets `link.content`/`link.contentGenerated` and also sets `link.__loadResourceLinkError = true`.
function onResourceLinkLoadedSuccess(link, resource, { Resource, addUndoOperation }) {
	// Set `link.attachment`.
	link.attachment = Resource.getAttachment(resource)

	addUndoOperation(() => {
		// Restores the original `link.attachment`.
		// If there was `link.attachment` property then this function wouldn't be called
		// so `link.attachment` is not supposed to exist on the original `link`
		delete link.attachment
	})

	// If previous `link.content` was automatically generated,
	// set `link.content` from the loaded attachment.
	if (link.contentGenerated) {
		const content = Resource.getContent(resource)
		if (content) {
			replaceLinkGeneratedContentWith(link, content, { addUndoOperation })
		}
	}
}

function onResourceLinkLoadedError(link, { Resource, messages, addUndoOperation }) {
	link.__loadResourceLinkError = true

	addUndoOperation(() => {
		// If `link.__loadResourceLinkError` was originally `true` then this function wouldn't be called
		// so `link.__loadResourceLinkError` property is not supposed to exist on the original `link`.
		delete link.__loadResourceLinkError
	})

	// If previous `link.content` was automatically generated,
	// set `link.content` to "Not found" message.
	if (link.contentGenerated) {
		const notFoundMessage = messages && Resource.getNotFoundMessage && Resource.getNotFoundMessage(messages)
		if (notFoundMessage) {
			replaceLinkGeneratedContentWith(link, notFoundMessage, { addUndoOperation })
		}
	}
}

function isResourceLink(link, Resources) {
	// If it's a link to a non-supported service then skip.
	// Otherwise, the link is loadable.
	const Resource = link.service && Resources[link.service]
	return Boolean(Resource)
}

function hasResourceLinkAlreadyBeenLoaded(link) {
	// If the resource has already been loaded then skip.
	if (link.attachment || link.__loadResourceLinkError) {
		return true
	}
}

function isLoadableLink(link, Resources) {
	return isResourceLink(link, Resources) && !hasResourceLinkAlreadyBeenLoaded(link)
}

export const RESOURCES = {
	'youtube': YouTubeResource,
	'twitter': TwitterResource
}