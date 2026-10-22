import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SitePayload } from '../../types';
import { Card, FormField, SectionTitle, COLORS, Badge } from '../UI';

interface Props {
  data: SitePayload;
  onChange: (updated: SitePayload) => void;
}

const AVAILABILITY_OPTIONS = [
  { id: 'opportunities', label: 'Open to opportunities', icon: '🟢', desc: 'Actively considering exciting new roles' },
  { id: 'fulltime', label: 'Available for full-time roles', icon: '💼', desc: 'Ready for full-time engineering positions' },
  { id: 'freelance', label: 'Available for freelance & contracts', icon: '🚀', desc: 'Open to consulting and client projects' },
  { id: 'immediate', label: 'Available for immediate joining', icon: '⚡', desc: 'Can start immediately without notice period' },
  { id: 'not_looking', label: 'Not currently looking', icon: '⚪', desc: 'Happily employed / focusing on current work' },
];

export function SiteEditor({ data, onChange }: Props) {
  const update = (field: keyof SitePayload, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <View>
      <Card>
        <SectionTitle
          title="Hero & Branding"
          subtitle="The first impressions of your portfolio website"
        />

        {/* Constant Name (Locked - No Edit Box) */}
        <View style={styles.constantFieldContainer}>
          <View style={styles.constantHeaderRow}>
            <Text style={styles.fieldLabel}>Full Name</Text>
            <View style={styles.constantBadge}>
              <Text style={styles.constantBadgeText}>🔒 Constant</Text>
            </View>
          </View>
          <View style={styles.constantValueBox}>
            <Text style={styles.constantValueText}>{data.name || 'Soumen Pore'}</Text>
          </View>
          <Text style={styles.fieldHelper}>Your identity is fixed and permanent across all sections.</Text>
        </View>

        <FormField
          label="Hero Headline"
          value={data.headline}
          onChangeText={(v) => update('headline', v)}
          placeholder="e.g. Full-Stack Developer & UI/UX Specialist"
          helper="Appears in large title typography on your homepage hero"
          required
        />

        <FormField
          label="Location"
          value={data.location}
          onChangeText={(v) => update('location', v)}
          placeholder="e.g. West Bengal, India"
        />

        {/* Current Availability (Selectable Choice - No Typing) */}
        <View style={styles.optionSection}>
          <View style={styles.optionSectionHeader}>
            <Text style={styles.fieldLabel}>Current Availability</Text>
            <Text style={styles.optionSectionHelper}>Tap an option to select</Text>
          </View>

          <View style={styles.availabilityOptionsList}>
            {AVAILABILITY_OPTIONS.map((opt) => {
              const isSelected = data.availability === opt.label;
              return (
                <TouchableOpacity
                  key={opt.id}
                  onPress={() => update('availability', opt.label)}
                  style={[
                    styles.availabilityOptionCard,
                    isSelected && styles.availabilityOptionCardSelected,
                  ]}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionLeft}>
                    <Text style={styles.optionIcon}>{opt.icon}</Text>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.optionTitle,
                          isSelected && styles.optionTitleSelected,
                        ]}
                      >
                        {opt.label}
                      </Text>
                      <Text style={styles.optionDesc}>{opt.desc}</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.radioCircle,
                      isSelected && styles.radioCircleSelected,
                    ]}
                  >
                    {isSelected ? <View style={styles.radioInnerCircle} /> : null}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <FormField
          label="Short Bio / Tagline"
          value={data.bioShort || ''}
          onChangeText={(v) => update('bioShort', v)}
          placeholder="A quick 1-2 sentence introduction about what you build"
          multiline
          numberOfLines={2}
        />
      </Card>

      {/* Live Preview Card */}
      <Card style={{ backgroundColor: COLORS.cardSecondary, borderColor: COLORS.primary }}>
        <View style={styles.previewHeader}>
          <Text style={styles.previewKicker}>LIVE PREVIEW</Text>
          <Badge label={data.availability || 'Available'} variant="success" />
        </View>

        <Text style={styles.previewName}>{data.name || 'Soumen Pore'}</Text>
        <Text style={styles.previewHeadline}>
          {data.headline || 'Your Headline Here'}
        </Text>
        <Text style={styles.previewLocation}>📍 {data.location || 'Your Location'}</Text>

        {data.bioShort ? (
          <Text style={styles.previewBio}>{data.bioShort}</Text>
        ) : null}
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
  optionSection: {
    marginBottom: 16,
  },
  optionSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionSectionHelper: {
    fontSize: 11,
    color: COLORS.accentLight,
    fontWeight: '600',
  },
  availabilityOptionsList: {
    gap: 8,
  },
  availabilityOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surfaceInput,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  availabilityOptionCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  optionIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  optionTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
  },
  optionTitleSelected: {
    color: COLORS.accentLight,
    fontWeight: '700',
  },
  optionDesc: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: COLORS.primary,
  },
  radioInnerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewKicker: {
    color: COLORS.accent,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  previewName: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4,
  },
  previewHeadline: {
    color: COLORS.accentLight,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
    lineHeight: 20,
  },
  previewLocation: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 8,
  },
  previewBio: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 10,
    lineHeight: 18,
    fontStyle: 'italic',
  },
});
