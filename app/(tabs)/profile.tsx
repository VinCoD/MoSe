import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Alert, Dimensions } from "react-native";
import { useContent } from "@/hooks/content-store";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { isMovie, isSeries, WATCH_STATUSES } from "@/types/content";
import { useMemo } from "react";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { content } = useContent();

  const stats = useMemo(() => {
    const totalMovies = content.filter(isMovie).length;
    const totalSeries = content.filter(isSeries).length;
    
    const watchedMovies = content.filter(item => isMovie(item) && item.watchStatus === 'completed').length;
    const watchedSeries = content.filter(item => isSeries(item) && item.watchStatus === 'completed').length;
    
    const currentlyWatching = content.filter(item => item.watchStatus === 'watching').length;
    const favorites = content.filter(item => item.isFavorite).length;
    
    const averageRating = content.length > 0 
      ? content.reduce((acc, item) => acc + (item.rating || 0), 0) / content.filter(item => item.rating).length 
      : 0;

    return {
      totalMovies,
      totalSeries,
      watchedMovies,
      watchedSeries,
      currentlyWatching,
      favorites,
      averageRating: isNaN(averageRating) ? 0 : averageRating,
    };
  }, [content]);

  const handleExportData = () => {
    Alert.alert(
      "Export Data",
      "Export your synopsis collection as JSON?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Export", onPress: () => {
          Alert.alert("Success", "Data exported successfully!");
        }}
      ]
    );
  };

  const handleShareProfile = () => {
    Alert.alert(
      "Share Profile",
      "Share your movie and TV show statistics?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Share", onPress: () => {
          Alert.alert("Shared", "Profile shared successfully!");
        }}
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.profileHeader}>
        <LinearGradient
          colors={['#e50914', '#b20710']}
          style={styles.profileGradient}
        >
          <View style={styles.profileContent}>
            <View style={styles.avatarContainer}>
              <Feather name="user" size={40} color="#fff" />
            </View>
            <Text style={styles.profileName}>Movie Enthusiast</Text>
            <Text style={styles.profileSubtitle}>
              {content.length} {content.length === 1 ? 'title' : 'titles'} in collection
            </Text>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.quickStats}>
        <View style={styles.statsRow}>
          <View style={styles.quickStatCard}>
            <Feather name="film" size={20} color="#e50914" />
            <Text style={styles.quickStatNumber}>{stats.totalMovies}</Text>
            <Text style={styles.quickStatLabel}>Movies</Text>
          </View>
          <View style={styles.quickStatCard}>
            <Feather name="tv" size={20} color="#e50914" />
            <Text style={styles.quickStatNumber}>{stats.totalSeries}</Text>
            <Text style={styles.quickStatLabel}>Series</Text>
          </View>
          <View style={styles.quickStatCard}>
            <Feather name="heart" size={20} color="#e50914" />
            <Text style={styles.quickStatNumber}>{stats.favorites}</Text>
            <Text style={styles.quickStatLabel}>Favorites</Text>
          </View>
          <View style={styles.quickStatCard}>
            <Feather name="star" size={20} color="#e50914" />
            <Text style={styles.quickStatNumber}>{stats.averageRating.toFixed(1)}</Text>
            <Text style={styles.quickStatLabel}>Avg Rating</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Watch Status</Text>
        <View style={styles.statusGrid}>
          {WATCH_STATUSES.map((status) => {
            const count = content.filter(item => item.watchStatus === status.key).length;
            return (
              <View key={status.key} style={styles.statusCard}>
                <View style={[styles.statusIndicator, { backgroundColor: status.color }]} />
                <Text style={styles.statusCount}>{count}</Text>
                <Text style={styles.statusLabel}>{status.label}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        <View style={styles.actionsList}>
          <TouchableOpacity style={styles.actionItem} onPress={handleExportData}>
            <View style={styles.actionIcon}>
              <Feather name="download" size={20} color="#e50914" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Export Data</Text>
              <Text style={styles.actionDescription}>Download your collection as JSON</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem} onPress={handleShareProfile}>
            <View style={styles.actionIcon}>
              <Feather name="share-2" size={20} color="#e50914" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Share Profile</Text>
              <Text style={styles.actionDescription}>Share your statistics</Text>
            </View>
          </TouchableOpacity>
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
  profileHeader: {
    marginBottom: 24,
  },
  profileGradient: {
    paddingTop: 40,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  profileContent: {
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  profileSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  quickStats: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickStatCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  quickStatNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  quickStatLabel: {
    fontSize: 12,
    color: '#808080',
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statusGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  statusCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  statusCount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  statusLabel: {
    fontSize: 10,
    color: '#808080',
    textAlign: 'center',
    fontWeight: '500',
  },
  actionsList: {
    paddingHorizontal: 16,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(229, 9, 20, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 14,
    color: '#808080',
  },
});