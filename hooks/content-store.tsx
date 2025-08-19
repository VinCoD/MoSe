import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useMemo } from 'react';
import { Movie, Series, ContentItem, isMovie, isSeries, Season, Episode } from '@/types/content';

const STORAGE_KEY = 'synopsis_content';

export const [ContentProvider, useContent] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'movies' | 'series'>('all');

  const contentQuery = useQuery({
    queryKey: ['content'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as ContentItem[];
      }
      return [];
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (content: ContentItem[]) => {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(content));
      return content;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
    }
  });

  const addMovie = (movie: Omit<Movie, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newMovie: Movie = {
      ...movie,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updated = [...(contentQuery.data || []), newMovie];
    saveMutation.mutate(updated);
  };

  const addSeries = (series: Omit<Series, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSeries: Series = {
      ...series,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updated = [...(contentQuery.data || []), newSeries];
    saveMutation.mutate(updated);
  };

  const updateContent = (id: string, updates: Partial<ContentItem>) => {
    const content = contentQuery.data || [];
    const updated = content.map(item => 
      item.id === id 
        ? { ...item, ...updates, updatedAt: new Date().toISOString() }
        : item
    );
    saveMutation.mutate(updated);
  };

  const deleteContent = (id: string) => {
    const content = contentQuery.data || [];
    const updated = content.filter(item => item.id !== id);
    saveMutation.mutate(updated);
  };

  const addSeasonToSeries = (seriesId: string, season: Omit<Season, 'id'>) => {
    const content = contentQuery.data || [];
    const updated = content.map(item => {
      if (item.id === seriesId && isSeries(item)) {
        const newSeason: Season = {
          ...season,
          id: Date.now().toString()
        };
        return {
          ...item,
          seasons: [...item.seasons, newSeason],
          updatedAt: new Date().toISOString()
        };
      }
      return item;
    });
    saveMutation.mutate(updated);
  };

  const addEpisodeToSeason = (seriesId: string, seasonId: string, episode: Omit<Episode, 'id'>) => {
    const content = contentQuery.data || [];
    const updated = content.map(item => {
      if (item.id === seriesId && isSeries(item)) {
        return {
          ...item,
          seasons: item.seasons.map(season => {
            if (season.id === seasonId) {
              const newEpisode: Episode = {
                ...episode,
                id: Date.now().toString()
              };
              return {
                ...season,
                episodes: [...season.episodes, newEpisode]
              };
            }
            return season;
          }),
          updatedAt: new Date().toISOString()
        };
      }
      return item;
    });
    saveMutation.mutate(updated);
  };

  const toggleFavorite = (id: string) => {
    const content = contentQuery.data || [];
    const updated = content.map(item => 
      item.id === id 
        ? { ...item, isFavorite: !item.isFavorite, updatedAt: new Date().toISOString() }
        : item
    );
    saveMutation.mutate(updated);
  };

  const updateWatchStatus = (id: string, status: 'want-to-watch' | 'watching' | 'completed' | 'dropped' | undefined) => {
    const content = contentQuery.data || [];
    const updated = content.map(item => 
      item.id === id 
        ? { ...item, watchStatus: status, updatedAt: new Date().toISOString() }
        : item
    );
    saveMutation.mutate(updated);
  };

  const markEpisodeWatched = (seriesId: string, seasonId: string, episodeId: string, watched: boolean) => {
    const content = contentQuery.data || [];
    const updated = content.map(item => {
      if (item.id === seriesId && isSeries(item)) {
        return {
          ...item,
          seasons: item.seasons.map(season => {
            if (season.id === seasonId) {
              return {
                ...season,
                episodes: season.episodes.map(episode => 
                  episode.id === episodeId 
                    ? { ...episode, isWatched: watched, dateWatched: watched ? new Date().toISOString() : undefined }
                    : episode
                )
              };
            }
            return season;
          }),
          updatedAt: new Date().toISOString()
        };
      }
      return item;
    });
    saveMutation.mutate(updated);
  };

  const updateEpisode = (seriesId: string, seasonId: string, episodeId: string, updates: Partial<Episode>) => {
    const content = contentQuery.data || [];
    const updated = content.map(item => {
      if (item.id === seriesId && isSeries(item)) {
        return {
          ...item,
          seasons: item.seasons.map(season => {
            if (season.id === seasonId) {
              return {
                ...season,
                episodes: season.episodes.map(episode => 
                  episode.id === episodeId 
                    ? { ...episode, ...updates }
                    : episode
                )
              };
            }
            return season;
          }),
          updatedAt: new Date().toISOString()
        };
      }
      return item;
    });
    saveMutation.mutate(updated);
  };

  const filteredContent = useMemo(() => {
    let content = contentQuery.data || [];
    
    // Filter by type
    if (filterType === 'movies') {
      content = content.filter(isMovie);
    } else if (filterType === 'series') {
      content = content.filter(isSeries);
    }
    
    // Filter by search query
    if (searchQuery) {
      content = content.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.synopsis.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort by updated date (newest first)
    return content.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [contentQuery.data, filterType, searchQuery]);

  return {
    content: contentQuery.data || [],
    filteredContent,
    isLoading: contentQuery.isLoading,
    isSaving: saveMutation.isPending,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    addMovie,
    addSeries,
    updateContent,
    deleteContent,
    addSeasonToSeries,
    addEpisodeToSeason,
    updateEpisode,
    toggleFavorite,
    updateWatchStatus,
    markEpisodeWatched
  };
});

export function useContentItem(id: string) {
  const { content } = useContent();
  return content.find(item => item.id === id);
}