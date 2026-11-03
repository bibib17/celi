export interface VoucherState {
  chocolateClaimed: boolean;
  chocolateClaimDate: string | null;
  hugClaimed: boolean;
  hugClaimDate: string | null;
}

export interface PhotocardItem {
  id: string;
  cardNo: number;
  type: 'photo' | 'video';
  src: string;
  poster?: string;
  title: string;
  date: string;
  part: 'celi' | 'couple' | 'abib';
  category: string;
  tag: string;
  backNote: string;
}

export interface HeroFilmstripItem {
  id: number;
  type: 'video' | 'photo';
  src: string;
  poster?: string;
  date: string;
  time: string;
  title: string;
  note: string;
  tag: string;
}

export interface MemoryMedia {
  id: string;
  type: 'video' | 'photo';
  src: string;
  fallbackSrc?: string;
  title: string;
  date: string;
  time?: string;
  caption: string;
  tag: string;
}

export interface ReasonLove {
  id: string;
  numberText: string;
  title: string;
  body: string;
  timestamp?: string;
  bonus?: string;
}

export interface Gombalan {
  id: number;
  text: string;
  reaction: string;
}
