export interface Movie {
  id: string;
  title: string;
  imageUrl: string;
  synopsis: string;
  year?: string;
  genre?: string;
  director?: string;
  cast?: string[];
  runtime?: number; // in minutes
  rating?: number; // 1-10
  tags?: string[];
  watchStatus?: 'want-to-watch' | 'watching' | 'completed' | 'dropped';
  personalNotes?: string;
  dateWatched?: string;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  synopsis: string;
  airDate?: string;
  runtime?: number; // in minutes
  rating?: number; // 1-10
  isWatched?: boolean;
  personalNotes?: string;
  dateWatched?: string;
}

export interface Season {
  id: string;
  seasonNumber: number;
  episodes: Episode[];
}

export interface Series {
  id: string;
  title: string;
  imageUrl: string;
  synopsis: string;
  year?: string;
  genre?: string;
  creator?: string;
  cast?: string[];
  network?: string;
  status?: 'ongoing' | 'completed' | 'cancelled';
  rating?: number; // 1-10
  tags?: string[];
  watchStatus?: 'want-to-watch' | 'watching' | 'completed' | 'dropped';
  personalNotes?: string;
  isFavorite?: boolean;
  seasons: Season[];
  createdAt: string;
  updatedAt: string;
}

export type ContentItem = Movie | Series;

export function isMovie(item: ContentItem): item is Movie {
  return !('seasons' in item);
}

export function isSeries(item: ContentItem): item is Series {
  return 'seasons' in item;
}

export interface WatchlistItem {
  id: string;
  contentId: string;
  addedAt: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface Review {
  id: string;
  contentId: string;
  rating: number;
  review: string;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  contentIds: string[];
  isPublic?: boolean;
  createdAt: string;
  updatedAt: string;
}

export const GENRES = [
  'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime',
  'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror',
  'Music', 'Mystery', 'Romance', 'Sci-Fi', 'Sport', 'Thriller',
  'War', 'Western'
] as const;

export type Genre = typeof GENRES[number];

export const WATCH_STATUSES = [
  { key: 'want-to-watch', label: 'Want to Watch', color: '#3b82f6' },
  { key: 'watching', label: 'Currently Watching', color: '#10b981' },
  { key: 'completed', label: 'Completed', color: '#8b5cf6' },
  { key: 'dropped', label: 'Dropped', color: '#ef4444' }
] as const;