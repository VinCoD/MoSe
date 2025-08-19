import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, router, Stack } from "expo-router";
import { useContentItem, useContent } from "@/hooks/content-store";
import { isSeries, Series } from "@/types/content";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";

export default function ContentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = useContentItem(id);
  const { deleteContent, addSeasonToSeries } = useContent();
  const [expandedSeasons, setExpandedSeasons] = useState<string[]>([]);

  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Content not found</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Delete Content",
      `Are you sure you want to delete "${item.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            deleteContent(id);
            router.back();
          }
        }
      ]
    );
  };

  const handleAddSeason = () => {
    if (isSeries(item)) {
      const newSeasonNumber = item.seasons.length + 1;
      addSeasonToSeries(id, {
        seasonNumber: newSeasonNumber,
        episodes: []
      });
    }
  };

  const handleAddEpisode = (seasonId: string, seasonNumber: number) => {
    const season = (item as Series).seasons.find(s => s.id === seasonId);
    const episodeNumber = season ? season.episodes.length + 1 : 1;
    
    router.push({
      pathname: '/edit-episode',
      params: {
        seriesId: id,
        seasonId,
        mode: 'add',
        episodeNumber,
        seasonNumber
      }
    });
  };

  const toggleSeason = (seasonId: string) => {
    setExpandedSeasons(prev => 
      prev.includes(seasonId) 
        ? prev.filter(id => id !== seasonId)
        : [...prev, seasonId]
    );
  };

  return (
    <>
      <Stack.Screen options={{ 
        title: '',
        headerTransparent: true,
        headerStyle: { backgroundColor: 'transparent' },
        headerTintColor: '#fff'
      }} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image source={{ uri: item.imageUrl }} style={styles.poster} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)', '#000000']}
            style={styles.gradient}
          />
          <View style={styles.heroContent}>
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.metadata}>
              <View style={styles.badge}>
                {isSeries(item) ? (
                  <Feather name="tv" size={14} color="#fff" />
                ) : (
                  <Feather name="film" size={14} color="#fff" />
                )}
                <Text style={styles.badgeText}>
                  {isSeries(item) ? 'Series' : 'Movie'}
                </Text>
              </View>
              {item.year && (
                <View style={styles.yearBadge}>
                  <Feather name="calendar" size={14} color="#ccc" />
                  <Text style={styles.yearText}>{item.year}</Text>
                </View>
              )}
              {item.genre && (
                <Text style={styles.genre}>{item.genre}</Text>
              )}
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.playButton}>
                <Feather name="play" size={20} color="#000" />
                <Text style={styles.playButtonText}>Read Synopsis</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Feather name="trash-2" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.synopsisSection}>
            <Text style={styles.sectionTitle}>Synopsis</Text>
            <Text style={styles.synopsis}>{item.synopsis}</Text>
          </View>

          {isSeries(item) && (
            <View style={styles.seasonsSection}>
              <View style={styles.seasonsSectionHeader}>
                <Text style={styles.sectionTitle}>Seasons & Episodes</Text>
                <TouchableOpacity style={styles.addSeasonButton} onPress={handleAddSeason}>
                  <Feather name="plus" size={16} color="#a855f7" />
                  <Text style={styles.addSeasonText}>Add Season</Text>
                </TouchableOpacity>
              </View>

              {item.seasons.length === 0 ? (
                <Text style={styles.noSeasonsText}>No seasons added yet</Text>
              ) : (
                item.seasons.map((season) => (
                  <View key={season.id} style={styles.seasonCard}>
                    <TouchableOpacity 
                      style={styles.seasonHeader}
                      onPress={() => toggleSeason(season.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.seasonTitle}>Season {season.seasonNumber}</Text>
                      <View style={styles.seasonMeta}>
                        <Text style={styles.episodeCount}>
                          {season.episodes.length} {season.episodes.length === 1 ? 'Episode' : 'Episodes'}
                        </Text>
                        <Feather 
                          name="chevron-right"
                          size={20} 
                          color="#666" 
                          style={{
                            transform: [{ rotate: expandedSeasons.includes(season.id) ? '90deg' : '0deg' }]
                          }}
                        />
                      </View>
                    </TouchableOpacity>

                    {expandedSeasons.includes(season.id) && (
                      <View style={styles.episodesList}>
                        {season.episodes.map((episode) => (
                          <TouchableOpacity
                            key={episode.id}
                            style={styles.episodeCard}
                            onPress={() => router.push({
                              pathname: '/edit-episode',
                              params: {
                                seriesId: id,
                                seasonId: season.id,
                                episodeId: episode.id,
                                mode: 'edit'
                              }
                            })}
                            activeOpacity={0.7}
                          >
                            <View style={styles.episodeNumber}>
                              <Text style={styles.episodeNumberText}>{episode.episodeNumber}</Text>
                            </View>
                            <View style={styles.episodeContent}>
                              <Text style={styles.episodeTitle}>
                                {episode.title || `Episode ${episode.episodeNumber}`}
                              </Text>
                              {episode.synopsis && (
                                <Text style={styles.episodeSynopsis} numberOfLines={2}>
                                  {episode.synopsis}
                                </Text>
                              )}
                            </View>
                            <Feather name="chevron-right" size={16} color="#666" />
                          </TouchableOpacity>
                        ))}
                        
                        <TouchableOpacity 
                          style={styles.addEpisodeButton}
                          onPress={() => handleAddEpisode(season.id, season.seasonNumber)}
                        >
                          <Feather name="plus" size={16} color="#a855f7" />
                          <Text style={styles.addEpisodeText}>Add Episode</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                ))
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  hero: {
    height: 600,
    position: 'relative',
  },
  poster: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  heroContent: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e50914',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  yearBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  yearText: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: '500',
  },
  genre: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
    gap: 8,
    flex: 1,
    justifyContent: 'center',
  },
  playButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(42, 42, 42, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  synopsisSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  synopsis: {
    fontSize: 16,
    lineHeight: 24,
    color: '#ccc',
  },
  seasonsSection: {
    marginBottom: 32,
  },
  seasonsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addSeasonButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#1a1a1a',
  },
  addSeasonText: {
    color: '#a855f7',
    fontSize: 13,
    fontWeight: '500',
  },
  noSeasonsText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
  },
  seasonCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  seasonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  seasonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  seasonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  episodeCount: {
    fontSize: 13,
    color: '#999',
  },
  episodesList: {
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },
  episodeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  episodeNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  episodeNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  episodeContent: {
    flex: 1,
  },
  episodeTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 2,
  },
  episodeSynopsis: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  addEpisodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  addEpisodeText: {
    color: '#a855f7',
    fontSize: 13,
    fontWeight: '500',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
});