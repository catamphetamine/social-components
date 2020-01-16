import cloneDeep from 'lodash/cloneDeep'

import loadYouTubeLinks from './loadYouTubeLinks'
import loadTwitterLinks from './loadTwitterLinks'
import expandStandaloneAttachmentLinks from './expandStandaloneAttachmentLinks'
import generatePostPreview from './generatePostPreview'

import resolvePromises from '../resolvePromises'

/**
 * Loads "resource" links (such as links to YouTube and Twitter)
 * by loading the info associated with the resources.
 * For example, sets video `.attachment` on YouTube links
 * and sets "social" `.attachment` on Twitter links.
 * @param  {object} post
 * @param  {function} [options.onContentChange] — Is called on this post content change (as a result of a resource link being loaded). For example, it may re-render the post.
 * @param  {function} [options.onPostContentChange] — Is called on some other (related, "linked") post content change. The single argument is the "some other" post id. For example, this function may trigger a re-render of a linked `post` when its content has been modified. Say, when a parent post's content changed and the child post has an autogenerated quote of the parent post.
 * @param  {function} [options.getYouTubeVideoByUrl] — Can be used for getting YouTube videos by URL from cache.
 * @param  {(string|string[])} [options.youTubeApiKey] — YouTube API key. If it's an array of keys then the first non-erroring one is used.
 * @param  {function} [options.loadPost] — This is a hacky point of customization to add some other custom resource loaders. Is used in `captchan` to fix `lynxchan` post attachment sizes and URLs.
 * @param  {number} [options.contentMaxLength] — If set, will re-generate `.contentPreview` if the updated `content` exceeds the limit (in "points").
 * @param  {object} [options.messages] — Localized labels ("Video", "Picture", etc). Has shape `{ contentType: { video: "Video", ... }, post: { videoNotFound: "Video not found" } }`.
 * @return {Promise} A `Promise` that resolves when all resource links have been loaded. Loading some links may potentially error (for example, if a YouTube video wasn't found). Even if the returned `Promise` errors due to some resource loader, the post content still may have been changed by other resource loaders.
 */
export default function loadResourceLinks(post, {
	onPostContentChange,
	getYouTubeVideoByUrl,
	youTubeApiKey,
	messages,
	onContentChange,
	contentMaxLength,
	loadPost
}) {
	// Clone the post so that the original `post` is only
	// changed after the modified post has rendered.
	const postWithLinksExpanded = clonePost(post)
	let promises = [
		loadTwitterLinks(postWithLinksExpanded.content, {
			messages: messages && messages.contentType
		}),
		loadYouTubeLinks(postWithLinksExpanded.content, {
			getVideoByUrl: getYouTubeVideoByUrl,
			youTubeApiKey,
			messages: messages && messages.post
		})
	]
	// This is a point of customization to add some other custom resource loaders.
	// Is used in `captchan` to fix `lynxchan` post attachment sizes and URLs.
	if (loadPost) {
		promises = promises.concat(loadPost(postWithLinksExpanded))
	}
	function updatePostObject(newPost) {
		post.content = newPost.content
		post.contentPreview = newPost.contentPreview
		post.attachments = newPost.attachments
		// Each `post` could have an `.onContentChange()` function, for example,
		// to update autogenerated quotes in all replies to this comment:
		// for each `post.replies` it would update all `post-link`s
		// to the parent comment with the newly generated content.
		// This feature is used in `captchan` on thread pages.
		// This would update the replies' data but not re-render them:
		// re-rendering replies is done by `onPostContentChange(id)`.
		if (post.onContentChange) {
			for (const id of post.onContentChange()) {
				// Since the replies' autogenerated quotes have been re-generated
				// they're now required to be re-rendered. That's what `onPostContentChange(id)`
				// function does: it re-renders each such reply by its `id`.
				// `post.onContentChange()` is supposed to take care of updating the entire replies tree,
				// so there's no `reply.onContentChange()` recursion here.
				if (onPostContentChange) {
					onPostContentChange(id)
				}
			}
		}
	}
	const updatePost = (post) => {
		// Expand attachment links (objects of shape `{ type: 'link', attachment: ... }`)
		// into standalone attachments (block-level attachments: `{ type: 'attachment' }`).
		// In such case attachments are moved from `{ type: 'link' }` objects to `post.attachments`.
		expandStandaloneAttachmentLinks(post)
		// Re-generate post content preview (because post content has changed).
		post.contentPreview = generatePostPreview(post, {
			maxLength: contentMaxLength
		})
		// Snapshot the `post` in its current state for re-rendering
		// because other resource loaders will be modifying `post` too.
		// (`content` will be modified and new `attachments` will be added)
		post = clonePost(post)
		// Update the post in state.
		updatePostObject(post)
		// Re-render the post after it has been updated.
		// There will be a short delay between the post being updated in state
		// and it being re-rendered on screen. This could result in `virtual-scroller`
		// measuring the DOM element height of the previous `post` render
		// if the `post` being updated has just been scrolled off the screen
		// resulting in it being no longer rendered and so the next time it's rendered
		// the `virtual-scroller` items list would "jump" because now it will be
		// rendered with the new `post` data and its height will be different.
		// This edge case though is a very rare one (could be said to be "very unlikely to happen")
		// so I guess it can be ignored and won't result in any UX issues.
		onContentChange(post)
	}
	// Perhaps loading "service" links could be paralleled.
	// For example, if YouTube links load first then render them first.
	// Then, twitter links load, and render them too.
	return resolvePromises(promises, (foundSomething) => {
		// Intermediary updates.
		if (foundSomething) {
			updatePost(postWithLinksExpanded)
		}
	})
}

/**
 * Clones a post so that the original post content
 * could be modified and new attachments added
 * without affecting the snapshot.
 * Doesn't use straight `cloneDeep(post)`
 * just because I prefer keeping cloned properties explicit.
 * @param  {object} post
 * @return {object}
 */
function clonePost(post) {
	return {
		// `contentPreview` will be re-generated
		// so it's copied "by reference".
		...post,
		// `content` will be changed at arbitrary deep levels
		// so it's cloned deeply.
		content: cloneDeep(post.content),
		// New attachments will be added
		// so `attachments` are copied "shallowly".
		attachments: post.attachments && post.attachments.slice()
	}
}