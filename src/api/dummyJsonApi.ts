import { Product, ProductsResponse } from '../types';
import { sleep } from '../utils/sleep';

export const API_BASE_URL = 'https://dummyjson.com';
export const DEFAULT_PAGE_LIMIT = 20;

export interface FetchOptions extends RequestInit {
  maxRetries?: number;
  initialDelayMs?: number;
  backoffFactor?: number;
  timeoutMs?: number;
  onRetry?: (attempt: number, error: any, nextDelayMs: number) => void;
}

export async function fetchWithRetry<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelayMs = 400,
    backoffFactor = 2,
    timeoutMs = 12000,
    onRetry,
    signal,
    ...fetchOptions
  } = options;

  let attempt = 0;

  while (true) {
    let timeoutId: any;
    try {
      const timeoutController = new AbortController();
      timeoutId = setTimeout(() => {
        timeoutController.abort(new Error('Request timed out'));
      }, timeoutMs);

      if (signal) {
        if (signal.aborted) {
          throw new DOMException('The user aborted a request.', 'AbortError');
        }
        signal.addEventListener('abort', () => timeoutController.abort(), {
          once: true,
        });
      }

      const response = await fetch(url, {
        ...fetchOptions,
        signal: timeoutController.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const isServerOrThrottled =
          response.status >= 500 || response.status === 429;
        if (isServerOrThrottled && attempt < maxRetries) {
          throw new Error(`Server responded with HTTP ${response.status}`);
        }

        let errorBody = '';
        try {
          errorBody = await response.text();
        } catch {
          errorBody = '';
        }
        throw new Error(
          `HTTP Error ${response.status}: ${response.statusText} ${errorBody}`
        );
      }

      const data: T = await response.json();
      return data;
    } catch (err: any) {
      if (timeoutId) clearTimeout(timeoutId);

      if (
        err.name === 'AbortError' ||
        (signal && signal.aborted) ||
        err.message?.includes('aborted')
      ) {
        throw err;
      }

      if (attempt >= maxRetries) {
        console.warn(`[API] Failed after ${maxRetries} retries: ${url}`, err);
        throw err;
      }

      attempt++;
      const baseDelay = initialDelayMs * Math.pow(backoffFactor, attempt - 1);
      const jitter = Math.random() * (baseDelay * 0.2);
      const delay = baseDelay + jitter;

      if (onRetry) {
        onRetry(attempt, err, delay);
      }

      console.warn(
        `[API Retry] Attempt ${attempt}/${maxRetries} for ${url} failed (${err.message}). Retrying in ${Math.round(delay)}ms...`
      );

      await sleep(delay);
    }
  }
}

export async function getProducts(
  limit: number = DEFAULT_PAGE_LIMIT,
  skip: number = 0,
  signal?: AbortSignal,
  onRetry?: (attempt: number, error: any, nextDelayMs: number) => void
): Promise<ProductsResponse> {
  const url = `${API_BASE_URL}/products?limit=${limit}&skip=${skip}`;
  return fetchWithRetry<ProductsResponse>(url, { signal, onRetry });
}

export async function searchProducts(
  query: string,
  limit: number = DEFAULT_PAGE_LIMIT,
  skip: number = 0,
  signal?: AbortSignal,
  onRetry?: (attempt: number, error: any, nextDelayMs: number) => void
): Promise<ProductsResponse> {
  const encoded = encodeURIComponent(query.trim());
  const url = `${API_BASE_URL}/products/search?q=${encoded}&limit=${limit}&skip=${skip}`;
  return fetchWithRetry<ProductsResponse>(url, { signal, onRetry });
}

export async function getProductById(
  productId: number,
  signal?: AbortSignal
): Promise<Product> {
  const url = `${API_BASE_URL}/products/${productId}`;
  return fetchWithRetry<Product>(url, { signal });
}
