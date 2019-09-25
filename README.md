# `social-components`

Social service components.

Some experiments with common social service concepts such as a "post", its data structure, maybe some React components for rendering "post"s, etc.

## Install

```
npm install social-components --save
```

This library uses `async`/`await` syntax so including `regenerator-runtime` is required when using it. That usually means either including `babel-polyfill` (Babel 6) or `@babel/polyfill` (Babel 7). Since Babel `7.4.0` `@babel/polyfill` [has been deprecated](https://babeljs.io/docs/en/babel-polyfill) and should be replaced with `core-js` and `regenerator-runtime`:

```
npm install core-js regenerator-runtime --save
```

```js
import "core-js/stable"
import "regenerator-runtime/runtime"
```

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

## To do

* `source/services/YouTube/getVideo.js` and `source/services/Vimeo/getVideo.js` both use `fetch()` global function which isn't supported in Node.js. Developers using this package could optionally polyfill `fetch()` on server side (for example, see `/fetch-polyfill`).
* `source/services/Twitter/getTweet.js` and `source/services/Instagram/getPost.js` both use `fetch-jsonp` which doesn't work in Node.js. Some tests are skipped because of that (`describe.skip()`). Maybe somehow substitute `fetch-jsonp` for server side.

## License

[MIT](LICENSE)