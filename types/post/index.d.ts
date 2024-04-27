import type { Id } from '../Id.d.js'
import type { Attachment } from '../Attachment.d.js';
import type { Content, InlineElementLink, InlineElementPostLink } from '../Content.d.js';
import type { Post } from '../Post.d.js';
import type { PictureSize } from '../ContentType.d.js';
import type { Messages } from '../messages.json.d.js';
import type { ResourceCacheStorage } from '../cache/index.d.js';

export interface GetPostTextOptions {
	softLimit?: number;
	messages?: object;
	skipPostQuoteBlocks?: boolean;
	skipGeneratedPostQuoteBlocks?: boolean;
	skipAttachments?: boolean;
	skipNonEmbeddedAttachments?: boolean;
	skipUntitledAttachments?: boolean;
	spaceOutParagraphs?: boolean;
	onAttachment?: (attachment: Attachment) => void;
	getLinkTitle?: (link: InlineElementLink) => string | undefined;
	trimCodeBlocksToFirstLine?: boolean;
	stopOnNewLine?: boolean;
	openingQuote?: string;
	closingQuote?: string;
}

export function getPostText(post: Post, options?: GetPostTextOptions): string | undefined;

export interface GeneratePostQuoteOptions {
	maxLength?: number;
	getCharactersCountPenaltyForLineBreak?: ({ textBefore: string }) => number;
	minFitFactor?: number;
	maxFitFactor?: number;
	trimMarkEndOfLine?: string;
	trimMarkEndOfSentence?: string;
	trimMarkEndOfWord?: string;
	trimMarkAbrupt?: string;
	skipPostQuoteBlocks?: boolean;
	onUntitledAttachment?: (attachment: Attachment) => void;
}

export function generatePostQuote(post: Post, options?: GeneratePostQuoteOptions): string | undefined;

export function canGeneratePostQuoteIgnoringNestedPostQuotes(post: Post, options?: GeneratePostQuoteOptions): boolean;

interface GetPostThumbnailAttachmentOptions {
	showPostThumbnailWhenThereAreMultipleAttachments: boolean;
	showPostThumbnailWhenThereIsNoContent: boolean;
}

export function getPostThumbnailAttachment(post: Post, options: GetPostThumbnailAttachmentOptions): Attachment | undefined;
export function getPostThumbnailSize(postThumbnail: Attachment): PictureSize;

export interface GeneratePostPreviewOptions {
	maxLength?: number;
	minFitFactor?: number;
	maxFitFactor?: number;
	textTrimMarkEndOfWord?: string;
	textTrimMarkAbrupt?: string;
	minimizeGeneratedPostLinkBlockQuotes?: boolean;
}

export function generatePostPreview(post: Post, options?: GeneratePostPreviewOptions): Content | undefined;

export function getNonEmbeddedAttachments(post: Post): Attachment[];
export function getSortedAttachments(post: Post): Attachment[];

export function removeLeadingPostLink(post: Post, postLinkCriterion: Id | ((postLink: InlineElementPostLink) => boolean)): void;

export interface LoadResourceLinkResult {
	loadable?: boolean;
	loaded?: boolean;
	stopped?: boolean;
	error?: boolean;
}

export interface LoadResourceLinksOptions {
	cache?: ResourceCacheStorage<any>;
	youTubeApiKey?: string;
	messages?: Messages;
	onContentChange?: () => void;
	contentMaxLength?: number;
	additionalResourceLoadingPromises?: Promise<LoadResourceLinkResult>[];
	minimizeGeneratedPostLinkBlockQuotes?: boolean;
}

export interface LoadResourceLinksResult {
	stop: () => void;
	cancel: () => void;
	promise: Promise<void>;
}

export function loadResourceLinks(post: Post, options?: LoadResourceLinksOptions): LoadResourceLinksResult;