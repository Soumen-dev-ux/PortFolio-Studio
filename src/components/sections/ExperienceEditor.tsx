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
import { ExperiencePayload, ExperienceItem } from '../../types';
import { Card, FormField, SectionTitle, Btn, COLORS, EmptyState } from '../UI';

interface Props {
  data: ExperiencePayload;
  onChange: (updated: ExperiencePayload) => void;
}

const emptyItem: ExperienceItem = {
  id: '',
  role: '',
  company: '',
  period: '',
  location: '',
  description: '',
};

export function ExperienceEditor({ data, onChange }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<ExperienceItem>(emptyItem);

  const items = data.items || [];

  const openCreate = () => {
    setEditingItem({
      ...emptyItem,
      id: `exp-${Date.now()}`,
    });
    setModalVisible(true);
  };

  const openEdit = (item: ExperienceItem) => {
    setEditingItem(item);
    setModalVisible(true);
  };

  const saveItem = () => {
    if (!editingItem.role.trim() || !editingItem.company.trim()) {
      Alert.alert('Required', 'Please enter both role and company name.');
      return;
    }

    const existingIndex = items.findIndex((i) => i.id === editingItem.id);
    let next: ExperienceItem[];
    if (existingIndex >= 0) {
      next = [...items];
      next[existingIndex] = editingItem;
    } else {
      next = [editingItem, ...items];
    }

    onChange({ items: next });
    setModalVisible(false);
  };

  const deleteItem = (id: string, role: string, company: string) => {
    Alert.alert(
      'Delete Experience',
      `Delete "${role} at ${company}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const next = items.filter((i) => i.id !== id);
            onChange({ items: next });
          },
        },
      ]
    );
  };

  return (
    <View>
      <Card>
        <SectionTitle
          title="Work Experience"
          subtitle="Your professional career timeline and achievements"
          action={
            <Btn
              title="Add Experience"
              icon="➕"
              onPress={openCreate}
            />
          }
        />
      </Card>

      {items.length === 0 ? (
        <EmptyState
          title="No experience listed"
          subtitle="Add your current and past work roles, responsibilities, and achievements."
          actionText="Add Experience"
          onAction={openCreate}
          icon="💼"
        />
      ) : (
        items.map((item) => (
          <Card key={item.id}>
            <View style={styles.headerRow}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.roleText}>{item.role}</Text>
                <Text style={styles.companyText}>
                  🏢 {item.company}
                  {item.location ? ` · ${item.location}` : ''}
                </Text>
                {item.period ? (
                  <Text style={styles.periodText}>🗓️ {item.period}</Text>
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
                  onPress={() => deleteItem(item.id, item.role, item.company)}
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

      {/* Add / Edit Experience Modal */}
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
                  ? 'Edit Work Experience'
                  : 'New Work Experience'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
              <FormField
                label="Role / Title"
                value={editingItem.role}
                onChangeText={(v) => setEditingItem({ ...editingItem, role: v })}
                placeholder="e.g. Senior Frontend Developer"
                required
              />

              <FormField
                label="Company / Organization"
                value={editingItem.company}
                onChangeText={(v) =>
                  setEditingItem({ ...editingItem, company: v })
                }
                placeholder="e.g. Acme Corp"
                required
              />

              <FormField
                label="Time Period"
                value={editingItem.period}
                onChangeText={(v) =>
                  setEditingItem({ ...editingItem, period: v })
                }
                placeholder="e.g. Jan 2022 – Present"
              />

              <FormField
                label="Location / Mode"
                value={editingItem.location}
                onChangeText={(v) =>
                  setEditingItem({ ...editingItem, location: v })
                }
                placeholder="e.g. Remote / Bangalore, India"
              />

              <FormField
                label="Description & Impact"
                value={editingItem.description}
                onChangeText={(v) =>
                  setEditingItem({ ...editingItem, description: v })
                }
                placeholder="Key accomplishments, technologies used, leadership roles, and measurable outcomes..."
                multiline
                numberOfLines={4}
              />

              <View style={styles.modalActions}>
                <Btn
                  title="Cancel"
                  variant="ghost"
                  onPress={() => setModalVisible(false)}
                  style={{ flex: 1, marginRight: 8 }}
                />
                <Btn
                  title="Save Experience"
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
  roleText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  companyText: {
    fontSize: 13,
    color: COLORS.accentLight,
    marginTop: 2,
    fontWeight: '600',
  },
  periodText: {
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
