import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useState, useEffect } from "react";
import { useContent, useContentItem } from "@/hooks/content-store";
import { Feather } from "@expo/vector-icons";
import { isSeries } from "@/types/content";

export default function EditEpisodeScreen() {
  const { seriesId, seasonId, episodeId, mode, episodeNumber, seasonNumber } = useLocalSearchParams<{ 
    seriesId: string;
    seasonId: string;
    episodeId?: string;
    mode: string;
    episodeNumber?: string;
    seasonNumber?: string;
  }>();
  
  const { addEpisodeToSeason, updateEpisode } = useContent();
  const series = useContentItem(seriesId);
  
  const [title, setTitle] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [airDate, setAirDate] = useState('');

  useEffect(() => {
    if (mode === 'edit' && episodeId && series && isSeries(series)) {
      const season = series.seasons.find(s => s.id === seasonId);
      const episode = season?.episodes.find(e => e.id === episodeId);
      if (episode) {
        setTitle(episode.title);
        setSynopsis(episode.synopsis);
        setAirDate(episode.airDate || '');
      }
    }
  }, [mode, episodeId, series, seasonId]);

  const handleSave = () => {
    if (mode === 'add') {
      addEpisodeToSeason(seriesId, seasonId, {
        episodeNumber: parseInt(episodeNumber || '1'),
        title: title || `Episode ${episodeNumber}`,
        synopsis,
        airDate: airDate || undefined
      });
    } else if (episodeId) {
      updateEpisode(seriesId, seasonId, episodeId, {
        title: title || `Episode ${episodeNumber}`,
        synopsis,
        airDate: airDate || undefined
      });
    }
    router.back();
  };

  const isAdding = mode === 'add';
  const displaySeasonNumber = seasonNumber || (series && isSeries(series) ? 
    series.seasons.find(s => s.id === seasonId)?.seasonNumber : 1);
  
  const displayEpisodeNumber = episodeId && series && isSeries(series) ? 
    series.seasons.find(s => s.id === seasonId)?.episodes.find(e => e.id === episodeId)?.episodeNumber : episodeNumber;

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {isAdding ? 'Add Episode' : 'Edit Episode'}
          </Text>
          <Text style={styles.headerSubtitle}>
            Season {displaySeasonNumber} • Episode {displayEpisodeNumber || '1'}
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Episode Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder={`Episode ${displayEpisodeNumber || '1'}`}
              placeholderTextColor="#666"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Air Date (Optional)</Text>
            <TextInput
              style={styles.input}
              value={airDate}
              onChangeText={setAirDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#666"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Synopsis *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={synopsis}
              onChangeText={setSynopsis}
              placeholder="Write the episode synopsis..."
              placeholderTextColor="#666"
              multiline
              numberOfLines={6}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
          <Feather name="x" size={20} color="#999" />
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Feather name="save" size={20} color="#fff" />
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#999',
  },
  form: {
    padding: 20,
    paddingBottom: 100,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
  },
  textArea: {
    minHeight: 150,
    textAlignVertical: 'top',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    backgroundColor: '#0a0a0a',
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cancelButtonText: {
    color: '#999',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#e50914',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});