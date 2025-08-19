import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function AddScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add to Your List</Text>
        <Text style={styles.subtitle}>Create synopses for your favorite content</Text>
      </View>
      
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => router.push({ pathname: '/add-content', params: { type: 'movie' } })}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#e50914', '#b20710']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.optionGradient}
          >
            <View style={styles.optionIcon}>
              <Feather name="film" size={40} color="#fff" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Movie</Text>
              <Text style={styles.optionDescription}>
                Add a movie with poster and synopsis
              </Text>
            </View>
            <View style={styles.optionArrow}>
              <Feather name="plus" size={24} color="#fff" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => router.push({ pathname: '/add-content', params: { type: 'series' } })}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#1a1a1a', '#333333']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.optionGradient, styles.secondaryOption]}
          >
            <View style={styles.optionIcon}>
              <Feather name="tv" size={40} color="#fff" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>TV Show</Text>
              <Text style={styles.optionDescription}>
                Add a series with seasons and episodes
              </Text>
            </View>
            <View style={styles.optionArrow}>
              <Feather name="plus" size={24} color="#fff" />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Create detailed synopses to remember and share your thoughts about movies and TV shows.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#808080',
    lineHeight: 22,
  },
  optionsContainer: {
    flex: 1,
  },
  option: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  optionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    minHeight: 120,
  },
  secondaryOption: {
    borderWidth: 2,
    borderColor: '#333333',
  },
  optionIcon: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },
  optionDescription: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
  },
  optionArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
});