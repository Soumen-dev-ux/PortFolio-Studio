import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SkillsPayload, SkillGroup } from '../../types';
import { Card, FormField, SectionTitle, Btn, COLORS, EmptyState } from '../UI';

interface Props {
  data: SkillsPayload;
  onChange: (updated: SkillsPayload) => void;
}

export function SkillsEditor({ data, onChange }: Props) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [skillInputs, setSkillInputs] = useState<Record<number, string>>({});

  const groups = data.groups || [];

  const addCategory = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    const next: SkillGroup[] = [...groups, { category: trimmed, items: [] }];
    onChange({ groups: next });
    setNewCategoryName('');
  };

  const removeCategory = (catIndex: number) => {
    Alert.alert(
      'Remove Category',
      `Delete "${groups[catIndex]?.category}" and all its skills?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const next = [...groups];
            next.splice(catIndex, 1);
            onChange({ groups: next });
          },
        },
      ]
    );
  };

  const addSkillToGroup = (catIndex: number) => {
    const raw = skillInputs[catIndex]?.trim() || '';
    if (!raw) return;

    // Support comma-separated batch adds (e.g. "React, Next.js, Redux")
    const newItems = raw
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const next = [...groups];
    const existing = next[catIndex].items || [];
    next[catIndex] = {
      ...next[catIndex],
      items: [...existing, ...newItems],
    };

    onChange({ groups: next });
    setSkillInputs((prev) => ({ ...prev, [catIndex]: '' }));
  };

  const removeSkillFromGroup = (catIndex: number, skillIndex: number) => {
    const next = [...groups];
    const items = [...next[catIndex].items];
    items.splice(skillIndex, 1);
    next[catIndex] = { ...next[catIndex], items };
    onChange({ groups: next });
  };

  return (
    <View>
      {/* Add New Category Card */}
      <Card>
        <SectionTitle
          title="Skill Categories"
          subtitle="Organize your technical expertise into clean groups"
        />

        <View style={styles.addCategoryRow}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <FormField
              label="New Group Name"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              placeholder="e.g. AI & Machine Learning"
            />
          </View>
          <Btn
            title="Create"
            icon="➕"
            onPress={addCategory}
            disabled={!newCategoryName.trim()}
            style={{ marginTop: 18 }}
          />
        </View>
      </Card>

      {groups.length === 0 ? (
        <EmptyState
          title="No skill categories yet"
          subtitle="Create your first group (e.g. Frontend, Backend, Tools) to add skills."
          icon="🛠️"
        />
      ) : (
        groups.map((group, catIndex) => (
          <Card key={catIndex} style={{ borderColor: COLORS.border }}>
            <View style={styles.groupHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.groupTitle}>{group.category}</Text>
                <Text style={styles.groupCount}>
                  {group.items?.length || 0} skills in this group
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => removeCategory(catIndex)}
                style={styles.catDeleteBtn}
              >
                <Text style={styles.catDeleteText}>Delete Group</Text>
              </TouchableOpacity>
            </View>

            {/* Quick Add Skill in Category */}
            <View style={styles.skillInputRow}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <FormField
                  label="Add Skill(s)"
                  value={skillInputs[catIndex] || ''}
                  onChangeText={(txt) =>
                    setSkillInputs((prev) => ({ ...prev, [catIndex]: txt }))
                  }
                  placeholder="e.g. Python, Docker, AWS"
                  helper="Separate with commas to add multiple skills at once"
                />
              </View>
              <Btn
                title="Add"
                onPress={() => addSkillToGroup(catIndex)}
                disabled={!(skillInputs[catIndex] || '').trim()}
                variant="secondary"
                style={{ marginTop: 18 }}
              />
            </View>

            {/* Chips List */}
            <View style={styles.chipsContainer}>
              {(group.items || []).map((skill, skillIdx) => (
                <View key={skillIdx} style={styles.chip}>
                  <Text style={styles.chipText}>{skill}</Text>
                  <TouchableOpacity
                    onPress={() => removeSkillFromGroup(catIndex, skillIdx)}
                    style={styles.chipClose}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Text style={styles.chipCloseText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
              {(group.items || []).length === 0 ? (
                <Text style={styles.emptyGroupText}>
                  No skills yet. Type a name above to add chips.
                </Text>
              ) : null}
            </View>
          </Card>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  addCategoryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 12,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.accentLight,
  },
  groupCount: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  catDeleteBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: COLORS.dangerBg,
  },
  catDeleteText: {
    color: COLORS.danger,
    fontSize: 11,
    fontWeight: '700',
  },
  skillInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardSecondary,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
  },
  chipClose: {
    marginLeft: 6,
    padding: 2,
  },
  chipCloseText: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: '800',
  },
  emptyGroupText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontStyle: 'italic',
    paddingVertical: 6,
  },
});
