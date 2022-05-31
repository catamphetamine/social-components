# Attachments

See [`Content Types`](https://gitlab.com/catamphetamine/social-components/tree/master/docs/ContentTypes.md) for more details.

## Picture

```js
{
	type: "picture",
	spoiler: boolean?,
	// (see "Picture" section for more details)
	picture: Picture
}
```

* `spoiler` — Pass `true` if a picture contains a possible "spoiler": such picture will appear blurred until the user clicks on it.

* See [`Content Types`](https://gitlab.com/catamphetamine/social-components/tree/master/docs/ContentTypes.md#picture) for more details on `Picture`.

## Video

```js
{
	type: "video",
	spoiler: boolean?,
	// (see "Video" section for more details)
	video: Video
}
```

* `spoiler` is for cases when a video contains a possible "spoiler" which makes it appear blurred until the user clicks on it.

* See [`Content Types`](https://gitlab.com/catamphetamine/social-components/tree/master/docs/ContentTypes.md#video) for more details on `Video`.

## Audio

```js
{
	type: "audio",
	audio: Audio
}
```

* See [`Content Types`](https://gitlab.com/catamphetamine/social-components/tree/master/docs/ContentTypes.md#audio) for more details on `Audio`.

## File

```js
{
	type: "file",
	file: File
}
```

* See [`Content Types`](https://gitlab.com/catamphetamine/social-components/tree/master/docs/ContentTypes.md#file) for more details on `File`.

## Social

Embedded tweets, etc.

```js
{
	type: "social",
	social: Social
}
```

* See [`Content Types`](https://gitlab.com/catamphetamine/social-components/tree/master/docs/ContentTypes.md#social) for more details on `Social`.
