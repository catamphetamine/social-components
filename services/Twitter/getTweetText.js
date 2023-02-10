import unescapeContent from '../../utility/unescapeContent.js'

/**
 * Parses tweet HTML into text.
 * @param  {string} html
 * @param  {object} [options.messages] — Localized labels. See the description of "Messages" in the readme.
 * @return {string} [text]
 */
export default function getTweetText(html, { messages }) {
  const match = html.match(/<blockquote .+?><p .+?>(.+)<\/p>.*<\/blockquote>/)
  if (!match) {
    return
  }
  let textHtml = match[1]
  // Unescape content.
  textHtml = unescapeContent(textHtml)
  // Replace usernames.
  textHtml = textHtml.replace(/<a [^>]+>@(.+?)<\/a>/g, '@$1')
  // // Remove hashtags in the beginning.
  // textHtml = textHtml.replace(/^<a [^>]+>#.+?<\/a>\s*/g, '')
  // // Remove hashtags in the end.
  // textHtml = textHtml.replace(/\s*<a [^>]+>#.+?<\/a>$/g, '')
  // Replace hashtag links with hashtag text.
  textHtml = textHtml.replace(/<a [^>]+>#(.+?)<\/a>/g, '#$1')
  // Replace Twitter search links with search query.
  // In this case, replace "cash tags" (stock market).
  textHtml = textHtml.replace(/<a [^>]+>\$(.+?)<\/a>/g, '$$$1')
  // Replace links with `(link)` messages.
  if (messages && messages.textContent && messages.textContent.inline) {
    textHtml = textHtml.replace(/<a [^>]+>(.+?)<\/a>/g, (_, linkTitle) => {
      // Replace attachment links with `(attachment)` messages.
      // Could be a picture or a video.
      if (messages.textContent.inline.attachment) {
        if (linkTitle.indexOf('pic.twitter.com') === 0) {
          // Could be a picture or a video.
          return messages.textContent.inline.attachment
        }
      }
      if (messages.textContent.inline.link) {
        return messages.textContent.inline.link
      }
      return linkTitle
    })
  }
  // Replace new lines.
  textHtml = textHtml.replace(/<br>/g, '\n')
  // Return tweet text.
  return textHtml.trim()
}