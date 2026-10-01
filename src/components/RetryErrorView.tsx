import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { WifiOff, RefreshCw } from 'lucide-react-native';
import { useTheme } from '../theme/useTheme';

interface RetryErrorViewProps {
  error: string;
  onRetry: () => void;
  retryInfo?: {
    isRetrying: boolean;
    attempt: number;
    delayMs: number;
  } | null;
}

export const RetryErrorView: React.FC<RetryErrorViewProps> = ({
  error,
  onRetry,
  retryInfo,
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.dangerLight,
        },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: colors.dangerLight },
        ]}
      >
        <WifiOff size={32} color={colors.danger} />
      </View>

      <Text style={[styles.title, { color: colors.text }]}>
        Connection Issue
      </Text>

      <Text style={[styles.message, { color: colors.textSecondary }]}>
        {error}
      </Text>

      {retryInfo?.isRetrying ? (
        <View
          style={[
            styles.retryingBadge,
            { backgroundColor: colors.warningLight },
          ]}
        >
          <ActivityIndicator size="small" color={colors.warning} />
          <Text style={[styles.retryingText, { color: colors.warning }]}>
            Auto-retrying (Attempt {retryInfo.attempt}/3 in{' '}
            {Math.round(retryInfo.delayMs / 1000)}s)...
          </Text>
        </View>
      ) : (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onRetry}
          style={[
            styles.retryButton,
            { backgroundColor: colors.primary },
          ]}
        >
          <RefreshCw size={16} color="#FFFFFF" />
          <Text style={styles.retryButtonText}>Retry Now</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  retryingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  retryingText: {
    fontSize: 13,
    fontWeight: '600',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
