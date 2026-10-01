import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Search } from 'lucide-react-native';
import { useTheme } from '../theme/useTheme';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: colors.surfaceSecondary },
        ]}
      >
        {icon ?? <Search size={36} color={colors.textMuted} />}
      </View>

      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {description}
      </Text>

      {actionLabel && onAction && (
        <TouchableOpacity
          onPress={onAction}
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.actionButtonText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  actionButton: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
