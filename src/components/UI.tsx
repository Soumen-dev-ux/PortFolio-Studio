import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';

export const COLORS = {
  bg: '#0A0713',
  card: '#140F22',
  cardSecondary: '#1B142E',
  border: '#2C2243',
  borderActive: '#8B5CF6',
  primary: '#8B5CF6',
  primaryHover: '#7C3AED',
  accent: '#A78BFA',
  accentLight: '#DDD6FE',
  text: '#F5F3FF',
  textSecondary: '#A79EBA',
  textMuted: '#6E6482',
  success: '#10B981',
  successBg: 'rgba(16, 185, 129, 0.15)',
  warning: '#F59E0B',
  warningBg: 'rgba(245, 158, 11, 0.15)',
  danger: '#EF4444',
  dangerBg: 'rgba(239, 68, 68, 0.15)',
  surfaceInput: '#0E0B1A',
};

export function Card({
  children,
  style,
  highlight,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  highlight?: boolean;
}) {
  return (
    <View
      style={[
        styles.card,
        highlight && { borderColor: COLORS.primary },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function SectionTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={{ flex: 1, paddingRight: 8 }}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sectionSub}>{subtitle}</Text> : null}
      </View>
      {action}
    </View>
  );
}

interface FormFieldProps extends TextInputProps {
  label: string;
  helper?: string;
  required?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
}

export function FormField({
  label,
  helper,
  required,
  multiline,
  numberOfLines = 3,
  style,
  ...props
}: FormFieldProps) {
  return (
    <View style={styles.fieldContainer}>
      <View style={styles.labelRow}>
        <Text style={styles.fieldLabel}>
          {label}
          {required ? <Text style={{ color: COLORS.primary }}> *</Text> : null}
        </Text>
      </View>
      <TextInput
        placeholderTextColor={COLORS.textMuted}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : 1}
        textAlignVertical={multiline ? 'top' : 'center'}
        style={[
          styles.input,
          multiline && { minHeight: numberOfLines * 24 + 20, paddingTop: 12 },
          style,
        ]}
        {...props}
      />
      {helper ? <Text style={styles.helperText}>{helper}</Text> : null}
    </View>
  );
}

export function Btn({
  title,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  style,
  textStyle,
  icon,
}: {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: string;
}) {
  const btnStyles = [
    styles.btn,
    variant === 'primary' && styles.btnPrimary,
    variant === 'secondary' && styles.btnSecondary,
    variant === 'danger' && styles.btnDanger,
    variant === 'ghost' && styles.btnGhost,
    variant === 'success' && styles.btnSuccess,
    disabled && styles.btnDisabled,
    style,
  ];

  const txtStyles = [
    styles.btnText,
    variant === 'primary' && styles.btnTextPrimary,
    variant === 'secondary' && styles.btnTextSecondary,
    variant === 'danger' && styles.btnTextDanger,
    variant === 'ghost' && styles.btnTextGhost,
    variant === 'success' && styles.btnTextSuccess,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={btnStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#FFF' : COLORS.primary}
        />
      ) : (
        <View style={styles.btnContent}>
          {icon ? <Text style={styles.btnIcon}>{icon}</Text> : null}
          <Text style={txtStyles}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export function Badge({
  label,
  variant = 'default',
}: {
  label: string;
  variant?: 'success' | 'warning' | 'default' | 'primary';
}) {
  const badgeStyle = [
    styles.badge,
    variant === 'success' && { backgroundColor: COLORS.successBg, borderColor: COLORS.success },
    variant === 'warning' && { backgroundColor: COLORS.warningBg, borderColor: COLORS.warning },
    variant === 'primary' && { backgroundColor: 'rgba(139, 92, 246, 0.2)', borderColor: COLORS.primary },
    variant === 'default' && { backgroundColor: COLORS.cardSecondary, borderColor: COLORS.border },
  ];

  const textStyle = [
    styles.badgeText,
    variant === 'success' && { color: COLORS.success },
    variant === 'warning' && { color: COLORS.warning },
    variant === 'primary' && { color: COLORS.accentLight },
    variant === 'default' && { color: COLORS.textSecondary },
  ];

  return (
    <View style={badgeStyle}>
      <Text style={textStyle}>{label}</Text>
    </View>
  );
}

export function EmptyState({
  title,
  subtitle,
  actionText,
  onAction,
  icon = '📭',
}: {
  title: string;
  subtitle: string;
  actionText?: string;
  onAction?: () => void;
  icon?: string;
}) {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>{icon}</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptySub}>{subtitle}</Text>
      {actionText && onAction ? (
        <Btn
          title={actionText}
          onPress={onAction}
          variant="secondary"
          style={{ marginTop: 12 }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  sectionSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  fieldContainer: {
    marginBottom: 14,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.accentLight,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: COLORS.surfaceInput,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: COLORS.text,
    fontSize: 14,
  },
  helperText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
    lineHeight: 15,
  },
  btn: {
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnIcon: {
    marginRight: 6,
    fontSize: 15,
  },
  btnPrimary: {
    backgroundColor: COLORS.primary,
  },
  btnSecondary: {
    backgroundColor: COLORS.cardSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btnDanger: {
    backgroundColor: COLORS.dangerBg,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  btnGhost: {
    backgroundColor: 'transparent',
  },
  btnSuccess: {
    backgroundColor: COLORS.successBg,
    borderWidth: 1,
    borderColor: COLORS.success,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  btnTextPrimary: {
    color: '#FFFFFF',
  },
  btnTextSecondary: {
    color: COLORS.accentLight,
  },
  btnTextDanger: {
    color: COLORS.danger,
  },
  btnTextGhost: {
    color: COLORS.textSecondary,
  },
  btnTextSuccess: {
    color: COLORS.success,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: 16,
    marginVertical: 8,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  emptySub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
});
