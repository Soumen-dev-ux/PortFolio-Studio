import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EducationPayload } from '../../types';
import { Card, SectionTitle, COLORS, Badge } from '../UI';
import { DEFAULT_SEED } from '../../supabase';

interface Props {
  data: EducationPayload;
  onChange?: (updated: EducationPayload) => void;
}

export function EducationEditor({ data }: Props) {
  const items = (data.items && data.items.length > 0)
    ? data.items
    : DEFAULT_SEED.education.items;

  return (
    <View>
      {/* Education Header Info Card */}
      <Card>
        <View style={styles.titleRow}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <SectionTitle
              title="Education & Credentials"
              subtitle="Formal academic degrees, coursework, and institutions"
            />
          </View>
          <View style={styles.constantBadge}>
            <Text style={styles.constantBadgeText}>🔒 Constant</Text>
          </View>
        </View>

        <View style={styles.noticeBox}>
          <Text style={styles.noticeIcon}>🎓</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.noticeTitle}>Permanent Academic Record</Text>
            <Text style={styles.noticeSub}>
              Your academic background is fixed and verified. Edit controls are disabled for this section.
            </Text>
          </View>
        </View>
      </Card>

      {/* Render Each Education Item as Read-Only Card */}
      {items.map((item) => (
        <Card key={item.id} style={styles.eduCard}>
          <View style={styles.cardHeader}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.degreeTitle}>{item.degree}</Text>
              <Text style={styles.institutionText}>🏫 {item.institution}</Text>
            </View>
            <Badge label="Verified" variant="success" />
          </View>

          <View style={styles.metaRow}>
            {item.period ? (
              <View style={styles.metaPill}>
                <Text style={styles.metaPillText}>🗓️ {item.period}</Text>
              </View>
            ) : null}
            {item.grade ? (
              <View style={[styles.metaPill, styles.gradePill]}>
                <Text style={styles.gradePillText}>🎯 {item.grade}</Text>
              </View>
            ) : null}
          </View>

          {item.description ? (
            <View style={styles.descBox}>
              <Text style={styles.descText}>{item.description}</Text>
            </View>
          ) : null}
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  constantBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    marginTop: 2,
  },
  constantBadgeText: {
    color: COLORS.accentLight,
    fontSize: 11,
    fontWeight: '700',
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  noticeIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  noticeTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
  },
  noticeSub: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  eduCard: {
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  degreeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 22,
  },
  institutionText: {
    fontSize: 13,
    color: COLORS.accentLight,
    fontWeight: '600',
    marginTop: 3,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
    marginBottom: 8,
  },
  metaPill: {
    backgroundColor: COLORS.cardSecondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  metaPillText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  gradePill: {
    borderColor: 'rgba(16, 185, 129, 0.3)',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  gradePillText: {
    color: COLORS.success,
    fontSize: 12,
    fontWeight: '700',
  },
  descBox: {
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  descText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
  },
});
