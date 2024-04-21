import type { Content, ContentBlock, InlineContent, InlineElement, InlineElementQuote, InlineElementLink, InlineElementWithType, BlockElement, BlockElementQuote } from './Content.d.js';
import type { GetPostTextOptions } from '../post/index.d.js';
import type { CensoredText, CompiledWordPattern } from '../text/index.d.js';

export function transformContent(content: Content, transform: (part: InlineElement | BlockElement) => VisitResult) => InlineElement | BlockElement | false | undefined): void;

export interface TrimContentOptions {
	left?: boolean;
	right?: boolean;
}

export interface TrimInlineContentOptions {
	left?: boolean;
	right?: boolean;
}

export function trimContent(content: Content, options?: TrimContentOptions): Content | undefined;
export function trimInlineContent(inlineContent: InlineContent, options?: TrimInlineContentOptions): InlineContent | undefined;

export function visitContentParts<VisitResult>(type: string, visit: (part: InlineElementWithType | BlockElement) => VisitResult, content: Content): VisitResult[];

export function createLinkElement(url: string, content: InlineContent): InlineElementLink;

export interface CensoredTextContentElement {
	type: 'spoiler';
	censored: true;
	content: string;
}

export function censorWords(text: string, filters: CompiledWordPattern[]): string | CensoredText<CensoredTextContentElement>;

export function getInlineContentText(content: InlineContent, options?: GetPostTextOptions): string | undefined;

export function getInlineContentText(content: InlineContent, options?: GetPostTextOptions): string | undefined;

export function getContentBlocks(content: Content): ContentBlock[];

export function isPostLinkQuote(postLink: ContentBlock): boolean;
export function isPostLinkBlockQuote(postLink: ContentBlock): boolean;
export function isPostLinkGeneratedQuote(postLink: ContentBlock): boolean;

export function expandStandaloneAttachmentLinks(content: Content): void;

export function forEachFollowingQuote(content: Content, startIndex: number, action: (quote: InlineElementQuote | BlockElementQuote, i: number) => void): void;
export function combineQuotes(content: Content): void;

export function splitContentIntoBlocksByMultipleLineBreaks(content: Content): Content;