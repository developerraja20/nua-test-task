import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AlertCircle, Star, ShieldCheck, RotateCcw, ChevronRight, Minus, Plus, ShoppingCart } from 'lucide-react-native';
import { RootStackParamList, Product } from '../types';
import { useTheme } from '../theme/useTheme';
import { getProductById } from '../api/dummyJsonApi';
import { ImageCarousel } from '../components/ImageCarousel';
import { PriceView } from '../components/PriceView';
import { HeaderActions } from '../components/HeaderActions';
import { useCartStore } from '../store/useCartStore';
import { analytics } from '../services/analytics';

type DetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

export const ProductDetailScreen: React.FC = () => {
  const route = useRoute<DetailRouteProp>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();

  const { productId, initialProduct } = route.params;

  const [product, setProduct] = useState<Product | undefined>(initialProduct);
  const [loading, setLoading] = useState<boolean>(!initialProduct);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);

  const addItem = useCartStore((state) => state.addItem);
  const inCartQty = useCartStore((state) =>
    product ? state.getItemQuantity(product.id) : 0
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: product?.title ? product.title : 'Product Details',
      headerStyle: { backgroundColor: colors.surface },
      headerTintColor: colors.text,
      headerShadowVisible: false,
      headerRight: () => <HeaderActions showCart={true} />,
    });
  }, [navigation, colors, product]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchDetail() {
      try {
        setLoading(true);
        const data = await getProductById(productId, controller.signal);
        setProduct(data);

        analytics.logProductViewed({
          id: data.id,
          title: data.title,
          category: data.category,
          price: data.price,
          discountPercentage: data.discountPercentage,
        });
      } catch (err: any) {
        if (!controller.signal.aborted) {
          setError(err.message || 'Failed to fetch product details.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchDetail();

    return () => {
      controller.abort();
    };
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, selectedQuantity);
  };

  const handleOpenReturnPolicy = () => {
    navigation.navigate('ReturnPolicyWebView', {
      url: 'https://dummyjson.com/docs/products',
      title: 'Return & Refund Policy',
    });
  };

  if (loading && !product) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading product specifications...
        </Text>
      </View>
    );
  }

  if (error && !product) {
    return (
      <View
        style={[styles.errorContainer, { backgroundColor: colors.background }]}
      >
        <AlertCircle size={48} color={colors.danger} />
        <Text style={[styles.errorTitle, { color: colors.text }]}>
          Error Loading Product
        </Text>
        <Text style={[styles.errorMessage, { color: colors.textSecondary }]}>
          {error}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backBtn, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!product) return null;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ImageCarousel
          images={
            product.images && product.images.length > 0
              ? product.images
              : [product.thumbnail]
          }
        />

        <View style={styles.body}>
          <View style={styles.metaRow}>
            <Text style={[styles.categoryTag, { color: colors.primary }]}>
              {product.category?.toUpperCase()}
            </Text>
            {product.brand && (
              <View
                style={[
                  styles.brandBadge,
                  {
                    backgroundColor: colors.surfaceSecondary,
                    borderColor: colors.border,
                  },
                ]}
              >
                <ShieldCheck size={12} color={colors.textSecondary} />
                <Text
                  style={[styles.brandText, { color: colors.textSecondary }]}
                >
                  {product.brand}
                </Text>
              </View>
            )}
          </View>

          <Text style={[styles.title, { color: colors.text }]}>
            {product.title}
          </Text>

          <View style={styles.ratingStockRow}>
            <View style={styles.ratingBox}>
              <Star size={16} color="#F59E0B" />
              <Text style={[styles.ratingNumber, { color: colors.text }]}>
                {product.rating?.toFixed(1)}
              </Text>
              <Text
                style={[styles.reviewsCount, { color: colors.textSecondary }]}
              >
                ({product.reviews?.length || 12} reviews)
              </Text>
            </View>

            <View
              style={[
                styles.stockBadge,
                {
                  backgroundColor:
                    product.stock > 10
                      ? colors.successLight
                      : colors.warningLight,
                },
              ]}
            >
              <Text
                style={[
                  styles.stockText,
                  {
                    color:
                      product.stock > 10 ? colors.success : colors.warning,
                  },
                ]}
              >
                {product.stock > 0
                  ? `In Stock (${product.stock} units)`
                  : 'Out of Stock'}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.priceBox,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.priceLabel, { color: colors.textMuted }]}>
              Current Price:
            </Text>
            <PriceView
              price={product.price}
              discountPercentage={product.discountPercentage}
              size="lg"
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleOpenReturnPolicy}
            style={[
              styles.returnPolicyButton,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.returnPolicyLeft}>
              <RotateCcw size={20} color={colors.primary} />
              <View>
                <Text
                  style={[styles.returnPolicyTitle, { color: colors.text }]}
                >
                  Return Policy
                </Text>
                <Text
                  style={[
                    styles.returnPolicySub,
                    { color: colors.textSecondary },
                  ]}
                >
                  {product.returnPolicy || '30 days money-back guarantee. Tap to view full terms.'}
                </Text>
              </View>
            </View>
            <ChevronRight size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Description
            </Text>
            <Text
              style={[styles.descriptionText, { color: colors.textSecondary }]}
            >
              {product.description}
            </Text>
          </View>

          <View
            style={[
              styles.specCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.specTitle, { color: colors.text }]}>
              Product Details
            </Text>

            <View style={styles.specRow}>
              <Text style={[styles.specLabel, { color: colors.textSecondary }]}>
                Warranty
              </Text>
              <Text style={[styles.specValue, { color: colors.text }]}>
                {product.warrantyInformation || '1 year brand warranty'}
              </Text>
            </View>

            <View style={styles.specRow}>
              <Text style={[styles.specLabel, { color: colors.textSecondary }]}>
                Shipping
              </Text>
              <Text style={[styles.specValue, { color: colors.text }]}>
                {product.shippingInformation || 'Ships in 1-2 business days'}
              </Text>
            </View>

            {product.sku && (
              <View style={styles.specRow}>
                <Text
                  style={[styles.specLabel, { color: colors.textSecondary }]}
                >
                  SKU
                </Text>
                <Text style={[styles.specValue, { color: colors.text }]}>
                  {product.sku}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.stepperContainer,
            {
              backgroundColor: colors.surfaceSecondary,
              borderColor: colors.border,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => setSelectedQuantity((q) => Math.max(1, q - 1))}
            style={styles.stepperBtn}
          >
            <Minus size={16} color={colors.text} />
          </TouchableOpacity>

          <Text style={[styles.stepperQty, { color: colors.text }]}>
            {selectedQuantity}
          </Text>

          <TouchableOpacity
            onPress={() => setSelectedQuantity((q) => q + 1)}
            style={styles.stepperBtn}
          >
            <Plus size={16} color={colors.text} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleAddToCart}
          style={[styles.addToCartButton, { backgroundColor: colors.primary }]}
        >
          <ShoppingCart size={18} color="#FFFFFF" />
          <Text style={styles.addToCartText}>
            {inCartQty > 0
              ? `Add More (Already ${inCartQty} in cart)`
              : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
  },
  errorMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 10,
  },
  backBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 12,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  body: {
    padding: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryTag: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  brandText: {
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    marginBottom: 12,
  },
  ratingStockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  ratingNumber: {
    fontSize: 14,
    fontWeight: '700',
  },
  reviewsCount: {
    fontSize: 13,
  },
  stockBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stockText: {
    fontSize: 12,
    fontWeight: '700',
  },
  priceBox: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  returnPolicyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 20,
  },
  returnPolicyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 10,
  },
  returnPolicyTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  returnPolicySub: {
    fontSize: 12,
    marginTop: 2,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
  },
  specCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  specTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E2E8F0',
  },
  specLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  specValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    gap: 12,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 4,
    height: 48,
  },
  stepperBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperQty: {
    fontSize: 15,
    fontWeight: '700',
    paddingHorizontal: 8,
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
