import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useState } from "react";
import { useContent } from "@/hooks/content-store";
import { Feather } from "@expo/vector-icons";

export default function AddContentScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const { addMovie, addSeries } = useContent();
  
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [seasons, setSeasons] = useState([{ 
    seasonNumber: 1, 
    episodes: [{ episodeNumber: 1, title: '', synopsis: '' }] 
  }]);

  const isMovie = type === 'movie';

  const handleSave = () => {
    if (!title || !imageUrl || !synopsis) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (isMovie) {
      addMovie({ title, imageUrl, synopsis, year, genre });
    } else {
      const formattedSeasons = seasons.map(s => ({
        id: `season-${s.seasonNumber}-${Date.now()}`,
        seasonNumber: s.seasonNumber,
        episodes: s.episodes.map(e => ({
          id: `episode-${e.episodeNumber}-${Date.now()}`,
          episodeNumber: e.episodeNumber,
          title: e.title || `Episode ${e.episodeNumber}`,
          synopsis: e.synopsis,
          airDate: undefined
        }))
      }));
      addSeries({ title, imageUrl, synopsis, year, genre, seasons: formattedSeasons });
    }

    router.back();
  };

  const addSeason = () => {
    setSeasons([...seasons, { 
      seasonNumber: seasons.length + 1, 
      episodes: [{ episodeNumber: 1, title: '', synopsis: '' }] 
    }]);
  };

  const removeSeason = (index: number) => {
    if (seasons.length > 1) {
      setSeasons(seasons.filter((_, i) => i !== index));
    }
  };

  const addEpisode = (seasonIndex: number) => {
    const newSeasons = [...seasons];
    const episodeCount = newSeasons[seasonIndex].episodes.length;
    newSeasons[seasonIndex].episodes.push({
      episodeNumber: episodeCount + 1,
      title: '',
      synopsis: ''
    });
    setSeasons(newSeasons);
  };

  const removeEpisode = (seasonIndex: number, episodeIndex: number) => {
    const newSeasons = [...seasons];
    if (newSeasons[seasonIndex].episodes.length > 1) {
      newSeasons[seasonIndex].episodes.splice(episodeIndex, 1);
      setSeasons(newSeasons);
    }
  };

  const updateEpisode = (seasonIndex: number, episodeIndex: number, field: string, value: string) => {
    const newSeasons = [...seasons];
    newSeasons[seasonIndex].episodes[episodeIndex] = {
      ...newSeasons[seasonIndex].episodes[episodeIndex],
      [field]: value
    };
    setSeasons(newSeasons);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder={isMovie ? "Enter movie title" : "Enter series title"}
              placeholderTextColor="#666"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Poster Image URL *</Text>
            <TextInput
              style={styles.input}
              value={imageUrl}
              onChangeText={setImageUrl}
              placeholder="https://example.com/poster.jpg"
              placeholderTextColor="#666"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Year</Text>
              <TextInput
                style={styles.input}
                value={year}
                onChangeText={setYear}
                placeholder="2024"
                placeholderTextColor="#666"
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 2, marginLeft: 12 }]}>
              <Text style={styles.label}>Genre</Text>
              <TextInput
                style={styles.input}
                value={genre}
                onChangeText={setGenre}
                placeholder="Drama, Action, etc."
                placeholderTextColor="#666"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{isMovie ? 'Synopsis *' : 'Series Synopsis *'}</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={synopsis}
              onChangeText={setSynopsis}
              placeholder={isMovie ? "Write your movie synopsis..." : "Write the overall series synopsis..."}
              placeholderTextColor="#666"
              multiline
              numberOfLines={4}
            />
          </View>

          {!isMovie && (
            <>
              <Text style={styles.sectionTitle}>Seasons & Episodes</Text>
              {seasons.map((season, seasonIndex) => (
                <View key={seasonIndex} style={styles.seasonContainer}>
                  <View style={styles.seasonHeader}>
                    <Text style={styles.seasonTitle}>Season {season.seasonNumber}</Text>
                    {seasons.length > 1 && (
                      <TouchableOpacity onPress={() => removeSeason(seasonIndex)}>
                        <Feather name="minus" size={20} color="#ff4444" />
                      </TouchableOpacity>
                    )}
                  </View>
                  
                  {season.episodes.map((episode, episodeIndex) => (
                    <View key={episodeIndex} style={styles.episodeContainer}>
                      <View style={styles.episodeHeader}>
                        <Text style={styles.episodeTitle}>Episode {episode.episodeNumber}</Text>
                        {season.episodes.length > 1 && (
                          <TouchableOpacity onPress={() => removeEpisode(seasonIndex, episodeIndex)}>
                            <Feather name="minus" size={16} color="#ff4444" />
                          </TouchableOpacity>
                        )}
                      </View>
                      <TextInput
                        style={[styles.input, styles.episodeInput]}
                        value={episode.title}
                        onChangeText={(text) => updateEpisode(seasonIndex, episodeIndex, 'title', text)}
                        placeholder="Episode title (optional)"
                        placeholderTextColor="#666"
                      />
                      <TextInput
                        style={[styles.input, styles.textArea, styles.episodeInput]}
                        value={episode.synopsis}
                        onChangeText={(text) => updateEpisode(seasonIndex, episodeIndex, 'synopsis', text)}
                        placeholder="Episode synopsis"
                        placeholderTextColor="#666"
                        multiline
                        numberOfLines={3}
                      />
                    </View>
                  ))}
                  
                  <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => addEpisode(seasonIndex)}
                  >
                    <Feather name="plus" size={16} color="#a855f7" />
                    <Text style={styles.addButtonText}>Add Episode</Text>
                  </TouchableOpacity>
                </View>
              ))}
              
              <TouchableOpacity 
                style={[styles.addButton, styles.addSeasonButton]}
                onPress={addSeason}
              >
                <Feather name="plus" size={20} color="#a855f7" />
                <Text style={styles.addButtonText}>Add Season</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
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
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 20,
    marginTop: 10,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  seasonContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  seasonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seasonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  episodeContainer: {
    backgroundColor: '#0a0a0a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  episodeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  episodeTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#e50914',
  },
  episodeInput: {
    backgroundColor: '#1a1a1a',
    marginBottom: 8,
    borderColor: '#333333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e50914',
    borderStyle: 'dashed',
    gap: 8,
  },
  addSeasonButton: {
    marginTop: 8,
  },
  addButtonText: {
    color: '#e50914',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    backgroundColor: '#000000',
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
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
    borderRadius: 8,
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