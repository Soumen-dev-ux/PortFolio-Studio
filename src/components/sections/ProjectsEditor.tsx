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
  Switch,
} from 'react-native';
import { ProjectsPayload, ProjectItem } from '../../types';
import { Card, FormField, SectionTitle, Btn, COLORS, EmptyState, Badge } from '../UI';

interface Props {
  data: ProjectsPayload;
  onChange: (updated: ProjectsPayload) => void;
}

const emptyProject: ProjectItem = {
  id: '',
  title: '',
  description: '',
  tags: [],
  liveUrl: '',
  repoUrl: '',
  imageUrl: '',
  featured: false,
};

export function ProjectsEditor({ data, onChange }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<ProjectItem>(emptyProject);
  const [tagsString, setTagsString] = useState('');

  const items = data.items || [];

  const openCreate = () => {
    setEditingItem({
      ...emptyProject,
      id: `proj-${Date.now()}`,
    });
    setTagsString('');
    setModalVisible(true);
  };

  const openEdit = (item: ProjectItem) => {
    setEditingItem(item);
    setTagsString(Array.isArray(item.tags) ? item.tags.join(', ') : '');
    setModalVisible(true);
  };

  const saveItem = () => {
    if (!editingItem.title.trim()) {
      Alert.alert('Required', 'Please enter a project title.');
      return;
    }

    const tags = tagsString
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const updatedItem: ProjectItem = {
      ...editingItem,
      tags,
    };

    const existingIndex = items.findIndex((i) => i.id === updatedItem.id);
    let next: ProjectItem[];
    if (existingIndex >= 0) {
      next = [...items];
      next[existingIndex] = updatedItem;
    } else {
      next = [updatedItem, ...items];
    }

    onChange({ items: next });
    setModalVisible(false);
  };

  const deleteItem = (id: string, title: string) => {
    Alert.alert('Delete Project', `Are you sure you want to delete "${title}"?`, [
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
          title="Portfolio Projects"
          subtitle="Showcase your best apps, websites, and repositories"
          action={
            <Btn
              title="Add Project"
              icon="➕"
              onPress={openCreate}
            />
          }
        />
      </Card>

      {items.length === 0 ? (
        <EmptyState
          title="No projects added yet"
          subtitle="Add your top applications with screenshots, tech tags, and live links."
          actionText="Add First Project"
          onAction={openCreate}
          icon="🚀"
        />
      ) : (
        items.map((item) => (
          <Card key={item.id} style={{ borderColor: item.featured ? COLORS.primary : COLORS.border }}>
            {item.imageUrl ? (
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.projectImage}
                resizeMode="cover"
              />
            ) : null}

            <View style={styles.projectHeaderRow}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.projectTitle}>{item.title || 'Untitled Project'}</Text>
                {item.featured ? (
                  <View style={{ marginTop: 4 }}>
                    <Badge label="★ FEATURED" variant="primary" />
                  </View>
                ) : null}
              </View>

              <View style={styles.actionButtons}>
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

            {item.description ? (
              <Text style={styles.projectDesc}>{item.description}</Text>
            ) : null}

            {item.tags && item.tags.length > 0 ? (
              <View style={styles.tagsRow}>
                {item.tags.map((tag, tIdx) => (
                  <View key={tIdx} style={styles.tagBadge}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            ) : null}

            <View style={styles.linksRow}>
              {item.liveUrl ? (
                <Text style={styles.linkText} numberOfLines={1}>
                  🌐 {item.liveUrl}
                </Text>
              ) : null}
              {item.repoUrl ? (
                <Text style={styles.linkText} numberOfLines={1}>
                  💻 {item.repoUrl}
                </Text>
              ) : null}
            </View>
          </Card>
        ))
      )}

      {/* Add / Edit Project Modal */}
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
                  ? 'Edit Project'
                  : 'New Project'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
              <FormField
                label="Project Title"
                value={editingItem.title}
                onChangeText={(v) => setEditingItem({ ...editingItem, title: v })}
                placeholder="e.g. Next.js SaaS Platform"
                required
              />

              <FormField
                label="Description"
                value={editingItem.description}
                onChangeText={(v) =>
                  setEditingItem({ ...editingItem, description: v })
                }
                placeholder="Brief summary of what the app does, key tech challenges solved, and results..."
                multiline
                numberOfLines={4}
              />

              <FormField
                label="Tech Stack / Tags"
                value={tagsString}
                onChangeText={setTagsString}
                placeholder="React, TypeScript, Tailwind, Node.js"
                helper="Comma-separated list of technologies"
              />

              <FormField
                label="Live Demo URL"
                value={editingItem.liveUrl}
                onChangeText={(v) =>
                  setEditingItem({ ...editingItem, liveUrl: v })
                }
                placeholder="https://..."
                autoCapitalize="none"
                keyboardType="url"
              />

              <FormField
                label="GitHub / Source URL"
                value={editingItem.repoUrl}
                onChangeText={(v) =>
                  setEditingItem({ ...editingItem, repoUrl: v })
                }
                placeholder="https://github.com/..."
                autoCapitalize="none"
                keyboardType="url"
              />

              <FormField
                label="Cover Image URL"
                value={editingItem.imageUrl}
                onChangeText={(v) =>
                  setEditingItem({ ...editingItem, imageUrl: v })
                }
                placeholder="https://images.unsplash.com/..."
                autoCapitalize="none"
                keyboardType="url"
                helper="Direct link to a screenshot or showcase graphic"
              />

              {editingItem.imageUrl ? (
                <View style={styles.previewContainer}>
                  <Text style={styles.previewLabel}>IMAGE PREVIEW</Text>
                  <Image
                    source={{ uri: editingItem.imageUrl }}
                    style={styles.modalPreviewImage}
                    resizeMode="cover"
                  />
                </View>
              ) : null}

              <View style={styles.switchRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.switchLabel}>Featured Project</Text>
                  <Text style={styles.switchSub}>
                    Showcase prominently at the top of projects list
                  </Text>
                </View>
                <Switch
                  value={editingItem.featured}
                  onValueChange={(val) =>
                    setEditingItem({ ...editingItem, featured: val })
                  }
                  trackColor={{ false: COLORS.border, true: COLORS.primary }}
                  thumbColor={editingItem.featured ? '#FFFFFF' : '#888'}
                />
              </View>

              <View style={styles.modalActions}>
                <Btn
                  title="Cancel"
                  variant="ghost"
                  onPress={() => setModalVisible(false)}
                  style={{ flex: 1, marginRight: 8 }}
                />
                <Btn
                  title="Save Project"
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
  projectImage: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: COLORS.cardSecondary,
  },
  projectHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  projectTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  actionButtons: {
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
  projectDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 10,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  tagBadge: {
    backgroundColor: COLORS.surfaceInput,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tagText: {
    color: COLORS.accentLight,
    fontSize: 11,
    fontWeight: '600',
  },
  linksRow: {
    gap: 4,
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  linkText: {
    color: COLORS.accent,
    fontSize: 12,
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
    height: 120,
    borderRadius: 10,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    marginVertical: 10,
  },
  switchLabel: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
  },
  switchSub: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: 16,
  },
});
