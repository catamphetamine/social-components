// `Attachment`.
// https://github.com/catamphetamine/social-components/blob/master/docs/Attachment.md

import {
  ResourceAttachment
} from './ResourceAttachment.d.js';

import {
  SocialAttachment
} from './SocialAttachment.d.js';

type Attachment_ =
	ResourceAttachment |
	SocialAttachment;

interface AttachmentCommonProperties {
  id?: number;
}

export type Attachment = AttachmentCommonProperties & Attachment_