import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  ScrollView,
} from 'react-native';
import { GalleryPayload, GalleryItem } from '../../types';
import { Card, FormField, SectionTitle, Btn, COLORS, EmptyState } from '../UI';

interface Props {
  data: GalleryPayload;
  onChange: (updated: GalleryPayload) => void;
}

const emptyItem: GalleryItem = {
  id: '',
  title: '',
  imageUrl: '',
  caption: '',
};

export function GalleryEditor({ data, onChange }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem>(emptyItem);

  const items = data.items || [];

  const openCreate = () => {
    setEditingItem({
      ...emptyItem,
      id: `gal-${Date.now()}`,
    });
    setModalVisible(true);
  };

  const openEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setModalVisible(true);
  };

  const saveItem = () => {
    if (!editingItem.imageUrl.trim()) {
      Alert.alert('Required', 'Please enter an image URL.');
      return;
    }

    const existingIndex = items.findIndex((i) => i.id === editingItem.id);
    let next: GalleryItem[];
    if (existingIndex >= 0) {
      next = [...items];
      next[existingIndex] = editingItem;
    } else {
      next = [editingItem, ...items];
    }

    onChange({ items: next });
    setModalVisible(false);
  };

  const deleteItem = (id: string, title: string) => {
    Alert.alert('Delete Image', `Delete "${title || 'this photo'}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const next = items.filter((i) => i.id !== id);
          onChange({ items: next });
        },
      },
    ]);
  };

  return (
    <View>
      <Card>
        <SectionTitle
          title="Visual Gallery & Showcase"
          subtitle="Display photos of your workspace, hackathons, team, and designs"
          action={
            <Btn
              title="Add Image"
              icon="➕"
              onPress={openCreate}
            />
          }
        />
      </Card>

      {items.length === 0 ? (
        <EmptyState
          title="No gallery images yet"
          subtitle="Add image links to showcase your developer lifestyle or setups."
          actionText="Add Photo"
          onAction={openCreate}
          icon="🖼️"
        />
      ) : (
        items.map((item) => (
          <Card key={item.id}>
            {item.imageUrl ? (
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.galleryImage}
                resizeMode="cover"
              />
            ) : null}

            <View style={styles.headerRow}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.titleText}>{item.title || 'Untitled Image'}</Text>
                {item.caption ? (
                  <Text style={styles.captionText}>{item.caption}</Text>
                ) : null}
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() => openEdit(item)}
                  style={styles.editBtn}
                >
                  <Text style={styles.editBtnText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteItem(item.id, item.title)}
                  style={styles.deleteBtn}
                >
                  <Text style={styles.deleteBtnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        ))
      )}

      {/* Add / Edit Gallery Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingItem.id && items.some((i) => i.id === editingItem.id)
                  ? 'Edit Gallery Image'
                  : 'New Gallery Image'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
              <FormField
                label="Image URL"
                value={editingItem.imageUrl}
                onChangeText={(v) =>
                  setEditingItem({ ...editingItem, imageUrl: v })
                }
                placeholder="https://..."
                autoCapitalize="none"
                keyboardType="url"
                required
                helper="Direct link to hosted JPEG/PNG image (Unsplash, Supabase Storage, Imgur, etc.)"
              />

              {editingItem.imageUrl ? (
                <View style={styles.previewContainer}>
                  <Text style={styles.previewLabel}>PREVIEW</Text>
                  <Image
                    source={{ uri: editingItem.imageUrl }}
                    style={styles.modalPreviewImage}
                    resizeMode="cover"
                  />
                </View>
              ) : null}

              <FormField
                label="Title / Heading"
                value={editingItem.title}
                onChangeText={(v) =>
                  setEditingItem({ ...editingItem, title: v })
                }
                placeholder="e.g. Mechanical Keyboard & Desk Setup"
              />

              <FormField
                label="Caption / Story"
                value={editingItem.caption}
                onChangeText={(v) =>
                  setEditingItem({ ...editingItem, caption: v })
                }
                placeholder="Brief note or description about this image..."
                multiline
                numberOfLines={3}
              />

              <View style={styles.modalActions}>
                <Btn
                  title="Cancel"
                  variant="ghost"
                  onPress={() => setModalVisible(false)}
                  style={{ flex: 1, marginRight: 8 }}
                />
                <Btn
                  title="Save Image"
                  onPress={saveItem}
                  style={{ flex: 1 }}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  galleryImage: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: COLORS.cardSecondary,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  captionText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  editBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: COLORS.cardSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  editBtnText: {
    color: COLORS.accentLight,
    fontSize: 12,
    fontWeight: '700',
  },
  deleteBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: COLORS.dangerBg,
  },
  deleteBtnText: {
    color: COLORS.danger,
    fontSize: 12,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  modalClose: {
    fontSize: 20,
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
  previewContainer: {
    marginBottom: 14,
  },
  previewLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.accent,
    marginBottom: 6,
    letterSpacing: 1,
  },
  modalPreviewImage: {
    width: '100%',
    height: 140,
    borderRadius: 10,
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: 16,
  },
});
