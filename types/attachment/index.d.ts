import type { Picture, PictureSize, Attachment } from './ContentType.d.js';
import type { BlockElementAttachment } from './Content.d.js'

export function doesAttachmentHavePicture(attachment: Attachment): boolean;
export function getAttachmentThumbnailSize(attachment: Attachment): PictureSize | undefined;
export function sortAttachmentsByThumbnailHeightDescending(attachments: Attachment[]): Attachment[];
export function getPicturesAndVideos(attachments: Attachment[]): Attachment[];
export function getPictureMinSize(picture: Picture): PictureSize;
export function getEmbeddedAttachment(content: BlockElementAttachment, attachments?: Attachment[]): Attachment | undefined;

