import type { Content, ContentBlock, InlineContent, InlineContentAtom, InlineElement, InlineElementQuote, InlineElementLink, InlineElementWithType, BlockElement, BlockElementQuote } from '../Content.d.js';
import type { GetPostTextOptions } from '../post/index.d.js';
import type { CensoredText, CompiledWordPattern } from '../text/index.d.js';

type TransformContentFunction = (contentElement: BlockElement | InlineContentAtom) => BlockElement | InlineContentAtom | InlineContentAtom[] | false | undefined;

export function transformContent(content: ContentBlock[], transform: TransformContentFunction): void;

export interface TrimContentOptions {
	left?: boolean;
	right?: boolean;
}

export interface TrimInlineContentOptions {
	left?: boolean;
	right?: boolean;
}

export function trimContent(content: ContentBlock[], options?: TrimContentOptions): ContentBlock[] | undefined;
export function trimInlineContent(inlineContent: InlineElement[], options?: TrimInlineContentOptions): InlineElement[] | undefined;

export function visitContentParts<VisitResult>(type: string, visit: (part: InlineElementWithType | BlockElement) => VisitResult, content?: Content): VisitResult[];

export function createLinkElement(url: string, content: InlineContent): InlineElementLink;

export interface CensoredTextContentElement {
	type: 'spoiler';
	censored: true;
	content: string;
}

export function censorWords(text: string, filters: CompiledWordPattern[]): string | CensoredText<CensoredTextContentElement>;

export function getInlineContentText(content: InlineContent, options?: GetPostTextOptions): string | undefined;

export function getContentBlocks(content?: Content): ContentBlock[];

export function isPostLinkQuote(postLink: InlineElementPostLink): boolean;
export function isPostLinkBlockQuote(postLink: InlineElementPostLink): boolean;
export function isPostLinkGeneratedQuote(postLink: InlineElementPostLink): boolean;

export function expandStandaloneAttachmentLinks(content?: Content): void;

export function forEachFollowingQuote(content: InlineContent, startIndex: number, action: (quote: InlineElementQuote, i: number) => void): void;
export function combineQuotes(content?: Content): void;

export function splitContentIntoBlocksByMultipleLineBreaks(content: Content): Content;