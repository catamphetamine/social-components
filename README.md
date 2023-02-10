# `social-components`

Experimental building blocks for a generic social service.

A React implemenation is available in [`social-components-react`](https://gitlab.com/catamphetamine/social-components-react).

## Install

```
npm install social-components --save
```

## Use

Currently this library is only used as a dependency of [`imageboard`](http://npmjs.com/package/imageboard) and [`webapp-frontend`](https://gitlab.com/catamphetamine/webapp-frontend).

The [`<Post/>` React component](https://gitlab.com/catamphetamine/webapp-frontend/blob/master/src/components/Post.js) is currently being experimented on.

## Model

* [Post](https://gitlab.com/catamphetamine/social-components/blob/master/docs/Post.md)
* [Content](https://gitlab.com/catamphetamine/social-components/blob/master/docs/Content.md)
* [ContentTypes](https://gitlab.com/catamphetamine/social-components/blob/master/docs/ContentTypes.md)
* [Attachments](https://gitlab.com/catamphetamine/social-components/blob/master/docs/Attachments.md)

## Services

* [YouTube](https://youtube.com) — Get video by URL or id.
* [Vimeo](https://youtube.com) — Get video by URL or id.
* [Instagram](https://instagram.com) — Get post by URL or id.
* [Twitter](https://twitter.com) — Get tweet by URL or id.

## API

### `getPostText(post: Post, options: object?): string?`

```js
import getPostText from 'social-components/utility/post/getPostText.js'
```

Returns a textual representation of a [Post](https://gitlab.com/catamphetamine/social-components/blob/master/docs/Post.md)

Availble `options`:

 * `softLimit: number` — A "soft" limit on the resulting text length. "Soft" means that the resulting text may exceed the limit.
 * `messages: object?` — Localized labels ("Video", "Picture", etc). See [Messages](#messages).
 * `getLinkTitle?: (linkElement: object) => string?` — Formats an "untitled" link: a link for which a custom title was not set. By default, when this function is not present, links are formatted using `messages.textContent.inline.linkTo`, if it's present, or are output as the URL itself. If this function doesn't return anything then it's ignored.
 * `skipPostQuoteBlocks: boolean?` — Skip all "block" (not "inline") post quotes.
 * `skipGeneratedPostQuoteBlocks: boolean?` — Skip all autogenerated "block" (not "inline") post quotes. Is `true` by default.
 * `skipAttachments: boolean?` — Skip attachments (embedded and non-embedded). Is `true` by default.
 * `skipNonEmbeddedAttachments: boolean?` — Skip non-embedded attachments. Is `true` by default.
 * `skipUntitledAttachments: boolean?` — Skip untitled attachments (embedded and non-embedded). Is `true` by default.
 * `spaceOutParagraphs: boolean?` — Defines how text for adjacent content blocks should be concatenated. By default, it concatenates it with `\n\n`. It `spaceOutParagraphs: false` flag is passed, it concatenates the text for adjacent content blocks with `\n`.
 * `trimCodeBlocksToFirstLine: boolean?` — Trim code blocks to first line. Is `true` by default.
 * `stopOnNewLine: boolean?` — If `true` then the function will stop on the first "new line" character of the generated text.

### `getInlineContentText(content: Content, options: object?): string?`

```js
import getInlineContentText from 'social-components/utility/post/getInlineContentText.js'
```

Returns a textual representation of an [InlineContent](https://gitlab.com/catamphetamine/social-components/blob/master/docs/Content.md#inline-content). Use this function as an equivalent of `getPostText()` for inline-level content.

### `transformContent(content: Content, transform: function)`

```js
import transformContent from 'social-components/utility/post/transformContent.js'
```

Recursively walks all parts of [`content`](https://gitlab.com/catamphetamine/social-components/blob/master/docs/Content.md), calling `transform(part)` for each such part. If `transform(part)` returns:

* `undefined`, then the `part` is left unchanged, and it will recurse into the `part`'s `.content`.
* `false`, then the `part` is left unchanged, and it won't recurse into the `part`'s `.content`.
* an array, then the array is expanded in place of the `part`.
* anything else, then the `part` is substituted with that.

### `generatePostQuote(post: Post, options: object?): string?`

```js
import generatePostQuote from 'social-components/utility/post/generatePostQuote.js'
```

Generates a textual representation of a [Post](https://gitlab.com/catamphetamine/social-components/blob/master/docs/Post.md), that's intended to be used in a quote citing the post. Uses `getPostText()` under the hood: first starts with a strict set of options, then gradually relaxes them until some text is generated. Then compacts inter-paragraph margins into just "new line" characters, and trims the resulting text to fit into `options.maxLength` (adjusted by `options.minFitFactor` and `options.maxFitFactor`).

Availble `options`:

* All `getPostText()` options are passed through.
* `maxLength: number` — A limit on the resulting text length.
* `minFitFactor: number?` — Provides some flexibility when defining `maxLength` lower boundary. See `minFitFactor` option of `trimText()`.
* `maxFitFactor: number?` — Provides some flexibility when defining `maxLength` upper boundary. See `maxFitFactor` option of `trimText()`.
* `getCharactersCountPenaltyForLineBreak?: ({ textBefore: string }) => number` — See `getCharactersCountPenaltyForLineBreak` option of `trimText()`.
* `trimMarkEndOfLine: string?` — See `trimMarkEndOfLine` option of `trimText()`.
* `trimMarkEndOfSentence: string?` — See `trimMarkEndOfSentence` option of `trimText()`.
* `trimMarkEndOfWord: string?` — See `trimMarkEndOfWord` option of `trimText()`.
* `trimMarkAbrupt: string?` — See `trimMarkAbrupt` option of `trimText()`.

### `generatePreview(post: Post, options: object): Content?`

```js
import generatePostPreview from 'social-components/utility/post/generatePostPreview.js'
```

Generates a preview for a [`Post`](https://gitlab.com/catamphetamine/social-components/blob/master/docs/Post.md) given the `options.limit`. If the post `content` is `undefined` then the returned preview content is too. Otherwise, the returned preview content isn't `undefined`. If the post `content` fits entirely then the preview content will be (deeply) equal to it. Otherwise, preview content will be a shortened version of `content` with a `{ type: 'read-more' }` marker somewhere in the end.

Available `options`:

* `maxLength: number` — Preview content (soft) limit (in "points": for text, one "point" is equal to one character, while any other non-text content has its own "points", including attachments and new line character).
* `minFitFactor: number?` — Provides some flexibility when defining `maxLength` lower boundary: sets it to `minFitFactor * maxLength`. The content then can usually be trimmed anywhere between `minFitFactor * maxLength` and `maxFitFactor * maxLength`. Is `0.75` by default.
* `maxFitFactor: number?` — Provides some flexibility when defining `maxLength` upper boundary: sets it to `maxFitFactor * maxLength`. The content then can usually be trimmed anywhere between `minFitFactor * maxLength` and `maxFitFactor * maxLength` limit. Is `1.2` by default.
* `textTrimMarkEndOfWord: string?` — Appends this "trim mark" when text has to be trimmed after word end (but not after sentence end). Is "…" by default.
* `textTrimMarkAbrupt: string?` — Appends this "trim mark" when text has to be trimmed mid-word. Is "…" by default.
* `minimizeGeneratedPostLinkBlockQuotes: boolean?` — Set to `true` to indicate that post links with generated block quotes are initially minimized when rendered: this results in skipping counting those post links' content characters when generating post preview.

### `trimText(text: string, maxLength: number, options: object?): string`

```js
import trimText from 'social-components/utility/post/trimText.js'
```

Trims the `text` at `maxLength`.

Available `options`:

* `minFitFactor: number?` — Provides some flexibility when defining `maxLength` lower boundary: sets it to `minFitFactor * maxLength`. The content then can usually be trimmed anywhere between `minFitFactor * maxLength` and `maxFitFactor * maxLength`. Is `1` by default, meaning "no effect".
* `maxFitFactor: number?` — Provides some flexibility when defining `maxLength` upper boundary: sets it to `maxFitFactor * maxLength`. The content then can usually be trimmed anywhere between `minFitFactor * maxLength` and `maxFitFactor * maxLength` limit. Is `1` by default, meaning "no effect".
* `getCharactersCountPenaltyForLineBreak?: ({ textBefore: string }) => number` — Returns characters count equivalent for a "line break" (`\n`) character. The idea is to "tax" multi-line texts when trimming by characters count. By default, having `\n` characters in text is not penalized in any way and those characters aren't counted.
* `trimPoint: string?` — Preferrable trim point. Can be `undefined` (default), `"sentence-end"`, `"sentence-or-word-end"`.Preferrable trim point. By default it starts with seeing if it can trim at `"sentence-end"`, then tries to trim at `"sentence-or-word-end"`, and then just trims at any point.
* `trimMarkEndOfLine: string?` — "Trim mark" when trimming at the end of a line. Is "" (no trim mark) by default.
* `trimMarkEndOfSentence: string?` — "Trim mark" when trimming at the end of a sentence. Is "" (no trim mark) by default.
* `trimMarkEndOfWord: string?` — "Trim mark" when trimming at the end of a word. Is " …" by default.
* `trimMarkAbrupt: string?` — "Trim mark" when trimming mid-word. Is "…" by default.

### `censorWords(text: string, filters: WordFilter[]): Content`

```js
import censorWords from 'social-components/utility/post/censorWords.js'
```

Replaces words in `text` matching the `filters` with objects of shape `{ type: "spoiler", censored: true, content: "the-word-that-got-censored" }`. The `filters: WordFilter[]` argument must be a list of word filters pre-compiled with the exported `compileWordPatterns(censoredWords, language)` function (described below).

```js
const FILTERS = compileWordPatterns(['red', 'brown', 'orange'], 'en')

censorWords('A red fox', FILTERS) === [
  'A ',
  { type: 'spoiler', censored: true, content: 'red' }
  ' fox'
 ]
```

### `compileWordPatterns(patterns: string[], language: string): WordFilter[]`

```js
import compileWordPatterns from 'social-components/utility/post/compileWordPatterns.js'
```

Compiles word patterns into `filters` that can be used in `censorWords()`.

Arguments:

* `patterns: string[]` — An array of `string` word patterns. The standard regular expression syntax applies, `^` meaning "word start", `$` meaning "word end", `.` meaning "any letter", etc.

* `language: string` — A lowercase two-letter [language code](https://en.wikipedia.org/wiki/IETF_language_tag) (examples: `"en"`, `"ru"`, `"de"`) that is used to generate a regular expression for splitting text into individual words.

Word pattern syntax:

* `^` — Word start.
* `$` — Word end.
* `.` — Any letter.
* `[abc]` — Any single one of letters: "a", "b", "c".
* `a?` — Optional letter "a".
* `.*` — Any count of any letter.
* `.+` — One or more of any letter.
* `.{0,2}` — Zero to two of any letter.

Word pattern examples:

* `^mother.*` — Matches `"mothercare"` and `"motherfather"`.

* `^mother[f].*` — Matches `"motherfather"` but not `"mothercare"`.

* `^mother[^f].*` — Matches `"mothercare"` but not `"motherfather"`.

* `^cock$` — Matches `"cock"` in `"my cock is big"` but won't match `"cocktail"` or `"peacock"`.

* `cock` — Matches `"cock"`, `"cocktail"` and `"peacock"`.

* `cock$` — Matches `"cock"` and `"peacock"` but not `"cocktail"` .

* `^cocks?` — Matches `"cock"` and `"cocks"`.

* `^cock.{0,3}` — Matches `"cock"`, `"cocks"`, `"cocker"`, `"cockers"`.

### `loadResourceLinks(post: Post, options: object?): Promise`

```js
import loadResourceLinks from 'social-components/utility/post/loadResourceLinks.js'
```

Loads "resource" links (such as links to YouTube and Twitter) by loading the info associated with the resources. For example, sets video `.attachment` on YouTube links and sets "social" `.attachment` on Twitter links.

Returns an object having a `cancel()` function and a `promise` property. Calling `stop()` function prevents `loadResourceLinks()` from making any further changes to the `post` object. Calling `cancel()` function multiple times or after the `promise` has finished doesn't have any effect. The `promise` is a `Promise` that resolves when all resource links have been loaded. Loading some links may potentially error (for example, if a YouTube video wasn't found). Even if the returned `Promise` errors due to some resource loader, the post content still may have been changed by other resource loaders.

Available `options`:

* `onContentChange: function?` — Is called on this post content change (as a result of a resource link being loaded). For example, it may re-render the post.
<!-- * `onReplyUpdate(id): function?` — When a resource link gets loaded, the post `content` gets updated, and if there're any "replies" to this comment that have "autogenerated" quotes of this comment in their `content`, then those autogenerated quotes get automatically re-generated and those replies' `content` gets updated as a result. And if those replies themselves do have their own replies that have "autogenerated" quotes, then the process repeats recursively. After it finishes, it calls `onReplyUpdate(id)` for each of the affected "descendant" replies so that they could be re-rendered. -->
* `getYouTubeVideoByUrl: function?` — Can be used for getting YouTube videos by URL from cache.
* `youTubeApiKey: (string|string[])?` — YouTube API key. If it's an array of keys then the first non-erroring one is used.
* `loadPost: function?` — This is a hacky point of customization to add some other custom resource loaders. Is used in `captchan` to fix `lynxchan` post attachment sizes and URLs.
* `contentMaxLength: number?` — If set, will re-generate `.contentPreview` if the updated `content` exceeds the limit (in "points").
* `messages: object?` — Localized labels for resource loading. This is not the same thing as [Messages](#messages). This is an object having shape:
  * `videoNotFound?: string` — When loading YouTube video links, if the video was not found, it sets the link's `content` to this text. Example: `"Video not found"`.
* `minimizeGeneratedPostLinkBlockQuotes: boolean?` — See the description of the same option of `generatePostPreview()`.

### `expandStandaloneAttachmentLinks(content: Content)`

Expands attachment links (objects of shape `{ type: 'link', attachment: ... }` into standalone attachments (block-level attachments: `{ type: 'attachment' }`).

<!-- In such case attachments are moved from `{ type: 'link' }` objects to `post.attachments`. -->

```js
import expandStandaloneAttachmentLinks from "social-components/utility/post/expandStandaloneAttachmentLinks"

const content = [
	[
		"See ",
		{
			type: "link",
			attachment: {
				type: "video",
				video: ...
			}
		},
		" for more info."
	]
]

expandStandaloneAttachmentLinks(content)

content === [
	[
		"See "
	],
	{
		type: "attachment",
		attachment: {
			type: "video",
			video: ...
		}
	},
	[
		" for more info."
	]
]
```

### `visitPostParts(type: string, visit: function, content: Content): any[]`

```js
import visitPostParts from .js'social-components/utility/post/visitPostParts.js'
```

Calls `visit(part)` on each part of `content` being of `type` type. Returns a list of results returned by each `visit(part)`. For example, the following example prints URLs of all `{ type: 'link' }`s in a post content.

```js
visitPostParts('link', link => console.log(link.url), post.content)
```

### `trimContent(content: Content, options: object?): Content?`

```js
import trimContent from 'social-components/utility/post/trimContent.js'
```

Trims whitespace (including newlines) in the beginning and in the end of `content`. **`content` internals will be mutated.** Returns the mutated `content` (the original `content` still gets mutated). Returns `undefined` if `content` became empty as a result of the trimming.

Available options:

* `left: boolean` — Pass `left: false` to prevent it from trimming on the left side.
* `right: boolean` — Pass `right: false` to prevent it from trimming on the right side.

```js
trimContent([['\n', ' Text '], ['\n']]) === [['Text']]
```

### `trimInlineContent(inlineContent: InlineContent, options: object?): InlineContent?`

```js
import trimInlineContent from 'social-components/utility/post/trimInlineContent.js'
```

Trims whitespace (including newlines) in the beginning and in the end of `content`. `content` must be an array. **`content` internals will be mutated.** Returns the mutated `content` (the original `content` still gets mutated). Returns `undefined` if `content` became empty as a result of the trimming.

Available options:

* `left: boolean` — Pass `left: false` to prevent it from trimming on the left side.
* `right: boolean` — Pass `right: false` to prevent it from trimming on the right side.

```js
trimInlineContent(['\n', { type: 'text', content: ' Text ' }, '\n'])
  === [{ type: 'text', content: 'Text' }]
```

### `YouTube.getVideoByUrl(url: string, options: object): Promise<object>`

```js
import getVideoByUrl from 'social-components/services/YouTube/getVideoByUrl.js'
```

Parses a YouTube video URL, queries the video info via YouTube V3 Data API and returns a `Promise` resolving to [`{ type: 'video' }`](https://gitlab.com/catamphetamine/social-components/blob/master/docs/ContentTypes.md#video) object.

Available `options`:

* `youTubeApiKey: string` — YouTube V3 Data API key.

Some additional YouTube utilities:

```js
// The list of possible YouTube preview picture ("thumbnail") sizes.
import { PREVIEW_PICTURE_SIZES } from 'social-components/services/YouTube/getVideo.js'
PREVIEW_PICTURE_SIZES[0] === {
  name: 'maxresdefault',
  width: 1280,
  height: 720
}

// Returns a URL of a YouTube video's preview picture ("thumbnail").
import { getPictureSizeUrl } from 'social-components/services/YouTube/getVideo.js'
getPictureSizeUrl(videoId, size.name)

// Returns a YouTube video URL.
import getVideoUrl from 'social-components/services/YouTube/getVideoUrl.js'
getVideoUrl(videoId, { startAt }?)

// Returns a URL for an embedded YouTube video.
// Can be used for embedding a video on a page via an `<iframe/>`.
import getEmbeddedVideoUrl from 'social-components/services/YouTube/getEmbeddedVideoUrl.js'
getEmbeddedVideoUrl(videoId, { autoPlay, startAt }?)
```

### `Vimeo.getVideoByUrl(url: string): Promise<object>`

```js
import getVideoByUrl from 'social-components/services/Vimeo/getVideoByUrl.js'
```

Parses a Vimeo video URL, queries the video info via HTTP REST API and returns a `Promise` resolving to [`{ type: 'video' }`](https://gitlab.com/catamphetamine/social-components/blob/master/docs/ContentTypes.md#video) object.

Some additional Vimeo utilities:

```js
// Returns a Vimeo video URL.
import getVideoUrl from 'social-components/services/Vimeo/getVideoUrl.js'
getVideoUrl(videoId)

// Returns a URL for an embedded Vimeo video.
// Can be used for embedding a video on a page via an `<iframe/>`.
import getEmbeddedVideoUrl from 'social-components/services/Vimeo/getEmbeddedVideoUrl.js'
getEmbeddedVideoUrl(videoId, { color, autoPlay, loop }?)
```

### `Twitter.getTweetByUrl(url: string, options: object): Promise<object>`

```js
import getTweetByUrl from 'social-components/services/Twitter/getTweetByUrl.js'
```

Parses a Vimeo video URL, queries the video info via HTTP REST API and returns a `Promise` resolving to [`{ type: 'social' }`](https://gitlab.com/catamphetamine/social-components/blob/master/docs/ContentTypes.md#social) object.

Available `options`:

* `messages: object?` — Localized labels ("Video", "Picture", etc). See [Messages](#messages).

### `Instagram.getPostByUrl(url: string): Promise<object>`

```js
import getPostByUrl from 'social-components/services/Instagram/getPostByUrl.js'
```

Parses a Vimeo video URL, queries the video info via HTTP REST API and returns a `Promise` resolving to [`{ type: 'social' }`](https://gitlab.com/catamphetamine/social-components/blob/master/docs/ContentTypes.md#social) object.

## Miscellaneous API

### `unescapeContent(string: string): string`

```js
import unescapeContent from 'social-components/utility/unescapeContent.js'
```

Unescapes HTML-escaped text.

```js
unescapeContent("&lt;div/&gt;") === "<div/>"
```

### `getColorHash(string: string): string`

```js
import getColorHash from 'social-components/utility/getColorHash.js'
```

Converts a string to a color.

```js
getColorHash("Some text") === "#aabbcc"
```

### `getHumanReadableLinkAddress(url: string): string`

```js
import getHumanReadableLinkAddress from 'social-components/utility/getHumanReadableLinkAddress.js'
```

Returns a more human-friendly link address:

* Strips "http(s):" protocol.
* Strips the "www." part.
* Removes trailing slash.

### `getContentBlocks(post: Post): any[]`

```js
import getPostThumbnailAttachment from 'social-components/utility/post/getContentBlocks.js'
```

Returns a list of ["content blocks"](https://gitlab.com/catamphetamine/social-components/blob/master/docs/Content.md#content-block) of the `post`'s `.content`. For example, if the `post`'s `.content` is just a string, then it returns an array of that string. Returns an empty array if the `post` has no content.

### `removeLeadingPostLink(post: Post, postLinkTest: (any|function))`

Removes a leading `post-link`, that satisfies the conditions, from the `post`'s `.content`. Can be used to remove parent post quotes from replies when showing the parent post's replies tree.

The `postLinkTest` argument should be the condition for removing a post link: either a post id or a function that returns `true` when the post link should be removed.

```js
import removeLeadingPostLink from 'social-components/utility/post/removeLeadingPostLink.js'

comment.replies = comment.replies.map((reply) => {
	return removeLeadingPostLink(reply, comment.id)
	// Or, the same:
	// return removeLeadingPostLink(reply, (postLink) => postLink.postId === comment.id)
})
```

### `getPostThumbnailAttachment(post: Post, options: object?): Attachment?`

```js
import getPostThumbnailAttachment from 'social-components/utility/post/getPostThumbnailAttachment.js'
```

Returns an attachment that could be used as a "thumbnail" for this post. For example, could return a `Picture` or a `Video`.

Available options:

* `showPostThumbnailWhenThereAreMultipleAttachments` — Pass `true` to allow returning post thumbnail in cases when the `post` has multiple thumbnail-able attachments. By default, if the `post` has multiple thumbnail-able attachments, none of them will be returned.

* `showPostThumbnailWhenThereIsNoContent` — Pass `true` to allow returning post thumbnail in cases when the `post` has no `content`. By default, if the `post` has no `content`, no post thumbnail will be returned.

### `getPicturesAndVideos(attachments: Attachment[]): Attachment[]`

```js
import getPicturesAndVideos from 'social-components/utility/post/getPicturesAndVideos.js'
```

Returns `Picture`s and `Video`s.

### `getMinSize(picture: Picture): object`

```js
import getPicturesAndVideos from 'social-components/utility/picture/getMinSize.js'
```

Returns the minimum "size" of a `picture`, "size" being an object of shape: `{ width: number, height: number, url: string }`.

### `getNonEmbeddedAttachments(post: Post): Attachment[]`

```js
import getNonEmbeddedAttachments from 'social-components/utility/post/getNonEmbeddedAttachments.js'
```

Returns a list of post attachments that aren't embedded in the `post`'s `.content`.

### `getSortedAttachments(post: Post): Attachment[]?`

```js
import getSortedAttachments from 'social-components/utility/post/getSortedAttachments.js'
```

Sorts post attachments in the order they appear embedded in the `post`, plus all the rest of them that aren't embedded in the `post`, sorted by thumbnail height descending.

Returns `undefined` if the `post` doesn't have any attachments.

### `getEmbeddedAttachment(block: ContentBlock, attachments: Attachment[]?): Attachment?`

```js
import getEmbeddedAttachment from 'social-components/utility/post/getEmbeddedAttachment.js'
```

Returns an `Attachment` object for an embedded attachment block.

### `hasPicture(attachment: Attachment): boolean?`

```js
import hasPicture from 'social-components/utility/attachment/hasPicture.js'
```

Returns `true` if the `attachment` has a picture. Examples: `Picture`, `Video`.

### `getThumbnailSize(attachment: Attachment): object?`

```js
import getThumbnailSize from 'social-components/utility/attachment/getThumbnailSize.js'
```

Returns the `attachment`'s thumbnail size. Returns `undefined` if the `attachment` doesn't have a thumbnail.

### `createLink(url: string, content: string?): object`

```js
import createLink from 'social-components/utility/post/createLink.js'
```

Creates a [`link`](https://gitlab.com/catamphetamine/social-components/blob/master/docs/Content.md#post-link) object from a link's URL (`url`) and a link's text (`content`). The `link` object can additionally have a `service: string` property (example: `"youtube"`).

The `url` will be parsed to see if a `service` can be detec For example, a YouTube video URL will be parsed and the resulting `link` will have `service` set to `"youtube"` and `content` set to the video ID, and a YouTube icon could then be shown before the link's `content` when the link is rendered (or, if there's no icon for a `service`, a simple `${service}:` prefix could be prepended to it).

### `getMimeType(url: string): string?`

```js
import getMimeType from 'social-components/utility/getMimeType.js'
```

Returns a [MIME type](https://en.wikipedia.org/wiki/Media_type) by file URL (or filesystem path, or filename). Basically, looks at the file extension. Returns `undefined` if the MIME type couldn't be determined.

### `combineQuotes(content: Content)`

```js
import combineQuotes from 'social-components/utility/post/combineQuotes.js'
```

Combines `{ type: "quote" }` objects on consequtive lines into a single `{ type: "quote" }` object with `"\n"`s inside. **Mutates the original `content`**.

### `findContentPart(content: Content, test: function, options: object?): number[]?`

```js
import findContentPart from 'social-components/utility/post/findContentPart.js'
```

Recursively searches `content` for the parts for which the `test(part)` function returns `true`. Returns an "index path" (an array of recursive content part indexes, like a path in a "tree").

The `test` function should be a:

```
function(
	part: (string|object),
	{ getNextPart }
): boolean?
```

Available options:

* `backwards: boolean` — Pass `true` to search from the end to the start of the `content`.
<!-- * `text: boolean` — Pass `true` to only call `test()` on "textual" parts of the `content`. -->

### `splitContent(content: Content, indexPath: number[], options: object?): Content[]`

```js
import splitContent from 'social-components/utility/post/splitContent.js'
```

Splits `content` by an `indexPath` path into two parts: a `leftPart: Content` and a `rightPart: Content`. An `indexPath` of a certain part of `content` could be obtained via `findContentPart()` function.

### `renderTweet(tweetId: string, container: Element, options: object?)`

```js
import renderTweet from 'social-components/Twitter/renderTweet.js'
```

Renders a tweet in a `container`.

Available options:

* `darkMode: boolean` — Pass `true` to render the tweet in dark mode.
* `locale: string` — Viewer's [language code](https://en.wikipedia.org/wiki/IETF_language_tag) (examples: `"en"`, `"ru"`, `"de"`).

### Messages

Messages is an object with localized labels having shape:

* `textContent?: object`
  * `block?: object`
	  * `audio?: string` — `"Audio"`
	  * `video?: string` — `"Video"`
	  * `picture?: string` — `"Picture"`
	  * `attachment?: string` — `"Attachment"`
	* `inline?: object`
	  * `attachment?: string` — `"(attachment)"`
	  * `link?: string` — `"(link)"`
	  * `linkTo?: string` — `"(link to {domain})"`
	    <!-- * An "external" URL is an "absolute" URL — a URL with a domain name. -->
	    * Parameters:
	      * `{domain}` — URL domain name.
	      <!-- * `{path}` — URL path. An empty string when not present or when equal to `"/"`. -->
	  <!--
	  * `linkToInternalUrl?: string` — `"{path}"`
	    * An "internal" URL is a "relative" URL — a URL with no domain name.
	    * Parameters:
	      * `{path}` — URL path. `"/"` when not present.
	  -->

## To do

* `source/services/YouTube/getVideo.js` and `source/services/Vimeo/getVideo.js` both use `fetch()` global function which isn't supported in Node.js. Developers using this package could optionally polyfill `fetch()` on server side (for example, see `/fetch-polyfill`).
* `source/services/Twitter/getTweet.js` and `source/services/Instagram/getPost.js` both use `fetch-jsonp` which doesn't work in Node.js. Some tests are skipped because of that (`describe.skip()`). Maybe somehow substitute `fetch-jsonp` for server side.

## GitHub Ban

On March 9th, 2020, GitHub, Inc. silently [banned](https://medium.com/@catamphetamine/how-github-blocked-me-and-all-my-libraries-c32c61f061d3) my account (erasing all my repos, issues and comments) without any notice or explanation. Because of that, all source codes had to be promptly moved to GitLab. The [GitHub repo](https://github.com/catamphetamine/social-components) is now only used as a backup (you can star the repo there too), and the primary repo is now the [GitLab one](https://gitlab.com/catamphetamine/social-components). Issues can be reported in any repo.

## License

[MIT](LICENSE)