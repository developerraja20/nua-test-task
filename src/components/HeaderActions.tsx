import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BarChart2, Smartphone, Moon, Sun, ShoppingCart } from 'lucide-react-native';
import { RootStackParamList } from '../types';
import { useTheme } from '../theme/useTheme';
import { useCartStore } from '../store/useCartStore';

interface HeaderActionsProps {
  onOpenAnalytics?: () => void;
  showCart?: boolean;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({
  onOpenAnalytics,
  showCart = true,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors, mode, toggleMode, isDark } = useTheme();
  const totalItems = useCartStore((state) => state.getTotalItemsCount());

  const ThemeIcon = isDark ? Moon : Sun;

  return (
    <View style={styles.container}>
      {onOpenAnalytics && (
        <TouchableOpacity
          onPress={onOpenAnalytics}
          style={[styles.iconButton, { backgroundColor: colors.surfaceSecondary }]}
          accessibilityLabel="Open Mock Analytics Logs"
        >
          <BarChart2 size={19} color={colors.text} />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={toggleMode}
        style={[styles.iconButton, { backgroundColor: colors.surfaceSecondary }]}
        accessibilityLabel={`Current theme: ${isDark ? 'dark' : 'light'}. Tap to toggle theme.`}
      >
        <ThemeIcon
          size={19}
          color={colors.text}
        />
      </TouchableOpacity>

      {showCart && (
        <TouchableOpacity
          onPress={() => navigation.navigate('Cart')}
          style={[styles.iconButton, { backgroundColor: colors.surfaceSecondary }]}
          accessibilityLabel="View Cart"
        >
          <ShoppingCart size={20} color={colors.text} />
          {totalItems > 0 && (
            <View
              style={[
                styles.badge,
                { backgroundColor: colors.primary, borderColor: colors.surface },
              ]}
            >
              <Text style={styles.badgeText}>
                {totalItems > 99 ? '99+' : totalItems}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 10,
    overflow: 'visible',
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'visible',
  },
  badge: {
    position: 'absolute',
    top: -0.5,
    right: -0.5,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    zIndex: 10,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    lineHeight: 12,
    textAlign: 'center',
  },
});
