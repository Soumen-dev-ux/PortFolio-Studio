import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { AboutPayload } from '../../types';
import { Card, FormField, SectionTitle, Btn, COLORS, EmptyState } from '../UI';

interface Props {
  data: AboutPayload;
  onChange: (updated: AboutPayload) => void;
}

export function AboutEditor({ data, onChange }: Props) {
  const [newHighlight, setNewHighlight] = useState('');

  const updateField = (field: keyof AboutPayload, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const addHighlight = () => {
    const trimmed = newHighlight.trim();
    if (!trimmed) return;
    const highlights = [...(data.highlights || []), trimmed];
    updateField('highlights', highlights);
    setNewHighlight('');
  };

  const removeHighlight = (index: number) => {
    Alert.alert('Remove Highlight', 'Are you sure you want to remove this bullet point?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const highlights = [...(data.highlights || [])];
          highlights.splice(index, 1);
          updateField('highlights', highlights);
        },
      },
    ]);
  };

  return (
    <View>
      <Card>
        <SectionTitle
          title="About Me Story"
          subtitle="Craft your bio and personal background"
        />

        {/* Constant Section Title (Locked - No Edit Box) */}
        <View style={styles.constantFieldContainer}>
          <View style={styles.constantHeaderRow}>
            <Text style={styles.fieldLabel}>Section Title</Text>
            <View style={styles.constantBadge}>
              <Text style={styles.constantBadgeText}>🔒 Constant</Text>
            </View>
          </View>
          <View style={styles.constantValueBox}>
            <Text style={styles.constantValueText}>{data.heading || 'About Me'}</Text>
          </View>
          <Text style={styles.fieldHelper}>Section title is fixed to maintain cohesive site navigation.</Text>
        </View>

        <FormField
          label="Bio & Narrative"
          value={data.body}
          onChangeText={(v) => updateField('body', v)}
          placeholder="Write your background, journey, what drives you, and what kind of problems you solve..."
          multiline
          numberOfLines={6}
          helper="Supports multiple paragraphs. Keep it engaging and professional."
        />
      </Card>

      <Card>
        <SectionTitle
          title="Key Highlights"
          subtitle="Bullet points highlighting your top strengths or achievements"
        />

        <View style={styles.addHighlightRow}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <FormField
              label="Add New Highlight"
              value={newHighlight}
              onChangeText={setNewHighlight}
              placeholder="e.g. 5+ years building production web apps"
            />
          </View>
          <Btn
            title="Add"
            icon="➕"
            onPress={addHighlight}
            disabled={!newHighlight.trim()}
            style={{ marginTop: 18 }}
          />
        </View>

        {(data.highlights || []).length === 0 ? (
          <EmptyState
            title="No highlights yet"
            subtitle="Add bullet points summarizing your core achievements."
            icon="💡"
          />
        ) : (
          <View style={styles.highlightList}>
            {data.highlights.map((item, idx) => (
              <View key={idx} style={styles.highlightItem}>
                <Text style={styles.bulletDot}>✦</Text>
                <Text style={styles.highlightText}>{item}</Text>
                <TouchableOpacity
                  onPress={() => removeHighlight(idx)}
                  style={styles.deleteBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.deleteBtnText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  constantFieldContainer: {
    marginBottom: 16,
  },
  constantHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  constantBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  constantBadgeText: {
    color: COLORS.accentLight,
    fontSize: 11,
    fontWeight: '700',
  },
  constantValueBox: {
    backgroundColor: COLORS.surfaceInput,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  constantValueText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
  },
  fieldHelper: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 5,
  },
  addHighlightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  highlightList: {
    gap: 8,
    marginTop: 6,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  bulletDot: {
    color: COLORS.primary,
    fontSize: 14,
    marginRight: 8,
  },
  highlightText: {
    flex: 1,
    color: COLORS.text,
    fontSize: 13,
    lineHeight: 18,
  },
  deleteBtn: {
    marginLeft: 8,
    padding: 4,
  },
  deleteBtnText: {
    color: COLORS.danger,
    fontSize: 14,
    fontWeight: '700',
  },
});
