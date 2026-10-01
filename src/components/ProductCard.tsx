import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Star, ShoppingCart, CheckCircle } from 'lucide-react-native';
import { Product } from '../types';
import { useTheme } from '../theme/useTheme';
import { PriceView } from './PriceView';
import { useCartStore } from '../store/useCartStore';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = React.memo(
  ({ product, onPress }) => {
    const { colors } = useTheme();
    const addItem = useCartStore((state) => state.addItem);
    const itemQty = useCartStore((state) =>
      state.getItemQuantity(product.id)
    );

    const handleQuickAdd = (e: any) => {
      e?.stopPropagation?.();
      addItem(product, 1);
    };

    return (
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={onPress}
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            shadowColor: colors.cardShadow,
          },
        ]}
      >
        <View
          style={[
            styles.imageContainer,
            { backgroundColor: colors.surfaceSecondary },
          ]}
        >
          <Image
            source={{ uri: product.thumbnail }}
            style={styles.image}
            resizeMode="contain"
          />

          <View
            style={[
              styles.ratingPill,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Star size={12} color="#F59E0B" fill="#F59E0B" />
            <Text style={[styles.ratingText, { color: colors.text }]}>
              {product.rating?.toFixed(1) || '4.0'}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text
            style={[styles.category, { color: colors.primary }]}
            numberOfLines={1}
          >
            {product.category?.toUpperCase() || 'GENERAL'}
          </Text>

          <Text
            style={[styles.title, { color: colors.text }]}
            numberOfLines={2}
          >
            {product.title}
          </Text>

          <PriceView
            price={product.price}
            discountPercentage={product.discountPercentage}
            size="sm"
          />

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleQuickAdd}
            style={[
              styles.addButton,
              {
                backgroundColor: itemQty > 0 ? colors.successLight : colors.primaryLight,
                borderColor: itemQty > 0 ? colors.success : colors.primary,
              },
            ]}
          >
            {itemQty > 0 ? (
              <CheckCircle size={15} color={colors.success} />
            ) : (
              <ShoppingCart size={15} color={colors.primary} />
            )}
            <Text
              style={[
                styles.addButtonText,
                { color: itemQty > 0 ? colors.success : colors.primary },
              ]}
            >
              {itemQty > 0 ? `In Cart (${itemQty})` : 'Add to Cart'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    padding: 8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  ratingPill: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 0.8,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
  },
  content: {
    padding: 12,
  },
  category: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
    minHeight: 36,
    marginBottom: 6,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: 8,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
