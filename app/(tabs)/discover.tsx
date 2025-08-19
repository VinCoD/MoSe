import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, TextInput, Dimensions } from "react-native";
import { useContent } from "@/hooks/content-store";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { isMovie, isSeries, GENRES, WATCH_STATUSES } from "@/types/content";
import { useState, useMemo } from "react";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get('window');

export default function DiscoverScreen() {
  const { content } = useContent();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'year' | 'updated'>('rating');

  const filteredAndSortedContent = useMemo(() => {
    let filtered = content;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.synopsis.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.genre && item.genre.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by genre
    if (selectedGenre !== 'all') {
      filtered = filtered.filter(item => item.genre === selectedGenre);
    }

    // Sort content
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'year':
          return parseInt(b.year || '0') - parseInt(a.year || '0');
        case 'updated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        default:
          return 0;
      }
    });
  }, [content, searchQuery, selectedGenre, sortBy]);

  const topRatedContent = useMemo(() => {
    return content
      .filter(item => item.rating && item.rating >= 8)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 10);
  }, [content]);

  const recentlyAddedContent = useMemo(() => {
    return content
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
  }, [content]);

  const watchingNowContent = useMemo(() => {
    return content.filter(item => item.watchStatus === 'watching');
  }, [content]);

  const genreStats = useMemo(() => {
    const stats: { [key: string]: number } = {};
    content.forEach(item => {
      if (item.genre) {
        stats[item.genre] = (stats[item.genre] || 0) + 1;
      }
    });
    return Object.entries(stats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  }, [content]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Search and Filters */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="#808080" />
          <TextInput
            style={styles.searchInput}
            placeholder="Discover movies and shows..."
            placeholderTextColor="#808080"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
        >
          <TouchableOpacity
            style={[styles.filterChip, selectedGenre === 'all' && styles.filterChipActive]}
            onPress={() => setSelectedGenre('all')}
          >
            <Text style={[styles.filterText, selectedGenre === 'all' && styles.filterTextActive]}>
              All Genres
            </Text>
          </TouchableOpacity>
          {GENRES.map((genre) => (
            <TouchableOpacity
              key={genre}
              style={[styles.filterChip, selectedGenre === genre && styles.filterChipActive]}
              onPress={() => setSelectedGenre(genre)}
            >
              <Text style={[styles.filterText, selectedGenre === genre && styles.filterTextActive]}>
                {genre}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.sortContainer}
        >
          <TouchableOpacity
            style={[styles.sortChip, sortBy === 'rating' && styles.sortChipActive]}
            onPress={() => setSortBy('rating')}
          >
            <Feather name="star" size={14} color={sortBy === 'rating' ? '#fff' : '#808080'} />
            <Text style={[styles.sortText, sortBy === 'rating' && styles.sortTextActive]}>
              Top Rated
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortChip, sortBy === 'year' && styles.sortChipActive]}
            onPress={() => setSortBy('year')}
          >
            <Feather name="calendar" size={14} color={sortBy === 'year' ? '#fff' : '#808080'} />
            <Text style={[styles.sortText, sortBy === 'year' && styles.sortTextActive]}>
              Newest
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortChip, sortBy === 'updated' && styles.sortChipActive]}
            onPress={() => setSortBy('updated')}
          >
            <Feather name="clock" size={14} color={sortBy === 'updated' ? '#fff' : '#808080'} />
            <Text style={[styles.sortText, sortBy === 'updated' && styles.sortTextActive]}>
              Recently Updated
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsSection}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{content.length}</Text>
            <Text style={styles.statLabel}>Total Items</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{content.filter(isMovie).length}</Text>
            <Text style={styles.statLabel}>Movies</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{content.filter(isSeries).length}</Text>
            <Text style={styles.statLabel}>TV Shows</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{watchingNowContent.length}</Text>
            <Text style={styles.statLabel}>Watching</Text>
          </View>
        </View>
      </View>

      {/* Currently Watching */}
      {watchingNowContent.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Continue Watching</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.horizontalContent}>
              {watchingNowContent.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.continueCard}
                  onPress={() => router.push(`/content/${item.id}`)}
                >
                  <Image source={{ uri: item.imageUrl }} style={styles.continueCardImage} />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.continueCardGradient}
                  />
                  <View style={styles.continueCardContent}>
                    <Text style={styles.continueCardTitle} numberOfLines={1}>{item.title}</Text>
                    <View style={styles.continueCardMeta}>
                      {isMovie(item) ? (
                        <Feather name="film" size={12} color="#10b981" />
                      ) : (
                        <Feather name="tv" size={12} color="#10b981" />
                      )}
                      <Text style={styles.continueCardStatus}>Watching</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Top Rated */}
      {topRatedContent.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="trending-up" size={20} color="#e50914" />
            <Text style={styles.sectionTitle}>Top Rated</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.horizontalContent}>
              {topRatedContent.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.ratedCard}
                  onPress={() => router.push(`/content/${item.id}`)}
                >
                  <Image source={{ uri: item.imageUrl }} style={styles.ratedCardImage} />
                  <View style={styles.ratingBadge}>
                    <Feather name="star" size={10} color="#fbbf24" fill="#fbbf24" />
                    <Text style={styles.ratingText}>{item.rating?.toFixed(1)}</Text>
                  </View>
                  <Text style={styles.ratedCardTitle} numberOfLines={2}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Recently Added */}
      {recentlyAddedContent.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recently Added</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.horizontalContent}>
              {recentlyAddedContent.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.horizontalCard}
                  onPress={() => router.push(`/content/${item.id}`)}
                >
                  <Image source={{ uri: item.imageUrl }} style={styles.horizontalCardImage} />
                  <Text style={styles.horizontalCardTitle} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.horizontalCardYear}>{item.year}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Genre Statistics */}
      {genreStats.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Genres</Text>
          <View style={styles.genreStats}>
            {genreStats.map(([genre, count]) => (
              <TouchableOpacity
                key={genre}
                style={styles.genreStatCard}
                onPress={() => setSelectedGenre(genre)}
              >
                <Text style={styles.genreStatName}>{genre}</Text>
                <Text style={styles.genreStatCount}>{count} {count === 1 ? 'item' : 'items'}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* All Content Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Content</Text>
        <View style={styles.grid}>
          {filteredAndSortedContent.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.gridCard}
              onPress={() => router.push(`/content/${item.id}`)}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.gridCardImage} />
              <View style={styles.gridCardOverlay}>
                {item.rating && (
                  <View style={styles.gridRatingBadge}>
                    <Feather name="star" size={8} color="#fbbf24" fill="#fbbf24" />
                    <Text style={styles.gridRatingText}>{item.rating.toFixed(1)}</Text>
                  </View>
                )}
                <View style={styles.gridTypeBadge}>
                  {isMovie(item) ? (
                    <Feather name="film" size={8} color="#fff" />
                  ) : (
                    <Feather name="tv" size={8} color="#fff" />
                  )}
                </View>
              </View>
              <View style={styles.gridCardContent}>
                <Text style={styles.gridCardTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.gridCardMeta}>{item.year} • {item.genre}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000000',
    },
    searchSection: {
      padding: 16,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#1a1a1a',
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 12,
      marginBottom: 16,
    },
    searchInput: {
      flex: 1,
      color: '#fff',
      fontSize: 16,
    },
    filtersContainer: {
      marginBottom: 12,
    },
    filterChip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: '#1a1a1a',
      marginRight: 8,
    },
    filterChipActive: {
      backgroundColor: '#e50914',
    },
    filterText: {
      color: '#808080',
      fontSize: 14,
      fontWeight: '500',
    },
    filterTextActive: {
      color: '#fff',
    },
    sortContainer: {
      marginTop: 8,
    },
    sortChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: '#1a1a1a',
      marginRight: 8,
      gap: 4,
    },
    sortChipActive: {
      backgroundColor: '#e50914',
    },
    sortText: {
      color: '#808080',
      fontSize: 12,
      fontWeight: '500',
    },
    sortTextActive: {
      color: '#fff',
    },
    statsSection: {
      paddingHorizontal: 16,
      marginBottom: 24,
    },
    statsGrid: {
      flexDirection: 'row',
      gap: 8,
    },
    statCard: {
      flex: 1,
      backgroundColor: '#1a1a1a',
      borderRadius: 8,
      padding: 16,
      alignItems: 'center',
    },
    statNumber: {
      fontSize: 24,
      fontWeight: '700',
      color: '#e50914',
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: '#808080',
      fontWeight: '500',
    },
    section: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      marginBottom: 12,
      gap: 8,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: '#fff',
      paddingHorizontal: 16,
      marginBottom: 12,
    },
    horizontalContent: {
      flexDirection: 'row',
      paddingLeft: 16,
      paddingRight: 16,
    },
    continueCard: {
      width: 160,
      marginRight: 12,
      position: 'relative',
    },
    continueCardImage: {
      width: '100%',
      aspectRatio: 16/9,
      borderRadius: 8,
      backgroundColor: '#1a1a1a',
    },
    continueCardGradient: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 60,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
    },
    continueCardContent: {
      position: 'absolute',
      bottom: 8,
      left: 8,
      right: 8,
    },
    continueCardTitle: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 4,
    },
    continueCardMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    continueCardStatus: {
      color: '#10b981',
      fontSize: 12,
      fontWeight: '500',
    },
    ratedCard: {
      width: 120,
      marginRight: 12,
      position: 'relative',
    },
    ratedCardImage: {
      width: '100%',
      aspectRatio: 2/3,
      borderRadius: 4,
      backgroundColor: '#1a1a1a',
    },
    ratingBadge: {
      position: 'absolute',
      top: 6,
      right: 6,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.8)',
      paddingHorizontal: 6,
      paddingVertical: 3,
      borderRadius: 4,
      gap: 2,
    },
    ratingText: {
      color: '#fff',
      fontSize: 10,
      fontWeight: '600',
    },
    ratedCardTitle: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '500',
      marginTop: 6,
      lineHeight: 16,
    },
    horizontalCard: {
      width: 120,
      marginRight: 12,
    },
    horizontalCardImage: {
      width: '100%',
      aspectRatio: 2/3,
      borderRadius: 4,
      backgroundColor: '#1a1a1a',
    },
    horizontalCardTitle: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '500',
      marginTop: 6,
      lineHeight: 16,
    },
    horizontalCardYear: {
      color: '#808080',
      fontSize: 10,
      marginTop: 2,
    },
    genreStats: {
      paddingHorizontal: 16,
    },
    genreStatCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#1a1a1a',
      padding: 16,
      borderRadius: 8,
      marginBottom: 8,
    },
    genreStatName: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    genreStatCount: {
      color: '#808080',
      fontSize: 14,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 8,
    },
    gridCard: {
      width: '50%',
      padding: 8,
      position: 'relative',
    },
    gridCardImage: {
      width: '100%',
      aspectRatio: 2/3,
      borderRadius: 4,
      backgroundColor: '#1a1a1a',
    },
    gridCardOverlay: {
      position: 'absolute',
      top: 16,
      left: 16,
      right: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    gridRatingBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.8)',
      paddingHorizontal: 6,
      paddingVertical: 3,
      borderRadius: 4,
      gap: 2,
    },
    gridRatingText: {
      color: '#fff',
      fontSize: 9,
      fontWeight: '600',
    },
    gridTypeBadge: {
      backgroundColor: 'rgba(0,0,0,0.8)',
      padding: 4,
      borderRadius: 4,
    },
    gridCardContent: {
      marginTop: 8,
    },
    gridCardTitle: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '600',
    },
    gridCardMeta: {
      color: '#808080',
      fontSize: 12,
      marginTop: 2,
    },
});