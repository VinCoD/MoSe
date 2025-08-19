import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { useContent } from "@/hooks/content-store";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { isMovie, isSeries } from "@/types/content";
import { useMemo } from "react";

export default function WatchlistScreen() {
  const { content, updateContent } = useContent();

  const watchlistContent = useMemo(() => {
    return content.filter(item => item.watchStatus === 'want-to-watch');
  }, [content]);

  const priorityContent = useMemo(() => {
    return watchlistContent.sort((a, b) => {
      const ratingDiff = (b.rating || 0) - (a.rating || 0);
      if (ratingDiff !== 0) return ratingDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [watchlistContent]);

  const handleMarkAsWatching = (id: string) => {
    updateContent(id, { watchStatus: 'watching' });
  };

  const handleRemoveFromWatchlist = (id: string, title: string) => {
    Alert.alert(
      "Remove from Watchlist",
      `Remove "${title}" from your watchlist?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: () => updateContent(id, { watchStatus: undefined })
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Watchlist</Text>
        <Text style={styles.headerSubtitle}>
          {watchlistContent.length} {watchlistContent.length === 1 ? 'title' : 'titles'} to watch
        </Text>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/add-content')}
        >
          <Feather name="plus" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Add Content</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/collections')}
        >
          <Feather name="bookmark" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Collections</Text>
        </TouchableOpacity>
      </View>

      {watchlistContent.length === 0 ? (
        <View style={styles.emptyState}>
          <Feather name="clock" size={48} color="#808080" />
          <Text style={styles.emptyTitle}>Your watchlist is empty</Text>
          <Text style={styles.emptyText}>
            Add movies and TV shows you want to watch later
          </Text>
          <TouchableOpacity 
            style={styles.emptyButton}
            onPress={() => router.push('/add-content')}
          >
            <Feather name="plus" size={20} color="#fff" />
            <Text style={styles.emptyButtonText}>Add Your First Title</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {priorityContent.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recommended Next</Text>
              <Text style={styles.sectionSubtitle}>Based on ratings and your preferences</Text>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.horizontalContent}>
                  {priorityContent.slice(0, 5).map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.priorityCard}
                      onPress={() => router.push(`/content/${item.id}`)}
                    >
                      <Image source={{ uri: item.imageUrl }} style={styles.priorityCardImage} />
                      <View style={styles.priorityCardOverlay}>
                        {item.rating && (
                          <View style={styles.ratingBadge}>
                            <Feather name="star" size={10} color="#fbbf24" style={{ opacity: 0 }}/>
                            <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                          </View>
                        )}
                        <View style={styles.typeBadge}>
                          {isMovie(item) ? (
                            <Feather name="film" size={10} color="#fff" />
                          ) : (
                            <Feather name="tv" size={10} color="#fff" />
                          )}
                        </View>
                      </View>
                      <View style={styles.priorityCardContent}>
                        <Text style={styles.priorityCardTitle} numberOfLines={2}>{item.title}</Text>
                        <Text style={styles.priorityCardYear}>{item.year}</Text>
                        <TouchableOpacity
                          style={styles.startWatchingButton}
                          onPress={(e) => {
                            e.stopPropagation();
                            handleMarkAsWatching(item.id);
                          }}
                        >
                          <Feather name="play" size={12} color="#fff" />
                          <Text style={styles.startWatchingText}>Start Watching</Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>All Watchlist Items</Text>
            
            <View style={styles.watchlistGrid}>
              {watchlistContent.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.watchlistCard}
                  onPress={() => router.push(`/content/${item.id}`)}
                >
                  <Image source={{ uri: item.imageUrl }} style={styles.watchlistCardImage} />
                  <View style={styles.watchlistCardContent}>
                    <Text style={styles.watchlistCardTitle} numberOfLines={2}>{item.title}</Text>
                    <View style={styles.watchlistCardMeta}>
                      <View style={styles.watchlistCardType}>
                        {isMovie(item) ? (
                          <Feather name="film" size={12} color="#808080" />
                        ) : (
                          <Feather name="tv" size={12} color="#808080" />
                        )}
                        <Text style={styles.watchlistCardTypeText}>
                          {isMovie(item) ? 'Movie' : 'Series'}
                        </Text>
                      </View>
                      {item.year && (
                        <Text style={styles.watchlistCardYear}>{item.year}</Text>
                      )}
                    </View>
                    
                    {item.rating && (
                      <View style={styles.watchlistCardRating}>
                        <Feather name="star" size={10} color="#fbbf24" style={{ opacity: 0 }} />
                        <Text style={styles.watchlistCardRatingText}>{item.rating.toFixed(1)}</Text>
                      </View>
                    )}
                    
                    <View style={styles.watchlistCardActions}>
                      <TouchableOpacity
                        style={styles.watchButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleMarkAsWatching(item.id);
                        }}
                      >
                        <Feather name="play" size={14} color="#fff" />
                        <Text style={styles.watchButtonText}>Watch</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleRemoveFromWatchlist(item.id, item.title);
                        }}
                      >
                        <Text style={styles.removeButtonText}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
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
  header: {
    padding: 16,
    paddingTop: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#808080',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    color: '#808080',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e50914',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#808080',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  horizontalContent: {
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 16,
  },
  priorityCard: {
    width: 140,
    marginRight: 12,
    position: 'relative',
  },
  priorityCardImage: {
    width: '100%',
    aspectRatio: 2/3,
    borderRadius: 8,
    backgroundColor: '#1a1a1a',
  },
  priorityCardOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingBadge: {
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
  typeBadge: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 4,
    borderRadius: 4,
  },
  priorityCardContent: {
    marginTop: 8,
  },
  priorityCardTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: 4,
  },
  priorityCardYear: {
    color: '#808080',
    fontSize: 12,
    marginBottom: 8,
  },
  startWatchingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e50914',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
    gap: 4,
  },
  startWatchingText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  watchlistGrid: {
    paddingHorizontal: 16,
  },
  watchlistCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  watchlistCardImage: {
    width: 80,
    height: 120,
    borderRadius: 4,
    backgroundColor: '#333',
    marginRight: 12,
  },
  watchlistCardContent: {
    flex: 1,
  },
  watchlistCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
    lineHeight: 20,
  },
  watchlistCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  watchlistCardType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  watchlistCardTypeText: {
    fontSize: 12,
    color: '#808080',
    fontWeight: '500',
  },
  watchlistCardYear: {
    fontSize: 12,
    color: '#808080',
  },
  watchlistCardRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  watchlistCardRatingText: {
    fontSize: 12,
    color: '#fbbf24',
    fontWeight: '600',
  },
  watchlistCardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  watchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e50914',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 4,
    flex: 1,
    justifyContent: 'center',
  },
  watchButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  removeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#333',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#808080',
    fontSize: 12,
    fontWeight: '600',
  },
});