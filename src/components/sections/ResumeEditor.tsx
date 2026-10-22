import React from 'react';
import { View, Text, StyleSheet, Linking, Alert } from 'react-native';
import { ResumePayload } from '../../types';
import { Card, FormField, SectionTitle, Btn, COLORS } from '../UI';

interface Props {
  data: ResumePayload;
  onChange: (updated: ResumePayload) => void;
}

export function ResumeEditor({ data, onChange }: Props) {
  const update = (field: keyof ResumePayload, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const testResumeUrl = async () => {
    if (!data.url || !data.url.trim()) {
      Alert.alert('No URL provided', 'Please enter a resume URL to test.');
      return;
    }
    const can = await Linking.canOpenURL(data.url).catch(() => false);
    if (can) {
      Linking.openURL(data.url);
    } else {
      Alert.alert(
        'Invalid Link',
        'Could not open this URL. Make sure it starts with https://'
      );
    }
  };

  return (
    <View>
      <Card>
        <SectionTitle
          title="Curriculum Vitae / Resume"
          subtitle="Configure your hosted resume PDF document"
        />

        <FormField
          label="Hosted Resume PDF URL"
          value={data.url}
          onChangeText={(v) => update('url', v)}
          placeholder="https://drive.google.com/... or https://..."
          autoCapitalize="none"
          keyboardType="url"
          required
          helper="Direct link to your hosted PDF file (Google Drive, Dropbox, Supabase Storage, or personal domain)."
        />

        <FormField
          label="Last Updated Notice"
          value={data.lastUpdated || ''}
          onChangeText={(v) => update('lastUpdated', v)}
          placeholder="e.g. October 2024 / Q4 2024"
          helper="Displayed on the website so recruiters know how fresh your CV is."
        />

        <FormField
          label="Recruiter Notes / Availability"
          value={data.notes || ''}
          onChangeText={(v) => update('notes', v)}
          placeholder="e.g. References available upon request. Willing to relocate for right opportunity."
          multiline
          numberOfLines={3}
        />

        <View style={styles.actionsRow}>
          <Btn
            title="Open & Verify Link"
            icon="🔗"
            variant="secondary"
            onPress={testResumeUrl}
            disabled={!data.url}
            style={{ flex: 1 }}
          />
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  actionsRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
});
