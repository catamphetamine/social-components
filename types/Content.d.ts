// `Content`.
// https://github.com/catamphetamine/social-components/blob/master/docs/Content.md

import {
  Id
} from './Id.d.js';

import {
  Attachment
} from './Attachment.d.js';

// `InlineElement`.

export type InlineElementText = string;

export interface InlineElementStyledText {
  type: 'text';
  style: 'bold' | 'italic' | 'underlined' | 'strikethrough' | 'subscript' | 'superscript';
  content: InlineContent;
}

export type InlineElementNewLine = '\n';

export interface InlineElementEmoji {
  type: 'emoji';
  name: string;
  url: string;
}

export interface InlineElementQuote {
  type: 'quote';
  contentGenerated?: boolean;
  content: InlineContent;
  kind?: string;
  block?: boolean;
}

export interface InlineElementSpoiler {
  type: 'spoiler';
  content: InlineContent;
  censored?: boolean;
}

export interface InlineElementLink {
  type: 'link';
  url: string;
  service?: string;
  attachment?: Attachment;
  content: InlineContent;
  contentGenerated?: boolean;
}

export interface InlineElementPostLink {
  type: 'post-link';
  url?: string;
  // This is an "extension" point for a `post-link` element.
  // For example, it could contain `authorId`, `channelId`, `threadId`, etc.
  meta: InlineElementPostLinkMeta;
  content: InlineContent;
}

export type InlineElementPostLinkMeta = Record<string, any>

export interface InlineElementCode {
  type: 'code';
  language?: string;
  content: InlineContent;
}

export interface InlineElementReadMore {
	type: 'read-more';
}

export type InlineElementWithType =
  InlineElementStyledText |
  InlineElementEmoji |
  InlineElementQuote |
  InlineElementSpoiler |
  InlineElementLink |
  InlineElementPostLink |
  InlineElementCode |
  InlineElementReadMore;

export type InlineElement =
  InlineElementText |
  InlineElementNewLine |
  InlineElementWithType;

// `InlineContent`.
export type InlineContent = string | InlineElement[];

export type InlineContentAtom = string | InlineElement;

// `BlockElement`.

export interface BlockElementHeading {
  type: 'heading';
  content: InlineContent;
}

export interface BlockElementList {
  type: 'list';
  items: InlineContent[];
}

export interface BlockElementCode {
  type: 'code';
  language?: string;
  content: InlineContent;
}

export interface BlockElementQuote {
  type: 'quote';
  url?: string;
  source?: string;
  contentGenerated?: boolean;
  content: InlineContent;
}

export interface BlockElementAttachmentBase {
  type: 'attachment';
  expand?: boolean;
  link?: string;
}

export interface BlockElementAttachmentReference extends BlockElementAttachmentBase {
  attachmentId: number;
}

export interface BlockElementAttachment_ extends BlockElementAttachmentBase {
  attachment: Attachment;
}

export type BlockElementAttachment = BlockElementAttachment_ | BlockElementAttachmentReference;

export interface BlockElementReadMore {
	type: 'read-more';
}

export type BlockElement =
	BlockElementHeading |
	BlockElementList |
	BlockElementCode |
	BlockElementQuote |
	BlockElementAttachmentReference |
	BlockElementAttachment |
	BlockElementReadMore;

// `ContentBlock`.
export type ContentBlock = BlockElement | InlineContent;

export type ContentText = string;

// `Content`.
export type Content = ContentText | ContentBlock[];