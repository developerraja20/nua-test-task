import { useState, useEffect, useRef, useCallback } from 'react';
import { Product } from '../types';
import {
  getProducts,
  searchProducts,
  DEFAULT_PAGE_LIMIT,
} from '../api/dummyJsonApi';
import { analytics } from '../services/analytics';

export interface UseProductsState {
  products: Product[];
  isLoading: boolean;
  isFetchingMore: boolean;
  isRefreshing: boolean;
  error: string | null;
  hasMore: boolean;
  total: number;
  retryInfo: {
    isRetrying: boolean;
    attempt: number;
    delayMs: number;
  } | null;
}

export function useProducts(searchQuery: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [retryInfo, setRetryInfo] = useState<{
    isRetrying: boolean;
    attempt: number;
    delayMs: number;
  } | null>(null);

  const requestIdRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const skipRef = useRef<number>(0);

  const trimmedQuery = searchQuery.trim();

  const handleRetryEvent = useCallback(
    (attempt: number, err: any, delayMs: number) => {
      setRetryInfo({
        isRetrying: true,
        attempt,
        delayMs,
      });
    },
    []
  );

  const loadInitialProducts = useCallback(
    async (refresh: boolean = false) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const currentRequestId = ++requestIdRef.current;

      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      setRetryInfo(null);
      skipRef.current = 0;

      try {
        const response = trimmedQuery.length > 0
          ? await searchProducts(
              trimmedQuery,
              DEFAULT_PAGE_LIMIT,
              0,
              controller.signal,
              handleRetryEvent
            )
          : await getProducts(
              DEFAULT_PAGE_LIMIT,
              0,
              controller.signal,
              handleRetryEvent
            );

        if (currentRequestId !== requestIdRef.current) {
          return;
        }

        setProducts(response.products);
        setTotal(response.total);
        skipRef.current = response.products.length;
        setHasMore(response.products.length < response.total);
        setRetryInfo(null);

        if (trimmedQuery.length > 0) {
          analytics.logSearchPerformed(trimmedQuery, response.total);
        }
      } catch (err: any) {
        if (
          err.name === 'AbortError' ||
          err.message?.includes('aborted') ||
          controller.signal.aborted
        ) {
          return;
        }

        if (currentRequestId === requestIdRef.current) {
          setError(
            err.message || 'Failed to load products. Please check your network.'
          );
        }
      } finally {
        if (currentRequestId === requestIdRef.current) {
          setIsLoading(false);
          setIsRefreshing(false);
          setRetryInfo(null);
        }
      }
    },
    [trimmedQuery, handleRetryEvent]
  );

  const loadMoreProducts = useCallback(async () => {
    if (isLoading || isFetchingMore || isRefreshing || !hasMore) {
      return;
    }

    setIsFetchingMore(true);
    const currentRequestId = requestIdRef.current;
    const currentSkip = skipRef.current;

    try {
      const response = trimmedQuery.length > 0
        ? await searchProducts(
            trimmedQuery,
            DEFAULT_PAGE_LIMIT,
            currentSkip,
            undefined,
            handleRetryEvent
          )
        : await getProducts(
            DEFAULT_PAGE_LIMIT,
            currentSkip,
            undefined,
            handleRetryEvent
          );

      if (currentRequestId !== requestIdRef.current) {
        return;
      }

      setProducts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newProducts = response.products.filter(
          (p) => !existingIds.has(p.id)
        );
        return [...prev, ...newProducts];
      });

      skipRef.current = currentSkip + response.products.length;
      setHasMore(skipRef.current < response.total);
    } catch (err: any) {
      console.warn('Pagination error:', err.message);
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setIsFetchingMore(false);
        setRetryInfo(null);
      }
    }
  }, [
    isLoading,
    isFetchingMore,
    isRefreshing,
    hasMore,
    trimmedQuery,
    handleRetryEvent,
  ]);

  const handleRefresh = useCallback(() => {
    loadInitialProducts(true);
  }, [loadInitialProducts]);

  const handleRetry = useCallback(() => {
    loadInitialProducts(false);
  }, [loadInitialProducts]);

  useEffect(() => {
    loadInitialProducts(false);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadInitialProducts]);

  return {
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
  };
}
