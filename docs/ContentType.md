# ContentType

Content can not just be in textual form, it can also be a picture, a video, an audio, a social media post.

## Picture

```js
{
  // Picture MIME type. Example: "image/jpeg".
  type: string,

  // Picture width.
  width: number,

  // Picture height.
  height: number,

  // Picture file size (in bytes).
  size: number?,

  // Picture file URL.
  url: string,

  // Picture title.
  title: string?,

  // `true` in case of an image with transparent background.
  transparentBackground: boolean?,

  // (optional)
  // Extra picture sizes (thumbnails).
  sizes: [
    {
      // Thumbnail MIME type.
      type: string,

      // Thumbnail width.
      width: number,

      // Thumbnail height.
      height: number,

      // Thumbnail file URL.
      url: string
    },
    ...
  ]
}
```

<details>
<summary>Picture example</summary>

#####

```js
{
  type: 'image/jpeg',
  title: '4chan 17th Birthday',
  width: 600,
  height: 438,
  url: 'https://s.4cdn.org/image/news/Happybirthday_17th_th.jpg',
  sizes: [{
    width: 300,
    height: 219,
    url: 'https://s.4cdn.org/image/news/Happybirthday_17th_th_small.jpg',
  }]
}
```
</details>

## Video

Videos can be video files or videos provided by some service like YouTube. Video files require a `type` and a `url`. Videos provided by a service require a `provider` and an `id`.

```js
{
  // Video MIME type.
  // Is required if `url` is defined.
  // Example: "video/webm".
  type: string?,

  // Video file URL.
  // Either `url`/`type` or `provider`/`id` is required.
  url: string?,

  // Video provider.
  // Examples: "YouTube", "Vimeo".
  provider: string?,

  // Video ID.
  // Is required if `provider` is defined.
  // Example: "4oAZRMomBJ0".
  id: string?,

  // Video width.
  width: number?,

  // Video height.
  height: number?,

  // Video file size (in bytes).
  size: number?,

  // Video duration (in seconds).
  duration: number?,

  // Video thumbnail (poster).
  // (see "Picture" section for more details)
  picture: Picture
}
```

<details>
<summary>MP4 video example</summary>

#####

```js
{
  type: 'video/webm',
  width: 854,
  height: 480,
  duration: 12,
  title: 'Schlossbergbahn',
  description: 'A .webm video example from WikiPedia',
  date: new Date(2013, 2, 1), // March 1st, 2013.
  size: 2 * 1024 * 1024, // in bytes
  url: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/8/87/Schlossbergbahn.webm/Schlossbergbahn.webm.480p.vp9.webm',
  picture: {
    type: 'image/jpeg',
    width: 220,
    height: 124,
    size: 25 * 1024, // in bytes.
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Schlossbergbahn.webm/220px--Schlossbergbahn.webm.jpg'
  }
}
```
</details>

<details>
<summary>YouTube video example</summary>

#####

```js
{
  "provider": "YouTube",
  "id": "6CPXGQ0zoJE",
  "title": "Samsung leaked their own phone...",
  // "description": "Use offer code TECHLINKED to get 20% off your next Mack Weldon order at https://lmg.gg/8KVKv\n\nGET MERCH: www.LTTStore.com\n\nTwitter: http://twitter.com/TechLinkedYT\nInstagram: http://instagram.com/TechLinkedYT\nFacebook: http://facebook.com/TechLinked\n\nNEWS SOURCES:\n\nQUE SERA, SERA\nhttps://www.droid-life.com/2019/01/31/samsung-concept-video-teases-foldable-device/\nhttps://www.youtube.com/watch?time_continue=60&v=mWirqqd0uE4\nMight not be the real thing https://www.engadget.com/2019/02/01/samsung-foldable-phone-render-leak/\nHuawei’s folding phone coming right after https://techcrunch.com/2019/02/01/huaweis-folding-phone-debuts-this-month/\n\nFOLLOW THE RULES\nhttps://www.wired.com/story/apple-blocks-google-employee-apps/\nRestores Google: https://arstechnica.com/information-technology/2019/02/in-addition-to-facebooks-apple-restores-googles-ios-app-certificate/\nRestores Facebook: https://www.iphoneincanada.ca/news/apple-google-facebook-internal/\n\nPASSWORDS! GET YER PASSWORDS HERE\nhttps://linustechtips.com/main/topic/1028078-collection-2-credential-bugaloo-following-collection-1-collections-2-5-found-containing-25-billion-records-combined/\nhttps://www.wired.com/story/collection-leak-usernames-passwords-billions/\nhttps://www.pcworld.com/article/3336026/security/collections-2-5-leak-of-over-2-billion-email-addresses-probably-has-your-information.html\nhttps://www.techspot.com/news/78525-collections-2-5-845gb-stolen-usernames-passwords-circulating.html\nhttps://sec.hpi.de/ilc/search\n\nQUICK BITS\n\nBOBSWAN’S SWANBLOG\nhttps://newsroom.intel.com/news-releases/intel-names-robert-swan-ceo/#gs.TTkqBydB\n\nHURRY UP INTEL\nhttps://twitter.com/IntelGraphics/status/1090323155640508417\n\nLIGHTING STRUCK DOWN?\nhttps://www.cnet.com/news/next-iphone-may-swap-lightning-port-for-usb-c-have-three-rear-cameras/\n\nSWITCH TO A SMALLER SWITCH\nhttps://hexus.net/gaming/news/hardware/127073-nintendo-switch-greater-portability-works/\n\nUV BLOCKER\nhttps://lifehacker.com/make-sure-your-ultraviolet-account-is-linked-to-other-r-1832270454",
  "duration": 491,
  "width": 1920,
  "height": 1080,
  "aspectRatio": 1.7777777777777777,
  "picture": {
    "type": "image/jpeg",
    "url": "https://i.ytimg.com/vi/6CPXGQ0zoJE/maxresdefault.jpg",
    "width": 1280,
    "height": 720,
    "sizes": [
      {
        "type": "image/jpeg",
        "url": "https://i.ytimg.com/vi/6CPXGQ0zoJE/mqdefault.jpg",
        "width": 320,
        "height": 180
      }
    ]
  }
}
```
</details>

## Audio

```js
{
  // MIME-type.
  type: string?,

  // Audio file URL.
  url: string?,

  // Audio file provider.
  // (Could be something like "SoundCloud").
  provider: string?,

  // Audio file ID if `provider` is defined.
  // Example: "510788520".
  id: string?,

  // Audio file bitrate (in bits per second).
  bitrate: number?

  // The date on which the audio file was recorded.
  date: Date?

  // `author` is optional even for `url` audio files.
  author: string?,

  // `title` is optional.
  // (for example, anonymous messengers might remove
  //  the original audio file name for privacy reasons).
  title: string?
}
```

<details>
<summary>Audio file example</summary>

#####

```js
{
  author: 'U.N.K.L.E.',
  title: 'Looking For The Rain ft. Mark Lanegan',
  type: 'audio/ogg',
  bitrate: 92 * 1024 * 8,
  url: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Toreador_song_cleaned.ogg'
}
```
</details>

<details>
<summary>SoundCloud audio example</summary>

#####

```js
{
  provider: 'SoundCloud',
  id: '1234567890'
}
```
</details>

## File

```js
{
  // File MIME type.
  // Example: "application/pdf".
  type: string,

  // File name.
  // Example: "Report".
  // File name is optional.
  // (for example, anonymous messengers might remove
  //  the original file name for privacy reasons).
  title: string?,

  // File extension with a dot.
  // Example: ".pdf".
  // A file could possibly have no extension.
  ext: string?,

  // File size (in bytes).
  size: number?,

  // File URL.
  url: string,

  // File thumbnail.
  // For example, a PDF document might have a thumbnail.
  picture: Picture?
}
```

<details>
<summary>File example</summary>

#####

```js
{
  type: 'application/pdf',
  name: 'Industrial society and its future',
  ext: '.pdf',
  size: 350 * 1024,
  url: 'https://google.com'
}
```
</details>

## Social

```js
{
  // Social media.
  // Examples: "Twitter", "Instagram".
  provider: string,

  // Social media post ID.
  id: string,

  // Social media post URL.
  url: string?,

  // Social media post date.
  date: Date?,

  author: {
    // Social media author ID.
    // Example: "realdonaldtrump".
    id: string,

    // Author name.
    // Example: "Donald J. Trump".
    name: string?,

    // Author social media page.
    // Example: "https://twitter.com/realdonaldtrump".
    url: string?,

    // Author's "user picture".
    picture: Picture?
  }?,

  // Social media post content.
  content: string?

  // Social media post attachments.
  // For example, for an Instagram post
  // that would be the picture attachment(s).
  attachments: Attachment[]?
}
```

<details>
<summary>Tweet example</summary>

#####

```js
{
  provider: 'Twitter',
  id: '463440424141459456',
  content: 'Sunsets don\'t get much better than this one over @GrandTetonNPS. #nature #sunset (link)',
  url: 'https://twitter.com/Interior/status/463440424141459456',
  date: new Date(2014, 4, 5),
  author: {
    name: 'US Department of the Interior',
    id: 'Interior',
    url: 'https://twitter.com/Interior'
  }
}
```
</details>

<details>
<summary>Instagram example</summary>

#####

```js
{
  provider: 'Instagram',
  id: 'V8UMy0LjpX',
  content: 'My favorite cat from tonight\'s episode- a true winner. #newgirl',
  url: 'https://www.instagram.com/p/V8UMy0LjpX/',
  author: {
    name: 'Zooey Deschanel',
    id: 'zooeydeschanel',
    url: 'https://www.instagram.com/zooeydeschanel'
  },
  date: new Date('2013-02-20T06:17:14+00:00'),
  attachments: [{
    type: 'picture',
    picture: {
      type: 'image/jpeg',
      width: 612,
      height: 612,
      url: 'https://scontent-arn2-1.cdninstagram.com/vp/fe285833a2d6da37c81165bc7e03f8d8/5D3E22F2/t51.2885-15/e15/11262720_891453137565191_1495973619_n.jpg?_nc_ht=scontent-arn2-1.cdninstagram.com'
    }
  }]
}
```
</details>