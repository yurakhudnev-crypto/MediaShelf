export type MediaCategory = 'book' | 'movie' | 'music' | 'game';
export type MediaStatus = 'consumed' | 'future';

export interface MediaItem {
  id: string;
  title: string;
  category: MediaCategory;
  coverUrl: string;
  comment: string;
  status: MediaStatus;
  rating: number;
  dateAdded: string;
  dateConsumed?: string;
}

export type CategoryFilter = 'all' | 'book' | 'movie' | 'music' | 'game' | 'future';

export interface GoogleDriveSettings {
  enabled: boolean;
  folderId: string;
  apiKey: string;
}
