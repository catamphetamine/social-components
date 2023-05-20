## Post

A `Post` object has properties:

* `id?: string | number`
* `title?: string`
* `titleCensored?: string` — An optional "censored" version of a title. Example: `"John is a ░​░​░​░​░​░​░​░​"`.
* `author?: object`
  * `id?: string | number`
  * `name?: string`
  * [`picture?: Picture`](https://gitlab.com/catamphetamine/social-components/tree/master/docs/ContentTypes.md#picture)
* `createdAt?: Date`
* [`content?: Content`](https://gitlab.com/catamphetamine/social-components/tree/master/docs/Content.md)
* [`attachments?: Attachment[]`](https://gitlab.com/catamphetamine/social-components/tree/master/docs/Attachment.md).
* `replies?: Post[]`