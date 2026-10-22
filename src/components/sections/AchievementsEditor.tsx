import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { AchievementsPayload, AchievementItem } from '../../types';
import { Card, FormField, SectionTitle, Btn, COLORS, EmptyState } from '../UI';

interface Props {
  data: AchievementsPayload;
  onChange: (updated: AchievementsPayload) => void;
}

const emptyItem: AchievementItem = {
  id: '',
  title: '',
  issuer: '',
  year: '',
  description: '',
};

export function AchievementsEditor({ data, onChange }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<AchievementItem>(emptyItem);

  const items = data.items || [];

  const openCreate = () => {
    setEditingItem({
      ...emptyItem,
      id: `ach-${Date.now()}`,
    });
    setModalVisible(true);
  };

  const openEdit = (item: AchievementItem) => {
    setEditingItem(item);
    setModalVisible(true);
  };

  const saveItem = () => {
    if (!editingItem.title.trim()) {
      Alert.alert('Required', 'Please enter an achievement title.');
      return;
    }

    const existingIndex = items.findIndex((i) => i.id === editingItem.id);
    let next: AchievementItem[];
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
    Alert.alert('Delete Achievement', `Delete "${title}"?`, [
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
          title="Honors & Awards"
          subtitle="Hackathons, certificates, recognitions, and competitive milestones"
          action={
            <Btn
              title="Add Award"
              icon="➕"
              onPress={openCreate}
            />
          }
        />
      </Card>

      {items.length === 0 ? (
        <EmptyState
          title="No achievements yet"
          subtitle="Add your hackathon wins, honors, or professional certifications."
          actionText="Add Award"
          onAction={openCreate}
          icon="🏆"
        />
      ) : (
        items.map((item) => (
          <Card key={item.id}>
            <View style={styles.headerRow}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.titleText}>🏆 {item.title}</Text>
                {item.issuer ? (
                  <Text style={styles.issuerText}>By {item.issuer}</Text>
                ) : null}
                {item.year ? (
                  <Text style={styles.yearText}>Year: {item.year}</Text>
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

            {item.description ? (
              <Text style={styles.descText}>{item.description}</Text>
            ) : null}
          </Card>
        ))
      )}

      {/* Add / Edit Achievement Modal */}
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
                  ? 'Edit Award / Milestone'
                  : 'New Award / Milestone'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
              <FormField
                label="Award / Milestone Title"
                value={editingItem.title}
                onChangeText={(v) =>
                  setEditingItem({ ...editingItem, title: v })
                }
                placeholder="e.g. 1st Place - Smart City Hackathon"
                required
              />

              <FormField
                label="Issuing Organization"
                value={editingItem.issuer}
                onChangeText={(v) =>
                  setEditingItem({ ...editingItem, issuer: v })
                }
                placeholder="e.g. Google Developers Group / AWS"
              />

              <FormField
                label="Year / Date"
                value={editingItem.year}
                onChangeText={(v) =>
                  setEditingItem({ ...editingItem, year: v })
                }
                placeholder="e.g. 2024"
              />

              <FormField
                label="Description & Details"
                value={editingItem.description}
                onChangeText={(v) =>
                  setEditingItem({ ...editingItem, description: v })
                }
                placeholder="Details about what the award was given for, team size, project, etc..."
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
                  title="Save Award"
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  issuerText: {
    fontSize: 13,
    color: COLORS.accentLight,
    marginTop: 2,
    fontWeight: '600',
  },
  yearText: {
    fontSize: 11,
    color: COLORS.textMuted,
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
  descText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
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
  modalActions: {
    flexDirection: 'row',
    marginTop: 16,
  },
});
