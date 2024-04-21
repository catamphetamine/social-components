import { Social } from '../../SocialAttachment.d.js';

export function getPost(id: string): Promise<Social>;
export function getPostByUrl(url: string): Promise<Social>;
export function parsePostUrl(url: string): { id?: string };