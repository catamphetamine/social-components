import unescapeContent from '../../utility/unescapeContent'

/**
 * Parses tweet HTML into text.
 * @param  {string} html
 * @param  {object} options — `{ messages }`
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
  // Replace links with `(link)` messages.
  if (messages && messages.link) {
    textHtml = textHtml.replace(/<a [^>]+>(.+?)<\/a>/g, (_, text) => {
      // Replace attachment links with `(attachment)` messages.
      // Could be a picture or a video.
      if (messages.attachment && text.indexOf('pic.twitter.com') === 0) {
        return `(${messages.attachment.toLowerCase()})`
      }
      return `(${messages.link.toLowerCase()})`
    })
  }
  // Replace new lines.
  textHtml = textHtml.replace(/<br>/g, '\n')
  // Return tweet text.
  return textHtml.trim()
}