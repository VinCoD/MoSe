import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { useContent } from "@/hooks/content-store";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { isMovie, isSeries } from "@/types/content";

export default function MyListScreen() {
  const { content, deleteContent } = useContent();

  const handleDelete = (id: string, title: string) => {
    Alert.alert(
      "Remove from My List",
      `Remove "${title}" from your list?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: () => deleteContent(id)
        }
      ]
    );
  };

  const movies = content.filter(isMovie);
  const series = content.filter(isSeries);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {content.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Your list is empty</Text>
          <Text style={styles.emptyText}>
            Titles you add to your list will appear here.
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>My List</Text>
            <Text style={styles.headerSubtitle}>{content.length} {content.length === 1 ? 'title' : 'titles'}</Text>
          </View>

          <View style={styles.contentGrid}>
            {content.map((item) => {
              const totalEpisodes = isSeries(item) ? item.seasons.reduce((acc, season) => acc + season.episodes.length, 0) : 0;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.gridItem}
                  onPress={() => router.push(`/content/${item.id}`)}
                  activeOpacity={0.8}
                >
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: item.imageUrl }} style={styles.gridImage} />
                    <View style={styles.imageOverlay}>
                      <TouchableOpacity 
                        style={styles.removeButton}
                        onPress={() => handleDelete(item.id, item.title)}
                      >
                        <Feather name="check" size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.gridContent}>
                    <Text style={styles.gridTitle} numberOfLines={2}>{item.title}</Text>
                    <View style={styles.gridMeta}>
                      <View style={styles.typeBadge}>
                        {isMovie(item) ? (
                          <Feather name="film" size={10} color="#808080" />
                        ) : (
                          <Feather name="tv" size={10} color="#808080" />
                        )}
                        <Text style={styles.typeText}>
                          {isMovie(item) ? 'Movie' : 'Series'}
                        </Text>
                      </View>
                      {item.year && (
                        <Text style={styles.yearText}>{item.year}</Text>
                      )}
                    </View>
                    {isSeries(item) && (
                      <Text style={styles.episodeCount}>
                        {item.seasons.length} {item.seasons.length === 1 ? 'Season' : 'Seasons'}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
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
    fontSize: 14,
    color: '#808080',
  },
  contentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  gridItem: {
    width: '33.333%',
    padding: 4,
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    aspectRatio: 2/3,
    borderRadius: 4,
    backgroundColor: '#1a1a1a',
  },
  imageOverlay: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  gridContent: {
    marginTop: 6,
  },
  gridTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 16,
    marginBottom: 4,
  },
  gridMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  typeText: {
    fontSize: 9,
    color: '#808080',
    fontWeight: '500',
  },
  yearText: {
    fontSize: 9,
    color: '#808080',
  },
  episodeCount: {
    fontSize: 9,
    color: '#808080',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 120,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    color: '#808080',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});