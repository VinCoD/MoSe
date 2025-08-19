import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Collection } from "@/types/content";

export default function CollectionsScreen() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');

  const createCollection = () => {
    if (!newCollectionName.trim()) {
      Alert.alert("Error", "Please enter a collection name");
      return;
    }

    const newCollection: Collection = {
      id: Date.now().toString(),
      name: newCollectionName.trim(),
      description: newCollectionDescription.trim(),
      contentIds: [],
      isPublic: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setCollections(prev => [...prev, newCollection]);
    setNewCollectionName('');
    setNewCollectionDescription('');
    setShowCreateModal(false);
  };

  const deleteCollection = (id: string, name: string) => {
    Alert.alert(
      "Delete Collection",
      `Delete "${name}" collection?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => setCollections(prev => prev.filter(c => c.id !== id))
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Collections</Text>
          <Text style={styles.headerSubtitle}>
            Organize your movies and shows into custom collections
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Feather name="plus" size={20} color="#fff" />
          <Text style={styles.createButtonText}>Create New Collection</Text>
        </TouchableOpacity>

        {collections.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="folder" size={48} color="#808080" />
            <Text style={styles.emptyTitle}>No Collections Yet</Text>
            <Text style={styles.emptyText}>
              Create your first collection to organize your content
            </Text>
          </View>
        ) : (
          <View style={styles.collectionsList}>
            {collections.map((collection) => {
              const itemCount = collection.contentIds.length;
              return (
                <TouchableOpacity
                  key={collection.id}
                  style={styles.collectionCard}
                  onPress={() => {/* Navigate to collection details */}}
                >
                  <View style={styles.collectionIcon}>
                    <Feather name="folder" size={24} color="#e50914" />
                  </View>
                  <View style={styles.collectionContent}>
                    <Text style={styles.collectionName}>{collection.name}</Text>
                    {collection.description && (
                      <Text style={styles.collectionDescription} numberOfLines={2}>
                        {collection.description}
                      </Text>
                    )}
                    <Text style={styles.collectionMeta}>
                      {itemCount} {itemCount === 1 ? 'item' : 'items'} • Created {new Date(collection.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.collectionActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => {/* Edit collection */}}
                    >
                      <Feather name="edit-3" size={16} color="#808080" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => deleteCollection(collection.id, collection.name)}
                    >
                      <Feather name="trash-2" size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Collection</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <Feather name="x" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Collection Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={newCollectionName}
                  onChangeText={setNewCollectionName}
                  placeholder="Enter collection name"
                  placeholderTextColor="#808080"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description (Optional)</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={newCollectionDescription}
                  onChangeText={setNewCollectionDescription}
                  placeholder="Describe your collection"
                  placeholderTextColor="#808080"
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.createCollectionButton}
                onPress={createCollection}
              >
                <Text style={styles.createCollectionButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
    lineHeight: 22,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e50914',
    marginHorizontal: 16,
    marginBottom: 24,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
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
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    color: '#808080',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  collectionsList: {
    paddingHorizontal: 16,
  },
  collectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  collectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(229, 9, 20, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  collectionContent: {
    flex: 1,
  },
  collectionName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  collectionDescription: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 4,
    lineHeight: 18,
  },
  collectionMeta: {
    fontSize: 12,
    color: '#808080',
  },
  collectionActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  modalBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#444',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: '#333',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  createCollectionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: '#e50914',
    alignItems: 'center',
  },
  createCollectionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});