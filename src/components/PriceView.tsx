import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/useTheme';
import { calculateDiscountedPrice } from '../store/useCartStore';

interface PriceViewProps {
  price: number;
  discountPercentage?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const PriceView: React.FC<PriceViewProps> = ({
  price,
  discountPercentage = 0,
  size = 'md',
}) => {
  const { colors } = useTheme();
  const hasDiscount = discountPercentage > 0;
  const discountedPrice = calculateDiscountedPrice(price, discountPercentage);

  const getFontSizes = () => {
    switch (size) {
      case 'sm':
        return { main: 15, original: 12, badge: 10 };
      case 'lg':
        return { main: 28, original: 18, badge: 12 };
      case 'md':
      default:
        return { main: 18, original: 14, badge: 11 };
    }
  };

  const fonts = getFontSizes();

  return (
    <View style={styles.container}>
      <View style={styles.pricesRow}>
        <Text
          style={[
            styles.discountedPrice,
            { color: colors.text, fontSize: fonts.main },
          ]}
        >
          ${discountedPrice.toFixed(2)}
        </Text>

        {hasDiscount && (
          <Text
            style={[
              styles.originalPrice,
              { color: colors.textMuted, fontSize: fonts.original },
            ]}
          >
            ${price.toFixed(2)}
          </Text>
        )}

        {hasDiscount && (
          <View
            style={[
              styles.badge,
              {
                backgroundColor: colors.successLight,
                borderColor: colors.success,
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: colors.success, fontSize: fonts.badge },
              ]}
            >
              -{Math.round(discountPercentage)}%
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 2,
  },
  pricesRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: 6,
  },
  discountedPrice: {
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'center',
  },
  badgeText: {
    fontWeight: '700',
  },
});
