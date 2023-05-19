// https://github.com/catamphetamine/social-components/blob/master/docs/Content.md

interface InlineElementStyledText {
  type: 'text';
  style: 'bold' | 'italic' | 'underlined' | 'strikethrough' | 'subscript' | 'superscript';
  content: InlineContent;
}

type InlineElementNewLine = '\n';

interface InlineElementEmoji {
  type: 'emoji';
  name: string;
  url: string;
}

interface InlineElementQuote {
  type: 'quote';
  content: InlineContent;
  kind?: string;
  block?: boolean;
}

interface InlineElementSpoiler {
  type: 'spoiler';
  content: InlineContent;
  censored?: boolean;
}

interface InlineElementLink {
  type: 'link';
  url: string;
  service?: string;
  attachment?: Attachment;
  content: InlineContent;
  contentGenerated?: boolean;
}

interface InlineElementPostLink {
  type: 'post-link';
  url: string;
  // postId: PostId;
  content: InlineContent;
}

interface InlineElementCode {
  type: 'code';
  language?: string;
  content: InlineContent;
}

interface InlineElementReadMore {
	type: 'read-more';
}

type InlineElement =
	string |
	InlineElementStyledText |
	InlineElementNewLine |
	InlineElementEmoji |
	InlineElementQuote |
	InlineElementSpoiler |
	InlineElementLink |
	InlineElementPostLink |
	InlineElementCode |
	InlineElementReadMore;

type InlineContent = string | InlineElement[];

interface BlockElementSubheading {
  type: 'heading';
  content: InlineContent;
}

interface BlockElementList {
  type: 'list';
  items: InlineContent[];
}

interface BlockElementCode {
  type: 'code';
  language?: string;
  content: InlineContent;
}

interface BlockElementQuote {
  type: 'quote';
  url?: string;
  source?: string;
  content: InlineContent;
}

interface BlockElementAttachmentReference {
  type: 'attachment';
  attachmentId: number;
  expand?: boolean;
  link?: string;
}

interface BlockElementAttachment {
  type: 'attachment';
  attachment: Attachment;
  expand?: boolean;
  link?: string;
}

interface BlockElementReadMore {
	type: 'read-more';
}

type BlockElement =
	BlockElementSubheading |
	BlockElementList |
	BlockElementCode |
	BlockElementQuote |
	BlockElementAttachmentReference |
	BlockElementAttachment |
	BlockElementReadMore;

type ContentBlock = BlockElement | InlineContent;

// In this library specifically, `Content` is always an array of content blocks.
// type Content = string | ContentBlock[];
type Content = ContentBlock[];

interface PictureSize {
  type: string;
  width: number;
  height: number;
  url: string;
}

interface Picture {
  type: string;
  width: number;
  height: number;
  size?: number;
  url: string;
  title?: string;
  transparentBackground?: boolean;
  sizes?: PictureSize[]
}

interface PictureAttachment {
  type: 'picture';
  spoiler?: boolean;
  picture: Picture;
}

interface Video {
  type?: string;
  url?: string;
  provider?: 'youtube' | 'vimeo';
  id?: string;
  width?: number;
  height?: number;
  size?: number;
  duration?: number;
  picture: Picture;
}

interface VideoAttachment {
  type: 'video';
  spoiler?: boolean;
  video: Video;
}

interface Audio {
  type?: string;
  url?: string;
  provider?: string;
  id?: string;
  bitrate?: number;
  date?: Date;
  author?: string;
  title?: string;
}

interface AudioAttachment {
  type: 'audio';
  audio: Audio;
}

interface File {
  type: string;
  title?: string;
  ext?: string;
  size?: number;
  url: string;
  picture?: Picture;
}

interface FileAttachment {
  type: 'file';
  file: File;
}

interface Social {
  provider: 'twitter' | 'instagram';
  id: string;
  url?: string;
  date?: Date;
  author?: {
    id: string;
    name?: string;
    url?: string;
    picture?: Picture;
  };
  content?: string;
  attachments?: Attachment[];
}

interface SocialAttachment {
	type: 'social';
	social: Social;
}

// https://github.com/catamphetamine/social-components/blob/master/docs/Attachments.md
export type Attachment =
	PictureAttachment |
	VideoAttachment |
	AudioAttachment |
	FileAttachment |
	SocialAttachment;