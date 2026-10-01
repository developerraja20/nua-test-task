import React, { useLayoutEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Trash2, Minus, Plus, CreditCard, RotateCcw } from 'lucide-react-native';
import { useTheme } from '../theme/useTheme';
import {
  useCartStore,
  calculateDiscountedPrice,
} from '../store/useCartStore';
import { CartItem, RootStackParamList } from '../types';
import { EmptyState } from '../components/EmptyState';

export const CartScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();

  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const totalItems = useCartStore((state) => state.getTotalItemsCount());
  const totalPrice = useCartStore((state) => state.getTotalPrice());
  const totalDiscounted = useCartStore((state) =>
    state.getTotalDiscountedPrice()
  );
  const totalSavings = useCartStore((state) => state.getTotalSavings());

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `Shopping Cart (${totalItems})`,
      headerStyle: { backgroundColor: colors.surface },
      headerTintColor: colors.text,
      headerShadowVisible: false,
      headerRight: () =>
        items.length > 0 ? (
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'Clear Cart',
                'Are you sure you want to remove all items from your cart?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Clear All',
                    style: 'destructive',
                    onPress: clearCart,
                  },
                ]
              );
            }}
            style={styles.clearHeaderBtn}
          >
            <Text style={[styles.clearHeaderText, { color: colors.danger }]}>
              Clear
            </Text>
          </TouchableOpacity>
        ) : null,
    });
  }, [navigation, colors, items.length, totalItems, clearCart]);

  const handleCheckout = () => {
    Alert.alert(
      'Order Confirmed 🎉',
      `Thank you for your order! Your total is $${totalDiscounted.toFixed(
        2
      )}. (You saved $${totalSavings.toFixed(2)} with discounts!)`,
      [
        {
          text: 'Great!',
          onPress: () => {
            clearCart();
            navigation.goBack();
          },
        },
      ]
    );
  };

  const renderCartItem = ({ item }: { item: CartItem }) => {
    const discountedUnitPrice = calculateDiscountedPrice(
      item.product.price,
      item.product.discountPercentage
    );
    const itemSubtotal = (discountedUnitPrice * item.quantity).toFixed(2);

    return (
      <View
        style={[
          styles.itemCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <Image
          source={{ uri: item.product.thumbnail }}
          style={[
            styles.thumbnail,
            { backgroundColor: colors.surfaceSecondary },
          ]}
          resizeMode="contain"
        />

        <View style={styles.itemInfo}>
          <Text
            style={[styles.itemTitle, { color: colors.text }]}
            numberOfLines={2}
          >
            {item.product.title}
          </Text>

          <View style={styles.priceRow}>
            <Text style={[styles.unitPrice, { color: colors.text }]}>
              ${discountedUnitPrice.toFixed(2)}
            </Text>
            {item.product.discountPercentage > 0 && (
              <Text
                style={[styles.originalUnitPrice, { color: colors.textMuted }]}
              >
                ${item.product.price.toFixed(2)}
              </Text>
            )}
          </View>

          <Text style={[styles.subtotalText, { color: colors.textSecondary }]}>
            Total: <Text style={{ color: colors.primary, fontWeight: '700' }}>${itemSubtotal}</Text>
          </Text>
        </View>

        <View style={styles.actionColumn}>
          <TouchableOpacity
            onPress={() => removeItem(item.product.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.deleteBtn}
          >
            <Trash2 size={18} color={colors.danger} />
          </TouchableOpacity>

          <View
            style={[
              styles.stepper,
              {
                backgroundColor: colors.surfaceSecondary,
                borderColor: colors.border,
              },
            ]}
          >
            <TouchableOpacity
              onPress={() =>
                updateQuantity(item.product.id, item.quantity - 1)
              }
              style={styles.stepBtn}
            >
              <Minus size={14} color={colors.text} />
            </TouchableOpacity>

            <Text style={[styles.stepQty, { color: colors.text }]}>
              {item.quantity}
            </Text>

            <TouchableOpacity
              onPress={() =>
                updateQuantity(item.product.id, item.quantity + 1)
              }
              style={styles.stepBtn}
            >
              <Plus size={14} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (items.length === 0) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <EmptyState
          title="Your Cart is Empty"
          description="Looks like you haven't added anything to your cart yet. Explore our top products and find great deals!"
          actionLabel="Start Shopping"
          onAction={() => navigation.goBack()}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <FlatList
        data={items}
        keyExtractor={(item) => `cart-item-${item.product.id}`}
        renderItem={renderCartItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <View
        style={[
          styles.summaryCard,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
          },
        ]}
      >
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
            Original Total
          </Text>
          <Text style={[styles.summaryValue, { color: colors.textMuted }]}>
            ${totalPrice.toFixed(2)}
          </Text>
        </View>

        {totalSavings > 0 && (
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.success }]}>
              Discounts Applied
            </Text>
            <Text style={[styles.summaryValue, { color: colors.success }]}>
              -${totalSavings.toFixed(2)}
            </Text>
          </View>
        )}

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.summaryRow}>
          <Text style={[styles.totalLabel, { color: colors.text }]}>
            Final Total
          </Text>
          <Text style={[styles.totalAmount, { color: colors.text }]}>
            ${totalDiscounted.toFixed(2)}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.88}
          onPress={handleCheckout}
          style={[styles.checkoutBtn, { backgroundColor: colors.primary }]}
        >
          <CreditCard size={20} color="#FFFFFF" />
          <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ReturnPolicyWebView', {
              url: 'file:///Users/apple/Downloads/return-policy.html',
              title: 'Return Policy',
            })
          }
          style={styles.returnPolicyBtn}
        >
          <RotateCcw size={13} color={colors.textMuted} />
          <Text style={[styles.returnPolicyBtnText, { color: colors.textMuted }]}>
            Return Policy
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  clearHeaderBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  clearHeaderText: {
    fontSize: 14,
    fontWeight: '700',
  },
  listContainer: {
    padding: 16,
    gap: 12,
  },
  itemCard: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  thumbnail: {
    width: 76,
    height: 76,
    borderRadius: 12,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 4,
  },
  unitPrice: {
    fontSize: 14,
    fontWeight: '700',
  },
  originalUnitPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  subtotalText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionColumn: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 76,
    marginLeft: 8,
  },
  deleteBtn: {
    padding: 4,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 2,
    height: 28,
  },
  stepBtn: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepQty: {
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 4,
  },
  summaryCard: {
    padding: 20,
    borderTopWidth: 1,
    gap: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: '800',
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  checkoutBtn: {
    flexDirection: 'row',
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  returnPolicyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 8,
  },
  returnPolicyBtnText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
