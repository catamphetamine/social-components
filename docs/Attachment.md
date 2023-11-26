# Attachment

An `Attachment` object represents something that could be "attached" to a message.

An `Attachment` object has a `type: string` property that defines the content type of the attachment. See [`ContentType`](https://gitlab.com/catamphetamine/social-components/tree/master/docs/ContentType.md) for the description of each content type, if required.

All other properties of an `Attachment` object are different for each different type of an attachment.

Listed below are the possible types of an `Attachment` object.

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

* See [`ContentType` → `Picture`](https://gitlab.com/catamphetamine/social-components/tree/master/docs/ContentType.md#picture) for more details on `Picture`.

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

* See [`ContentType` → `Video`](https://gitlab.com/catamphetamine/social-components/tree/master/docs/ContentType.md#video) for more details on `Video`.

## Audio

```js
{
  type: "audio",
  audio: Audio
}
```

* See [`ContentType` → `Audio`](https://gitlab.com/catamphetamine/social-components/tree/master/docs/ContentType.md#audio) for more details on `Audio`.

## File

```js
{
  type: "file",
  file: File
}
```

* See [`ContentType` → `File`](https://gitlab.com/catamphetamine/social-components/tree/master/docs/ContentType.md#file) for more details on `File`.

## Social

Embedded tweets, etc.

```js
{
  type: "social",
  social: Social
}
```

* See [`ContentType` → `Social`](https://gitlab.com/catamphetamine/social-components/tree/master/docs/ContentType.md#social) for more details on `Social`.
