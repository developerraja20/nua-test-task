import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Product } from '../types';
import { useTheme } from '../theme/useTheme';
import { useDebounce } from '../hooks/useDebounce';
import { useProducts } from '../hooks/useProducts';
import { SearchBar } from '../components/SearchBar';
import { ProductCard } from '../components/ProductCard';
import { SkeletonGrid } from '../components/SkeletonLoader';
import { RetryErrorView } from '../components/RetryErrorView';
import { EmptyState } from '../components/EmptyState';
import { HeaderActions } from '../components/HeaderActions';
import { AnalyticsModal } from '../components/AnalyticsModal';
import { useState, useLayoutEffect, useCallback } from 'react';

export const ProductListScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();

  const [searchInput, setSearchInput] = useState<string>('');
  const debouncedSearch = useDebounce(searchInput, 450);

  const [isAnalyticsVisible, setIsAnalyticsVisible] = useState(false);

  const {
    products,
    isLoading,
    isFetchingMore,
    isRefreshing,
    error,
    hasMore,
    total,
    retryInfo,
    loadMoreProducts,
    handleRefresh,
    handleRetry,
  } = useProducts(debouncedSearch);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Discover Products',
      headerStyle: { backgroundColor: colors.surface },
      headerTintColor: colors.text,
      headerShadowVisible: false,
      headerRight: () => (
        <HeaderActions
          onOpenAnalytics={() => setIsAnalyticsVisible(true)}
          showCart={true}
        />
      ),
    });
  }, [navigation, colors]);

  const handleProductPress = useCallback(
    (product: Product) => {
      navigation.navigate('ProductDetail', {
        productId: product.id,
        initialProduct: product,
      });
    },
    [navigation]
  );

  const renderProductItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard
        product={item}
        onPress={() => handleProductPress(item)}
      />
    ),
    [handleProductPress]
  );

  const renderFooter = () => {
    if (!isFetchingMore) return <View style={styles.footerSpacing} />;
    return (
      <View style={styles.footerLoading}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={[styles.loadingMoreText, { color: colors.textSecondary }]}>
          Loading more items...
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <SearchBar
        value={searchInput}
        onChangeText={setSearchInput}
        onClear={() => setSearchInput('')}
        isLoading={searchInput !== debouncedSearch}
      />

      {!isLoading && !error && products.length > 0 && (
        <View style={styles.resultsInfoRow}>
          <Text style={[styles.resultsInfoText, { color: colors.textSecondary }]}>
            {debouncedSearch
              ? `Found ${total} result(s) for "${debouncedSearch}"`
              : `Showing ${products.length} of ${total} items`}
          </Text>
        </View>
      )}

      {isLoading ? (
        <SkeletonGrid count={6} />
      ) : error ? (
        <RetryErrorView
          error={error}
          onRetry={handleRetry}
          retryInfo={retryInfo}
        />
      ) : products.length === 0 ? (
        <EmptyState
          title="No Products Found"
          description={
            debouncedSearch
              ? `We couldn't find any products matching "${debouncedSearch}". Try a different keyword.`
              : 'No products are currently available in the catalog.'
          }
          actionLabel={debouncedSearch ? 'Clear Search' : 'Refresh'}
          onAction={
            debouncedSearch ? () => setSearchInput('') : handleRefresh
          }
        />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => `product-${item.id}`}
          renderItem={renderProductItem}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          onEndReached={loadMoreProducts}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      <AnalyticsModal
        visible={isAnalyticsVisible}
        onClose={() => setIsAnalyticsVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  resultsInfoRow: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  resultsInfoText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  footerLoading: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingMoreText: {
    fontSize: 13,
    fontWeight: '500',
  },
  footerSpacing: {
    height: 20,
  },
});
