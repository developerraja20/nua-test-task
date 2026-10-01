import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Activity } from 'lucide-react-native';
import { useTheme } from '../theme/useTheme';
import { useAnalyticsStore } from '../services/analytics';
import { AnalyticsEvent } from '../types';

interface AnalyticsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({
  visible,
  onClose,
}) => {
  const { colors } = useTheme();
  const events = useAnalyticsStore((state) => state.events);
  const clearEvents = useAnalyticsStore((state) => state.clearEvents);

  const getEventBadgeColor = (type: string) => {
    switch (type) {
      case 'product_viewed':
        return { bg: colors.primaryLight, text: colors.primary };
      case 'add_to_cart':
        return { bg: colors.successLight, text: colors.success };
      case 'search_performed':
        return { bg: colors.warningLight, text: colors.warning };
      case 'app_backgrounded':
        return { bg: colors.dangerLight, text: colors.danger };
      default:
        return { bg: colors.surfaceSecondary, text: colors.textSecondary };
    }
  };

  const renderItem = ({ item }: { item: AnalyticsEvent }) => {
    const badge = getEventBadgeColor(item.event);
    const dateFormatted = new Date(item.timestamp).toLocaleTimeString();

    return (
      <View
        style={[
          styles.eventCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.eventHeader}>
          <View
            style={[styles.badge, { backgroundColor: badge.bg }]}
          >
            <Text style={[styles.badgeText, { color: badge.text }]}>
              {item.event}
            </Text>
          </View>
          <Text style={[styles.timestamp, { color: colors.textMuted }]}>
            {dateFormatted}
          </Text>
        </View>

        <Text style={[styles.metadataTitle, { color: colors.textSecondary }]}>
          Metadata:
        </Text>
        <View
          style={[
            styles.jsonContainer,
            { backgroundColor: colors.surfaceSecondary },
          ]}
        >
          <Text style={[styles.jsonText, { color: colors.text }]}>
            {JSON.stringify(item.metadata, null, 2)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View
          style={[
            styles.header,
            {
              borderBottomColor: colors.border,
              backgroundColor: colors.surface,
            },
          ]}
        >
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Mock Analytics Events
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
              {events.length} event(s) recorded in session
            </Text>
          </View>

          <View style={styles.headerButtons}>
            {events.length > 0 && (
              <TouchableOpacity
                onPress={clearEvents}
                style={[
                  styles.clearButton,
                  { backgroundColor: colors.surfaceSecondary },
                ]}
              >
                <Text style={[styles.clearButtonText, { color: colors.danger }]}>
                  Clear
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.closeButton,
                { backgroundColor: colors.surfaceSecondary },
              ]}
            >
              <X size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {events.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Activity size={54} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No events recorded yet.
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>
              Perform a search, view a product, add to cart, or background the app to see events here.
            </Text>
          </View>
        ) : (
          <FlatList
            data={events}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  clearButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  eventCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 8,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  timestamp: {
    fontSize: 11,
    fontWeight: '500',
  },
  metadataTitle: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  jsonContainer: {
    borderRadius: 8,
    padding: 10,
  },
  jsonText: {
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
});
