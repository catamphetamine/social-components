// `ContentType`.
// https://github.com/catamphetamine/social-components/blob/master/docs/ContentType.md

export interface PictureSize {
  type: string;
  width: number;
  height: number;
  url: string;
}

export interface Picture {
  type: string;
  // Picture dimensions are also required for vector images
  // in order to be able to calculate their aspect ratio.
  width: number;
  height: number;
  size?: number;
  url: string;
  title?: string;
  transparentBackground?: boolean;
  sizes?: PictureSize[]
}

export interface Video {
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

export interface Audio {
  type?: string;
  url?: string;
  provider?: string;
  id?: string;
  bitrate?: number;
  size?: number;
  duration?: number;
  date?: Date;
  author?: string;
  title?: string;
  picture?: Picture;
}

export interface File {
  type: string;
  title?: string;
  ext?: string;
  size?: number;
  url: string;
  name?: string;
  picture?: Picture;
}