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
import { ContactPayload, SocialLink } from '../../types';
import { Card, FormField, SectionTitle, Btn, COLORS, EmptyState } from '../UI';

interface Props {
  data: ContactPayload;
  onChange: (updated: ContactPayload) => void;
}

const COMMON_PLATFORMS = [
  'GitHub',
  'LinkedIn',
  'Twitter / X',
  'Instagram',
  'YouTube',
  'Discord',
  'Medium',
  'Substack',
  'Personal Blog',
];

const emptyLink: SocialLink = {
  id: '',
  platform: 'GitHub',
  url: '',
};

export function ContactEditor({ data, onChange }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink>(emptyLink);

  const links = data.socialLinks || [];

  const updateBase = (field: keyof Omit<ContactPayload, 'socialLinks'>, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const openCreate = () => {
    setEditingLink({
      ...emptyLink,
      id: `soc-${Date.now()}`,
    });
    setModalVisible(true);
  };

  const openEdit = (link: SocialLink) => {
    setEditingLink(link);
    setModalVisible(true);
  };

  const saveLink = () => {
    if (!editingLink.url.trim()) {
      Alert.alert('Required', 'Please enter a profile or social link URL.');
      return;
    }

    const existingIndex = links.findIndex((l) => l.id === editingLink.id);
    let next: SocialLink[];
    if (existingIndex >= 0) {
      next = [...links];
      next[existingIndex] = editingLink;
    } else {
      next = [editingLink, ...links];
    }

    onChange({ ...data, socialLinks: next });
    setModalVisible(false);
  };

  const deleteLink = (id: string, platform: string) => {
    Alert.alert('Delete Link', `Remove "${platform}" link?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const next = links.filter((l) => l.id !== id);
          onChange({ ...data, socialLinks: next });
        },
      },
    ]);
  };

  return (
    <View>
      <Card>
        <SectionTitle
          title="Direct Contact Channels"
          subtitle="Email, phone, and communication channels"
        />

        <FormField
          label="Email Address"
          value={data.email}
          onChangeText={(v) => updateBase('email', v)}
          placeholder="e.g. contact@soumenpore.dev"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <FormField
          label="Phone / WhatsApp"
          value={data.phone}
          onChangeText={(v) => updateBase('phone', v)}
          placeholder="e.g. +91 98765 43210"
          keyboardType="phone-pad"
        />

        <FormField
          label="Location / Timezone"
          value={data.location}
          onChangeText={(v) => updateBase('location', v)}
          placeholder="e.g. Kolkata, India (IST / UTC+5:30)"
        />
      </Card>

      <Card>
        <SectionTitle
          title="Social & Professional Profiles"
          subtitle="GitHub, LinkedIn, Twitter, and other public profiles"
          action={
            <Btn
              title="Add Link"
              icon="➕"
              onPress={openCreate}
            />
          }
        />

        {links.length === 0 ? (
          <EmptyState
            title="No social links added"
            subtitle="Add your GitHub, LinkedIn, and social profiles."
            actionText="Add First Profile"
            onAction={openCreate}
            icon="🌐"
          />
        ) : (
          links.map((link) => (
            <View key={link.id} style={styles.linkCard}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.platformName}>🔗 {link.platform}</Text>
                <Text style={styles.urlText} numberOfLines={1}>
                  {link.url}
                </Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() => openEdit(link)}
                  style={styles.editBtn}
                >
                  <Text style={styles.editBtnText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteLink(link.id, link.platform)}
                  style={styles.deleteBtn}
                >
                  <Text style={styles.deleteBtnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </Card>

      {/* Add / Edit Social Link Modal */}
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
                {editingLink.id && links.some((l) => l.id === editingLink.id)
                  ? 'Edit Social Profile'
                  : 'New Social Profile'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
              <Text style={styles.quickSelectLabel}>QUICK SELECT PLATFORM</Text>
              <View style={styles.quickPlatformsRow}>
                {COMMON_PLATFORMS.map((plat) => (
                  <TouchableOpacity
                    key={plat}
                    onPress={() => setEditingLink({ ...editingLink, platform: plat })}
                    style={[
                      styles.platformChip,
                      editingLink.platform.toLowerCase() === plat.toLowerCase() &&
                        styles.platformChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.platformChipText,
                        editingLink.platform.toLowerCase() === plat.toLowerCase() &&
                          styles.platformChipTextActive,
                      ]}
                    >
                      {plat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <FormField
                label="Platform Name"
                value={editingLink.platform}
                onChangeText={(v) =>
                  setEditingLink({ ...editingLink, platform: v })
                }
                placeholder="e.g. GitHub or Custom Platform"
                required
              />

              <FormField
                label="Profile URL"
                value={editingLink.url}
                onChangeText={(v) => setEditingLink({ ...editingLink, url: v })}
                placeholder="https://..."
                autoCapitalize="none"
                keyboardType="url"
                required
              />

              <View style={styles.modalActions}>
                <Btn
                  title="Cancel"
                  variant="ghost"
                  onPress={() => setModalVisible(false)}
                  style={{ flex: 1, marginRight: 8 }}
                />
                <Btn
                  title="Save Profile"
                  onPress={saveLink}
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
  linkCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.cardSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  platformName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.accentLight,
  },
  urlText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  editBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: COLORS.card,
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
  quickSelectLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.accent,
    letterSpacing: 1,
    marginBottom: 8,
  },
  quickPlatformsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  platformChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceInput,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  platformChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  platformChipText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  platformChipTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: 16,
  },
});
