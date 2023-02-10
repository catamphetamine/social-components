# Document

An abstract "document" could be:

* An article or a blog post.
* A comment in a social network.

## Shape

* `id?: number | string` — Document ID.
* `author?: object` - Document author.
  * `id?: number | string` — Author account ID.
  * `name?: string` — Author name.
  * `picture?: Picture` — Author's [picture](https://gitlab.com/catamphetamine/social-components/-/blob/master/docs/ContentTypes.md#picture).
* `title?: string | InlineContent` — Document title. A string or [inline content](https://gitlab.com/catamphetamine/social-components/-/blob/master/docs/Content.md#inline-content).
  titleCensored: censoredText,
* `content?: Content` — Document [content](https://gitlab.com/catamphetamine/social-components/-/blob/master/docs/Content.md).
* `createdAt?: Date` — Document creation date.


