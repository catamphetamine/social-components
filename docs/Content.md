# Content

#### HTML analogy

Contents of a `<body/>`

#### Definition

A "content" of an abstract "document" is one of:

* a [Text](#text) — For most simple cases.
* a list of ["block elements"](#block-element) — For anything that's not covered by the most simple case of just text. In those cases, "content" must have a proper structure being a list of "blocks".

## Block element

#### HTML analogy

* `<div/>`
* `<ul/>`
* `<pre/>`
* `<video/>`
* `<img style="display: block"/>`
* `<p/>`

#### Definition

A "Content block" is one of:

* ["Inline content"](#inline-content) — Also called a "paragraph" when it represents a "block element".
* ["Block" element](#block-elements) — Anything that's neither a "paragraph" nor a part of it. Examples: an "embedded" picture, an "embedded" video, a list of items, a block of code, etc.

## Inline content

#### HTML analogy

* `Just text`
* `Some <b>bold</b> or <i>italic</i> text`

#### Definition

"Inline content" is one of:

* [Text](#text)
* A list of [inline elements](#inline-elements)

## Inline elements

### Text

```js
"Test"
```

### Styled text

```js
{
  type: "text",
  style: "...",
  content: InlineContent
}
```

Possible `style`:

* `"bold"`
* `"italic"`
* `"underlined"`
* `"strikethrough"`
* `"subscript"`
* `"superscript"`

### New line

```js
"\n"
```

A standalone `"\n"` string. Acts same way as a `<br/>` tag in HTML.

### Emoji

```js
{
  type: "emoji",
  name: "...",
  url: "..."
}
```

Can be used for representing non-text (picture) emojis.

### Quote (inline)

```js
{
  type: "quote",

  content: InlineContent,
  contentGenerated: boolean?,

  // "Advanced" properties.
  kind: string?,
  block: boolean?
}
```

Represents an "inline" quote.

"Advanced" properties:

* `kind` — Is sometimes used in "imageboards" like `8ch.net` which might have both regular quotes (`> Text`) and "inverse" quotes (`< Text`).
* `block` — Is used in "imageboards". Setting it to `true` means "emulate block quote appearance while being an inline quote". So setting `block` to `true` doesn't turn an "inline element" of a quote into a "block element" and is purely presentational: `block: true` quotes would still require putting an `"\n"` after them.

### Inline spoiler

```js
{
  type: "spoiler",
  content: InlineContent,
  censored: boolean?
}
```

Represents a piece of content that should be put under a "spoiler".

* `censored` property is for cases when an app autogenerates an inline spoiler to censor certain words (like "swear" words).

### Post link

```js
{
  type: "post-link",
  url?: "...",
  meta: {
    // (required)
    // Any properties that describe the linked post:
    // post ID, thread ID, channel ID, etc.
  },
  content: InlineContent
}
```

Represents a link to a post.

For example, when post B is a reply to post A, post B's `content` should contain a `post-link` to post A with the `content` being the quoted part of post A's `content`.

#### Example

On "imageboards", the way to quote a post is by writing `>>PostId`. Such quoted post ids can be parsed by "viewer" app into `post-link` elements.

Message text example:

```
>>12345
> as said in the document
what document?
```

Parsed content example:

```js
[
  {
    type: 'post-link',
    url: '/b/123#12345',
    meta: {
      boardId: 'b',
      threadId: 123,
      commentId: 12345
    },
    content: [{
      type: 'quote',
      content: 'as said in the document'
    }]
  },
  'what document?'
]
```

#### Quote content

* If a `post-link`'s `content` is an array and its first element is a `quote` then such `post-link`'s `content` can only have `quote`s separated by `"\n"`s.

* If a `post-link` quote hasn't been specified by the user when composing a message then such `post-link` quote is usually autogenerated, in which case each `quote` will have `contentGenerated: true` flag.

```js
{
  type: "post-link",
  url: "...",
  content: [{
    type: "quote",
    content: "...",
    contentGenerated: true
  }]
}
```

* If the first `quote` of a `post-link` has `contentGenerated: true` flag then it means that all `quote`s of such `post-link` are autogenerated.

### Link

```js
{
  type: "link",
  url: "...",
  service: String?,
  attachment: Attachment?,
  content: InlineContent,
  contentGenerated: boolean?
}
```

Represents a hyperlink.

* `service` can be set to define a "service" that the link corresponds to. Examples: `"youtube"`, `"twitter"`, etc.
  * For example, there's a `createLink(url, content)` exported function: it creates a link object from a `url` and `content` (basically, link title). Such link objects will also have a `service` property set if a "service" was detected from the `url`.
  * Another example is a [function](https://gitlab.com/catamphetamine/social-components/blob/master/utility/post/YouTubeResource.js) for parsing a YouTube video URL into a link object: the resulting `link` will have `service` set to `"youtube"` and `content` set to the video ID.

* `attachment` property could be set in cases when a link has an attachment associated with it. For example, a YouTube video link may have `content` with the title of the video and `attachment` being a [`Video`](#video).

* Sometimes a link is parsed from a URL an in such cases `content` is autogenerated from the URL and `contentGenerated: true` flag is set.

### Code (inline)

```js
{
  type: "code",
  language: String?,
  content: InlineContent
}
```

A piece of code.

* `language` is a "programming language" which can be specified for syntax highlighting.

### Read more (inline)

A "Read more" button that is placed in the same paragraph as the trimmed text. Is autogenerated when generating post previews for long posts.

```js
{
  type: "read-more"
}
```

## Block elements

### Heading

```js
{
  type: "heading",
  content: InlineContent
}
```

### List

```js
{
  type: "list",
  items: InlineContent[]
}
```

### Code (block)

```js
{
  type: "code",
  language: String?,
  content: InlineContent
}
```

A block of code.

* `language` is a "programming language" which can be specified for syntax highlighting.

### Quote (block)

```js
{
  type: "quote",
  url: string?,
  source: string?,
  contentGenerated: boolean?,
  content: InlineContent
}
```

Represents a standalone quote.

* `source` can be a website name or an author's name.

### Attachment

[Attachments](https://gitlab.com/catamphetamine/social-components/tree/master/docs/Attachment.md) can be embedded in a post.

An attachment can be embedded either by its `id` or directly:

```js
{
  type: "attachment",
  // `attachmentId` is the `id` of the attachment in `post.attachments`.
  attachmentId: number
}
```

```js
{
  type: "attachment",
  // An attachment that's embedded directly rather than by its `id`.
  attachment: {
    type: "picture",
    picture: {
      type: "image/jpeg",
      width: 480,
      height: 360,
      url: "https://some/picture.png"
    }
  }
}
```

Attachment embedding options:

<!--
* `align` — Pass `"left"`/`"center"`/`"right"` to align a picture/video horizontally. The default is `"center"`.

```js
{
  type: "attachment",
  align: "left",
  attachment: {
    type: "picture",
    picture: ...
  }
}
```
-->

<!--
* `maxHeight` — Pass a value in pixels (example: `123`) to limit the height of a picture/video. Pass `"none"` to set no limits on the height of a picture/video. By default, a picture/video's height is limited by some default `maxHeight`.

```js
{
  type: "attachment",
  align: "center",
  maxHeight: "none",
  attachment: {
    type: "picture",
    picture: ...
  }
}
```
-->

* `expand` — Pass `true` to expand a picture/video to the page's full width.

```js
{
  type: "attachment",
  expand: true,
  attachment: {
    type: "picture",
    picture: ...
  }
}
```

* `border` — Pass `false` to opt out of showing a border around a picture.

* `link` — Can be used to wrap a picture in a hyperlink.

```js
{
  type: "attachment",
  link: "https://domain.com",
  attachment: {
    type: "picture",
    picture: ...
  }
}
```

### Read more (block)

A "Read more" button that is placed in its own paragraph.

```js
{
  type: "read-more"
}
```