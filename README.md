# `social-components`

Social service components.

Some experiments with common social service concepts such as a "post", its data structure, maybe some React components for rendering "post"s, etc.

## Install

```
npm install social-components --save
```

This library uses `async`/`await` syntax so including `regenerator-runtime/runtime` is required when using it. In Node.js that usually means including `@babel/runtime`. In a web browser that usually means including `@babel/polyfill` (though starting from Babel `7.4.0` `@babel/polyfill` [has been deprecated](https://babeljs.io/docs/en/babel-polyfill) in favor of manually including `core-js/stable` and `regenerator-runtime/runtime`).

## Use

Currently this library is only used as a dependency of [`imageboard`](http://npmjs.com/package/imageboard) and [`webapp-frontend`](https://github.com/catamphetamine/webapp-frontend).

The [`<Post/>` React component](https://github.com/catamphetamine/webapp-frontend/blob/master/src/components/Post.js) is currently being experimented on.

## Model

* [Post](https://github.com/catamphetamine/social-components/blob/master/docs/Post/Post.md)
* [PostContent](https://github.com/catamphetamine/social-components/blob/master/docs/Post/PostContent.md)
* [PostContentTypes](https://github.com/catamphetamine/social-components/blob/master/docs/Post/PostContentTypes.md)
* [PostAttachments](https://github.com/catamphetamine/social-components/blob/master/docs/Post/PostAttachments.md)

## Services

* [YouTube](https://youtube.com) — Get video by URL or id.
* [Vimeo](https://youtube.com) — Get video by URL or id.
* [Instagram](https://instagram.com) — Get post by URL or id.
* [Twitter](https://twitter.com) — Get tweet by URL or id.

## API

### `getPostText(post: Post, options: object?): string?`

```js
import getPostText from 'social-components/commonjs/utility/post/getPostText'
```

Returns a textual representation of a [Post](https://github.com/catamphetamine/social-components/blob/master/docs/Post/Post.md)

Availble `options`:

 * `softLimit: number` — A "soft" limit on the resulting text length. "Soft" means that the resulting text may exceed the limit.
 * `messages: object?` — An object of shape `{ contentType: { audio: 'Audio', ... } }`.
 * `skipPostQuoteBlocks: boolean?` — Skip all "block" (not "inline") post quotes.
 * `skipGeneratedPostQuoteBlocks: boolean?` — Skip all autogenerated "block" (not "inline") post quotes. Is `true` by default.
 * `skipAttachments: boolean?` — Skip attachments (embedded and non-embedded). Is `true` by default.
 * `skipNonEmbeddedAttachments: boolean?` — Skip non-embedded attachments. Is `true` by default.
 * `skipUntitledAttachments: boolean?` — Skip untitled attachments (embedded and non-embedded). Is `true` by default.
 * `trimCodeBlocksToFirstLine: boolean?` — Trim code blocks to first line. Is `true` by default.
 * `stopOnNewLine: boolean?` — If `true` then the function will stop on the first "new line" character of the generated text.

### `generatePostQuote(post: Post, options: object?): string?`

```js
import generatePostQuote from 'social-components/commonjs/utility/post/generatePostQuote'
```

Generates a textual representation of a [Post](https://github.com/catamphetamine/social-components/blob/master/docs/Post/Post.md), that's intended to be used in a quote citing the post. Uses `getPostText()` under the hood: first starts with a strict set of options, then gradually relaxes them until some text is generated. Then compacts inter-paragraph margins into just "new line" characters, and trims the resulting text to fit into `options.maxLength` (given the `options.fitFactor`).

Availble `options`:

* All `getPostText()` options are passed through.
* `maxLength: number` — A limit on the resulting text length.
* `fitFactor: number?` — A "fit factor" for `maxLength`. Provides some degree of flexibility. Is `1` by default (meaning "non-flexible").

### `generatePreview(post: Post, options: object): Content?`

```js
import generatePostPreview from 'social-components/commonjs/utility/post/generatePostPreview'
```

Generates a preview for a [`Post`](https://github.com/catamphetamine/social-components/blob/master/docs/Post/Post.md) given the `options.limit`. If the post `content` is `undefined` then the returned preview content is too. Otherwise, the returned preview content isn't `undefined`. If the post `content` fits entirely then the preview content will be (deeply) equal to it. Otherwise, preview content will be a shortened version of `content` with a `{ type: 'read-more' }` marker somewhere in the end.

Availble `options`:

* `maxLength: number` — Preview content (soft) limit (in "points": for text, one "point" is equal to one character, while any other non-text content has its own "points", including attachments and new line character).
* `fitFactor: number?` — `maxLength` limit "softness" (`limit = (1 + fitFactor) * maxLength`). Is `0.2` by default.

### `trimText(text: string, maxLength: number, options: object?): string`

```js
import trimText from 'social-components/commonjs/utility/post/trimText'
```

Trims the `text`.

Availble `options`:

* `fitFactor: number?` — A "fit factor" for `maxLength`. Provides some degree of flexibility. Is `1` by default (meaning "non-flexible").
* `countNewLines: boolean?` — Set to `true` to count new lines as `30` characters. Is `false` by default.
* `trimPoint: string?` — Preferrable trim point. Can be `undefined` (default), `"sentence-end"`, `"sentence-or-word-end"`.Preferrable trim point. By default it starts with seeing if it can trim at `"sentence-end"`, then tries to trim at `"sentence-or-word-end"`, and then just trims at any point.

### `censorWords(text: string, filters: WordFilter[]): Content`

```js
import censorWords from 'social-components/commonjs/utility/post/censorWords'
```

Censors words matching the `filters` list into objects of shape `{ type: 'spoiler', censored: true, content: matchedWord }`. `filters` are compiled from word patterns via `compileWordPatterns()` described below.

### `compileWordPatterns(patterns: string[], language: string): WordFilter[]`

```js
import compileWordPatterns from 'social-components/commonjs/utility/post/compileWordPatterns'
```

Compiles word patterns into `filters` used in `censorWords()`. `language` is a lowercase two-letter [language code](https://en.wikipedia.org/wiki/IETF_language_tag). `patterns` use the usual regular expression syntax:

* `^` — Word start.
* `$` — Word end.
* `.` — Any letter.
* `[abc]` — Any single one of letters: "a", "b", "c".
* `a?` — Optional letter "a".
* `.*` — Any count of any letter.
* `.+` — One or more of any letter.
* `.{0,2}` — Zero to two of any letter.

### `loadResourceLinks(post: Post, options: object?): Promise`

```js
import loadResourceLinks from 'social-components/commonjs/utility/post/loadResourceLinks'
```

Loads "resource" links (such as links to YouTube and Twitter) by loading the info associated with the resources. For example, sets video `.attachment` on YouTube links and sets "social" `.attachment` on Twitter links.

Returns a `Promise` that resolves when all resource links have been loaded. Loading some resource links may potentially error (for example, if a YouTube video wasn't found). Even if the returned `Promise` errors due to some resource loader, the post content still may have been changed by other resource loaders.

Available `options`:

* `onContentChange: function?` — Is called on this post content change (as a result of a resource link being loaded). For example, it may re-render the post.
* `onPostContentChange(id): function?` — Is called on some other (related, "linked") post content change. The single argument is the "some other" post `.id`. For example, this function may trigger a re-render of a linked `post` when its content has been modified. Say, when a parent post's content changed and the child post has an autogenerated quote of the parent post.
* `getYouTubeVideoByUrl: function?` — Can be used for getting YouTube videos by URL from cache.
* `youTubeApiKey: (string|string[])?` — YouTube API key. If it's an array of keys then the first non-erroring one is used.
* `loadPost: function?` — This is a hacky point of customization to add some other custom resource loaders. Is used in `captchan` to fix `lynxchan` post attachment sizes and URLs.
* `contentMaxLength: number?` — If set, will re-generate `.contentPreview` if the updated `content` exceeds the limit (in "points").
* `messages: object?` — Localized labels ("Video", "Picture", etc). Has shape `{ contentType: { video: "Video", ... }, post: { videoNotFound: "Video not found" } }`.

### `expandStandaloneAttachmentLinks(post: Post)`

```js
import expandStandaloneAttachmentLinks from 'social-components/commonjs/utility/post/expandStandaloneAttachmentLinks'
```

Expands attachment links (objects of shape `{ type: 'link', attachment: ... }` into standalone attachments (block-level attachments: `{ type: 'attachment' }`). In such case attachments are moved from `{ type: 'link' }` objects to `post.attachments`.

### `visitPostParts(type: string, visit: function, content: Content): any[]`

```js
import visitPostParts from 'social-components/commonjs/utility/post/visitPostParts'
```

Calls `visit(part)` on each part of `content` being of `type` type. Returns a list of results returned by each `visit(part)`. For example, the following example prints URLs of all `{ type: 'link' }`s in a post content.

```js
visitPostParts('link', link => console.log(link.url), post.content)
```

### `YouTube.getVideoByUrl(url: string, options: object): Promise<object>`

```js
import getVideoByUrl from 'social-components/commonjs/services/YouTube/getVideoByUrl'
```

Parses a YouTube video URL, queries the video info via YouTube V3 Data API and returns a `Promise` resolving to [`{ type: 'video' }`](https://github.com/catamphetamine/social-components/blob/master/docs/Post/PostContentTypes.md#video) object.

Available `options`:

* `youTubeApiKey: string` — YouTube V3 Data API key.

### `Vimeo.getVideoByUrl(url: string): Promise<object>`

```js
import getVideoByUrl from 'social-components/commonjs/services/Vimeo/getVideoByUrl'
```

Parses a Vimeo video URL, queries the video info via HTTP REST API and returns a `Promise` resolving to [`{ type: 'video' }`](https://github.com/catamphetamine/social-components/blob/master/docs/Post/PostContentTypes.md#video) object.

### `Twitter.getTweetByUrl(url: string, options: object): Promise<object>`

```js
import getTweetByUrl from 'social-components/commonjs/services/Twitter/getTweetByUrl'
```

Parses a Vimeo video URL, queries the video info via HTTP REST API and returns a `Promise` resolving to [`{ type: 'social' }`](https://github.com/catamphetamine/social-components/blob/master/docs/Post/PostContentTypes.md#social) object.

Available `options`:

* `messages: object?` — Localized labels ("Link", "Attachment"). An object of shape `{ link: "Link", attachment: "Attachment" }`.

### `Instagram.getPostByUrl(url: string): Promise<object>`

```js
import getPostByUrl from 'social-components/commonjs/services/Instagram/getPostByUrl'
```

Parses a Vimeo video URL, queries the video info via HTTP REST API and returns a `Promise` resolving to [`{ type: 'social' }`](https://github.com/catamphetamine/social-components/blob/master/docs/Post/PostContentTypes.md#social) object.

## To do

* `source/services/YouTube/getVideo.js` and `source/services/Vimeo/getVideo.js` both use `fetch()` global function which isn't supported in Node.js. Developers using this package could optionally polyfill `fetch()` on server side (for example, see `/fetch-polyfill`).
* `source/services/Twitter/getTweet.js` and `source/services/Instagram/getPost.js` both use `fetch-jsonp` which doesn't work in Node.js. Some tests are skipped because of that (`describe.skip()`). Maybe somehow substitute `fetch-jsonp` for server side.

## License

[MIT](LICENSE)