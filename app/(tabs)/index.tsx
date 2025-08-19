import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Image, ActivityIndicator, Dimensions } from "react-native";
import { useContent } from "@/hooks/content-store";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { isMovie, isSeries, type ContentItem } from "@/types/content";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { filteredContent, searchQuery, setSearchQuery, filterType, setFilterType, isLoading, content } = useContent();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e50914" />
      </View>
    );
  }

  const featuredContent = content[0];
  const movies = content.filter(isMovie);
  const series = content.filter(isSeries);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Featured Hero Section */}
      {featuredContent && (
        <View style={styles.heroSection}>
          <Image source={{ uri: featuredContent.imageUrl }} style={styles.heroImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)', '#000000']}
            style={styles.heroGradient}
          />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>{featuredContent.title}</Text>
            <Text style={styles.heroSynopsis} numberOfLines={3}>
              {featuredContent.synopsis}
            </Text>
            <View style={styles.heroButtons}>
              <TouchableOpacity 
                style={styles.playButton}
                onPress={() => router.push(`/content/${featuredContent.id}`)}
              >
                <Feather name="play" size={20} color="#000" fill="#000" />
                <Text style={styles.playButtonText}>View Details</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.infoButton}>
                <Feather name="info" size={20} color="#fff" />
                <Text style={styles.infoButtonText}>More Info</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Quick Access */}
      <View style={styles.quickAccess}>
        <TouchableOpacity 
          style={styles.quickAccessButton}
          onPress={() => router.push('/watchlist')}
        >
          <Feather name="clock" size={20} color="#e50914" />
          <Text style={styles.quickAccessText}>Watchlist</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickAccessButton}
          onPress={() => router.push('/discover')}
        >
          <Feather name="trending-up" size={20} color="#e50914" />
          <Text style={styles.quickAccessText}>Discover</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickAccessButton}
          onPress={() => router.push('/collections')}
        >
          <Feather name="folder" size={20} color="#e50914" />
          <Text style={styles.quickAccessText}>Collections</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="#808080" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for movies, TV shows..."
            placeholderTextColor="#808080"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Filter Chips */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        <TouchableOpacity
          style={[styles.filterChip, filterType === 'all' && styles.filterChipActive]}
          onPress={() => setFilterType('all')}
        >
          <Text style={[styles.filterText, filterType === 'all' && styles.filterTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, filterType === 'movies' && styles.filterChipActive]}
          onPress={() => setFilterType('movies')}
        >
          <Feather name="film" size={16} color={filterType === 'movies' ? '#fff' : '#808080'} />
          <Text style={[styles.filterText, filterType === 'movies' && styles.filterTextActive]}>
            Movies
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, filterType === 'series' && styles.filterChipActive]}
          onPress={() => setFilterType('series')}
        >
          <Feather name="tv" size={16} color={filterType === 'series' ? '#fff' : '#808080'} />
          <Text style={[styles.filterText, filterType === 'series' && styles.filterTextActive]}>
            TV Shows
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Content Sections */}
      {filteredContent.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No content yet</Text>
          <Text style={styles.emptyText}>
            Start by adding your first movie or TV show synopsis
          </Text>
        </View>
      ) : (
        <>
          {(filterType === 'all' || filterType === 'movies') && movies.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Movies</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                <View style={styles.horizontalContent}>
                  {movies.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.horizontalCard}
                      onPress={() => router.push(`/content/${item.id}`)}
                      activeOpacity={0.8}
                    >
                      <Image source={{ uri: item.imageUrl }} style={styles.horizontalCardImage} />
                      <Text style={styles.horizontalCardTitle} numberOfLines={2}>{item.title}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {(filterType === 'all' || filterType === 'series') && series.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>TV Shows</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                <View style={styles.horizontalContent}>
                  {series.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.horizontalCard}
                      onPress={() => router.push(`/content/${item.id}`)}
                      activeOpacity={0.8}
                    >
                      <Image source={{ uri: item.imageUrl }} style={styles.horizontalCardImage} />
                      <Text style={styles.horizontalCardTitle} numberOfLines={2}>{item.title}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {/* Grid View for Search Results */}
          {searchQuery && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Search Results</Text>
              <View style={styles.grid}>
                {filteredContent.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.gridCard}
                    onPress={() => router.push(`/content/${item.id}`)}
                    activeOpacity={0.8}
                  >
                    <Image source={{ uri: item.imageUrl }} style={styles.gridCardImage} />
                    <View style={styles.gridCardOverlay}>
                      <View style={styles.cardBadge}>
                        {isMovie(item) ? (
                          <Feather name="film" size={12} color="#fff" />
                        ) : (
                          <Feather name="tv" size={12} color="#fff" />
                        )}
                        <Text style={styles.cardBadgeText}>
                          {isMovie(item) ? 'Movie' : 'Series'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.gridCardContent}>
                      <Text style={styles.gridCardTitle} numberOfLines={1}>{item.title}</Text>
                      {item.year && (
                        <Text style={styles.gridCardYear}>{item.year}</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000000',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000000',
    },
    heroSection: {
      height: 500,
      position: 'relative',
    },
    heroImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    heroGradient: {
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
    heroTitle: {
      fontSize: 32,
      fontWeight: '700',
      color: '#fff',
      marginBottom: 8,
      textShadowColor: 'rgba(0,0,0,0.8)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    heroSynopsis: {
      fontSize: 16,
      color: '#fff',
      lineHeight: 22,
      marginBottom: 20,
      textShadowColor: 'rgba(0,0,0,0.8)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    heroButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    quickAccess: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      marginBottom: 16,
      gap: 8,
    },
    quickAccessButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#1a1a1a',
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 8,
      gap: 6,
      justifyContent: 'center',
    },
    quickAccessText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '600',
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
    infoButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(109, 109, 110, 0.7)',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 6,
      gap: 8,
      flex: 1,
      justifyContent: 'center',
    },
    infoButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    searchContainer: {
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
    },
    searchInput: {
      flex: 1,
      color: '#fff',
      fontSize: 16,
    },
    filterContainer: {
      maxHeight: 50,
      marginBottom: 16,
    },
    filterContent: {
      paddingHorizontal: 16,
      gap: 8,
      flexDirection: 'row',
    },
    filterChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: '#1a1a1a',
      gap: 6,
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
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: '#fff',
      marginBottom: 12,
      paddingHorizontal: 16,
    },
    horizontalScroll: {
      paddingLeft: 16,
    },
    horizontalContent: {
      flexDirection: 'row',
      paddingRight: 16,
    },
    horizontalCard: {
      width: 120,
      marginRight: 8,
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
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 8,
    },
    gridCard: {
      width: '50%',
      padding: 8,
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
    },
    cardBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.8)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      gap: 4,
    },
    cardBadgeText: {
      color: '#fff',
      fontSize: 10,
      fontWeight: '600',
    },
    gridCardContent: {
      marginTop: 8,
    },
    gridCardTitle: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '600',
    },
    gridCardYear: {
      color: '#808080',
      fontSize: 12,
      marginTop: 2,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 100,
      paddingHorizontal: 32,
    },
    emptyTitle: {
      color: '#fff',
      fontSize: 24,
      fontWeight: '700',
      marginBottom: 8,
    },
    emptyText: {
      color: '#808080',
      fontSize: 16,
      textAlign: 'center',
      lineHeight: 22,
    },
});