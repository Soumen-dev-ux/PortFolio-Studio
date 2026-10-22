import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  supabase,
  isSupabaseConfigured,
  SECTIONS,
  DEFAULT_SEED,
  DEFAULT_PUBLISHED,
  normalizeSectionPayload,
} from './src/supabase';
import { SectionKey, PublishedMap, SectionPayloadMap } from './src/types';
import { COLORS, Card, Btn, FormField } from './src/components/UI';
import { SiteEditor } from './src/components/sections/SiteEditor';
import { AboutEditor } from './src/components/sections/AboutEditor';
import { SkillsEditor } from './src/components/sections/SkillsEditor';
import { ProjectsEditor } from './src/components/sections/ProjectsEditor';
import { ExperienceEditor } from './src/components/sections/ExperienceEditor';
import { EducationEditor } from './src/components/sections/EducationEditor';
import { AchievementsEditor } from './src/components/sections/AchievementsEditor';
import { GalleryEditor } from './src/components/sections/GalleryEditor';
import { ContactEditor } from './src/components/sections/ContactEditor';
import { ResumeEditor } from './src/components/sections/ResumeEditor';

export default function App() {
  return (
    <SafeAreaProvider>
      <MainApp />
    </SafeAreaProvider>
  );
}

function MainApp() {
  const [session, setSession] = useState<any>(null);
  const [offlineMode, setOfflineMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<SectionKey>('site');
  const [content, setContent] = useState<SectionPayloadMap>(DEFAULT_SEED);
  const [publishedStatus, setPublishedStatus] = useState<PublishedMap>(DEFAULT_PUBLISHED);
  const [loading, setLoading] = useState(false);
  const [jsonMode, setJsonMode] = useState(false);
  const [draftJson, setDraftJson] = useState('');

  // Sync draft JSON whenever switching tab or toggling JSON mode
  useEffect(() => {
    setDraftJson(JSON.stringify(content[activeTab] ?? {}, null, 2));
  }, [activeTab, jsonMode]);

  // Check initial Supabase auth session
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) {
        setSession(data.session);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  // Fetch sections from Supabase when session is established
  useEffect(() => {
    if (session) {
      loadAllContent();
    }
  }, [session]);

  const loadAllContent = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('portfolio_content')
        .select('section,payload,published')
        .order('section');

      if (error) {
        Alert.alert('Cloud Sync Notice', error.message);
        return;
      }

      if (data && data.length > 0) {
        const nextContent = { ...content };
        const nextPublished = { ...publishedStatus };

        data.forEach((row: any) => {
          const key = row.section as SectionKey;
          if (key && DEFAULT_SEED[key]) {
            nextContent[key] = normalizeSectionPayload(key, row.payload) as any;
            nextPublished[key] = Boolean(row.published);
          }
        });

        setContent(nextContent);
        setPublishedStatus(nextPublished);
      }
    } catch (err: any) {
      Alert.alert('Load Error', err?.message || 'Could not fetch cloud data.');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please enter your admin email and password.');
      return;
    }

    if (!supabase) {
      Alert.alert(
        'Supabase Not Configured',
        'Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to your .env file or EAS build secrets.'
      );
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Sign In Failed', error.message);
    } else {
      setSession(data.session);
      setOfflineMode(false);
    }
  };

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setSession(null);
    setOfflineMode(false);
  };

  // Update specific section payload from form editors
  const updateActiveSection = (updatedPayload: any) => {
    setContent((prev) => ({
      ...prev,
      [activeTab]: updatedPayload,
    }));
  };

  // Toggle published status for a section
  const togglePublishStatus = (val: boolean) => {
    setPublishedStatus((prev) => ({
      ...prev,
      [activeTab]: val,
    }));
  };

  // Save current section to Supabase or local state
  const handleSave = async (publishOverride?: boolean) => {
    let payloadToSave = content[activeTab];

    // If user is in JSON mode, parse and validate the JSON text first
    if (jsonMode) {
      try {
        payloadToSave = JSON.parse(draftJson);
        updateActiveSection(payloadToSave);
      } catch {
        Alert.alert(
          'Invalid JSON Format',
          'Please correct the JSON syntax before saving, or switch back to the Form Editor.'
        );
        return;
      }
    }

    const isPublished =
      publishOverride !== undefined ? publishOverride : publishedStatus[activeTab];

    if (publishOverride !== undefined) {
      togglePublishStatus(publishOverride);
    }

    // In offline demo mode
    if (offlineMode || !supabase) {
      Alert.alert(
        isPublished ? 'Section Published (Local)' : 'Draft Saved (Local)',
        `Your "${SECTIONS.find((s) => s.key === activeTab)?.label}" changes are updated locally in Demo Mode.`
      );
      return;
    }

    // In Supabase cloud mode
    setLoading(true);
    try {
      const { error } = await supabase.from('portfolio_content').upsert(
        {
          section: activeTab,
          payload: payloadToSave,
          published: isPublished,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'section' }
      );

      if (error) {
        Alert.alert('Save Failed', error.message);
      } else {
        Alert.alert(
          isPublished ? '🚀 Published Live!' : '💾 Draft Saved',
          isPublished
            ? `"${SECTIONS.find((s) => s.key === activeTab)?.label}" is now marked published for your live website.`
            : `Draft changes for "${SECTIONS.find((s) => s.key === activeTab)?.label}" were saved.`
        );
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Could not save section.');
    } finally {
      setLoading(false);
    }
  };

  const activeMeta = useMemo(() => {
    return SECTIONS.find((s) => s.key === activeTab) || SECTIONS[0];
  }, [activeTab]);

  const isAuthenticated = Boolean(session) || offlineMode;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Brand Header */}
          <View style={styles.topHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.brandKicker}>SOUMEN PORE</Text>
              <Text style={styles.brandTitle}>Portfolio Studio</Text>
              <Text style={styles.brandSub}>
                {isAuthenticated
                  ? session
                    ? `Admin: ${session.user.email}`
                    : 'Demo & Preview Mode'
                  : 'Mobile Admin Dashboard'}
              </Text>
            </View>

            <View style={styles.avatarBox}>
              <Text style={styles.avatarText}>SP</Text>
            </View>
          </View>

          {/* Connection Status Pill */}
          <View style={styles.statusPillRow}>
            <View
              style={[
                styles.statusPill,
                session ? styles.statusPillOnline : styles.statusPillOffline,
              ]}
            >
              <Text style={styles.statusDot}>{session ? '🟢' : '🟡'}</Text>
              <Text style={styles.statusPillText}>
                {session
                  ? 'Supabase Cloud Connected'
                  : offlineMode
                  ? 'Offline Demo Mode'
                  : isSupabaseConfigured
                  ? 'Supabase Configured · Sign In Required'
                  : 'Supabase Not Configured'}
              </Text>
            </View>

            {isAuthenticated ? (
              <TouchableOpacity onPress={signOut} style={styles.signOutHeaderBtn}>
                <Text style={styles.signOutHeaderText}>
                  {session ? 'Sign Out' : 'Exit Demo'}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {/* If NOT Authenticated: Show Sign-In Screen */}
          {!isAuthenticated ? (
            <Card style={{ marginTop: 12 }}>
              <Text style={styles.authTitle}>Studio Access</Text>
              <Text style={styles.authSub}>
                Sign in with your admin credentials to sync changes directly to your live portfolio database.
              </Text>

              <FormField
                label="Admin Email"
                value={email}
                onChangeText={setEmail}
                placeholder="admin@soumenpore.dev"
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <View>
                <FormField
                  label="Admin Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••••••"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeToggle}
                >
                  <Text style={styles.eyeToggleText}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Text>
                </TouchableOpacity>
              </View>

              <Btn
                title={loading ? 'Authenticating…' : 'Sign In Securely'}
                icon="🔒"
                onPress={signIn}
                loading={loading}
                style={{ marginTop: 6 }}
              />

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR TEST WITHOUT LOGIN</Text>
                <View style={styles.dividerLine} />
              </View>

              <Btn
                title="Continue in Offline Demo Mode"
                variant="secondary"
                icon="📱"
                onPress={() => setOfflineMode(true)}
              />

              <Text style={styles.authHint}>
                {isSupabaseConfigured
                  ? 'Connected to your Supabase instance. Sign in to edit live cloud content.'
                  : 'Supabase keys are not set yet. You can use Demo Mode to explore all forms, or set .env keys for live syncing.'}
              </Text>
            </Card>
          ) : (
            /* Authenticated Content Management Interface */
            <View>
              {/* Horizontal Scrollable Tabs */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabsContainer}
              >
                {SECTIONS.map((sec) => {
                  const isActive = activeTab === sec.key;
                  const isPub = publishedStatus[sec.key];
                  return (
                    <TouchableOpacity
                      key={sec.key}
                      onPress={() => {
                        setActiveTab(sec.key);
                      }}
                      style={[styles.tabItem, isActive && styles.tabItemActive]}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.tabIcon}>{sec.icon}</Text>
                      <Text
                        style={[
                          styles.tabLabel,
                          isActive && styles.tabLabelActive,
                        ]}
                      >
                        {sec.label}
                      </Text>
                      <View
                        style={[
                          styles.pubDot,
                          isPub ? styles.pubDotLive : styles.pubDotDraft,
                        ]}
                      />
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Section Header & Publish Controls */}
              <Card style={styles.sectionControlCard}>
                <View style={styles.sectionHeaderRow}>
                  <View style={{ flex: 1, marginRight: 10 }}>
                    <View style={styles.sectionBadgeRow}>
                      <Text style={styles.sectionHeaderIcon}>
                        {activeMeta.icon}
                      </Text>
                      <Text style={styles.sectionHeaderTitle}>
                        {activeMeta.label}
                      </Text>
                    </View>
                    <Text style={styles.sectionHeaderDesc}>
                      {activeMeta.desc}
                    </Text>
                  </View>

                  {/* Mode Switch (Form vs JSON) */}
                  <TouchableOpacity
                    onPress={() => setJsonMode(!jsonMode)}
                    style={[
                      styles.modeToggleBtn,
                      jsonMode && styles.modeToggleBtnActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.modeToggleText,
                        jsonMode && styles.modeToggleTextActive,
                      ]}
                    >
                      {jsonMode ? '📝 Form View' : '{ } JSON'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Published Toggle Switch */}
                <View style={styles.publishToggleRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.publishToggleTitle}>
                      Live Website Status
                    </Text>
                    <Text style={styles.publishToggleSub}>
                      {publishedStatus[activeTab]
                        ? '🟢 Marked Published — Accessible on public portfolio'
                        : '⚪ Saved as Draft — Hidden from public website'}
                    </Text>
                  </View>
                  <Switch
                    value={Boolean(publishedStatus[activeTab])}
                    onValueChange={togglePublishStatus}
                    trackColor={{ false: COLORS.border, true: COLORS.primary }}
                    thumbColor={
                      publishedStatus[activeTab] ? '#FFFFFF' : '#888'
                    }
                  />
                </View>

                {/* Main Action Buttons */}
                <View style={styles.mainActionsRow}>
                  <Btn
                    title="Save Draft"
                    variant="secondary"
                    icon="💾"
                    onPress={() => handleSave(false)}
                    loading={loading}
                    style={{ flex: 1, marginRight: 8 }}
                  />
                  <Btn
                    title="Publish Live"
                    variant="primary"
                    icon="🚀"
                    onPress={() => handleSave(true)}
                    loading={loading}
                    style={{ flex: 1 }}
                  />
                </View>
              </Card>

              {/* Content Form Editor OR Raw JSON Editor */}
              {jsonMode ? (
                <Card>
                  <View style={styles.jsonHeader}>
                    <Text style={styles.jsonHeaderTitle}>
                      Raw JSON Editor (Advanced)
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        try {
                          const parsed = JSON.parse(draftJson);
                          setDraftJson(JSON.stringify(parsed, null, 2));
                        } catch {
                          Alert.alert('JSON Error', 'Syntax is currently invalid.');
                        }
                      }}
                      style={styles.formatBtn}
                    >
                      <Text style={styles.formatBtnText}>Format JSON</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.jsonNotice}>
                    Tip: Switch back to "Form View" at any time for clean fields, buttons, and image previews without typing JSON.
                  </Text>
                  <TextInput
                    multiline
                    value={draftJson}
                    onChangeText={setDraftJson}
                    style={styles.jsonEditor}
                    autoCapitalize="none"
                    autoCorrect={false}
                    spellCheck={false}
                    textAlignVertical="top"
                  />
                </Card>
              ) : (
                /* Native Friendly Form Components */
                <View style={{ marginTop: 4 }}>
                  {activeTab === 'site' && (
                    <SiteEditor
                      data={content.site}
                      onChange={updateActiveSection}
                    />
                  )}
                  {activeTab === 'about' && (
                    <AboutEditor
                      data={content.about}
                      onChange={updateActiveSection}
                    />
                  )}
                  {activeTab === 'skills' && (
                    <SkillsEditor
                      data={content.skills}
                      onChange={updateActiveSection}
                    />
                  )}
                  {activeTab === 'projects' && (
                    <ProjectsEditor
                      data={content.projects}
                      onChange={updateActiveSection}
                    />
                  )}
                  {activeTab === 'experience' && (
                    <ExperienceEditor
                      data={content.experience}
                      onChange={updateActiveSection}
                    />
                  )}
                  {activeTab === 'education' && (
                    <EducationEditor
                      data={content.education}
                      onChange={updateActiveSection}
                    />
                  )}
                  {activeTab === 'achievements' && (
                    <AchievementsEditor
                      data={content.achievements}
                      onChange={updateActiveSection}
                    />
                  )}
                  {activeTab === 'gallery' && (
                    <GalleryEditor
                      data={content.gallery}
                      onChange={updateActiveSection}
                    />
                  )}
                  {activeTab === 'contact' && (
                    <ContactEditor
                      data={content.contact}
                      onChange={updateActiveSection}
                    />
                  )}
                  {activeTab === 'resume' && (
                    <ResumeEditor
                      data={content.resume}
                      onChange={updateActiveSection}
                    />
                  )}
                </View>
              )}

              {/* Quick Reload Button */}
              {session ? (
                <View style={{ marginVertical: 12 }}>
                  <Btn
                    title="Reload Data from Cloud"
                    variant="ghost"
                    icon="🔄"
                    onPress={loadAllContent}
                  />
                </View>
              ) : null}
            </View>
          )}

          {/* Footer Branding */}
          <Text style={styles.footerNote}>
            SOUMEN PORE · PORTFOLIO STUDIO · ANDROID CMS
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContainer: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 48,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 4,
  },
  brandKicker: {
    color: COLORS.accent,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
  },
  brandTitle: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: '800',
    marginTop: 2,
  },
  brandSub: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.cardSecondary,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: COLORS.accentLight,
    fontWeight: '900',
    fontSize: 16,
  },
  statusPillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusPillOnline: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: COLORS.success,
  },
  statusPillOffline: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: COLORS.warning,
  },
  statusDot: {
    fontSize: 8,
    marginRight: 6,
  },
  statusPillText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  signOutHeaderBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  signOutHeaderText: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: '600',
  },
  authTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  authSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 16,
  },
  eyeToggle: {
    position: 'absolute',
    right: 12,
    top: 36,
    padding: 6,
  },
  eyeToggleText: {
    color: COLORS.accentLight,
    fontSize: 11,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 10,
    letterSpacing: 1,
  },
  authHint: {
    color: COLORS.textMuted,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 14,
    textAlign: 'center',
  },
  tabsContainer: {
    paddingVertical: 8,
    gap: 8,
    marginBottom: 8,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 6,
  },
  tabItemActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabIcon: {
    fontSize: 14,
  },
  tabLabel: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  pubDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 2,
  },
  pubDotLive: {
    backgroundColor: '#34D399',
  },
  pubDotDraft: {
    backgroundColor: '#6B7280',
  },
  sectionControlCard: {
    padding: 16,
    marginBottom: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sectionBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionHeaderIcon: {
    fontSize: 18,
  },
  sectionHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  sectionHeaderDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    lineHeight: 16,
  },
  modeToggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.cardSecondary,
  },
  modeToggleBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
  },
  modeToggleText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  modeToggleTextActive: {
    color: COLORS.accentLight,
  },
  publishToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
  },
  publishToggleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  publishToggleSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  mainActionsRow: {
    flexDirection: 'row',
  },
  jsonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  jsonHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  formatBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: COLORS.cardSecondary,
  },
  formatBtnText: {
    fontSize: 11,
    color: COLORS.accentLight,
    fontWeight: '600',
  },
  jsonNotice: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 10,
    lineHeight: 15,
  },
  jsonEditor: {
    minHeight: 280,
    backgroundColor: '#07050E',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    color: '#D4C7F5',
    fontSize: 12,
    fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier',
    lineHeight: 18,
  },
  footerNote: {
    color: COLORS.textMuted,
    fontSize: 10,
    letterSpacing: 1.5,
    textAlign: 'center',
    marginTop: 24,
  },
});
