import { create } from 'zustand';
import { AnalyticsEvent, AnalyticsEventType } from '../types';

interface AnalyticsStoreState {
  events: AnalyticsEvent[];
  addEvent: (event: AnalyticsEvent) => void;
  clearEvents: () => void;
}

export const useAnalyticsStore = create<AnalyticsStoreState>((set) => ({
  events: [],
  addEvent: (event: AnalyticsEvent) =>
    set((state) => ({
      events: [event, ...state.events.slice(0, 99)],
    })),
  clearEvents: () => set({ events: [] }),
}));

class AnalyticsService {
  private log(event: AnalyticsEventType, metadata: Record<string, any> = {}) {
    const timestamp = new Date().toISOString();
    const eventObject: AnalyticsEvent = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      event,
      timestamp,
      metadata,
    };

    console.log(
      `📊 [MockAnalytics] Event: "${event}"\n` +
        `   Timestamp: ${timestamp}\n` +
        `   Metadata: ${JSON.stringify(metadata, null, 2)}`
    );

    useAnalyticsStore.getState().addEvent(eventObject);
  }

  public logProductViewed(product: {
    id: number;
    title: string;
    category?: string;
    price: number;
    discountPercentage?: number;
  }) {
    this.log('product_viewed', {
      productId: product.id,
      title: product.title,
      category: product.category,
      price: product.price,
      discountPercentage: product.discountPercentage,
    });
  }

  public logAddToCart(
    product: { id: number; title: string; price: number },
    quantity: number = 1
  ) {
    this.log('add_to_cart', {
      productId: product.id,
      title: product.title,
      price: product.price,
      quantity,
      totalValue: Number((product.price * quantity).toFixed(2)),
    });
  }

  public logSearchPerformed(query: string, resultsCount: number) {
    this.log('search_performed', {
      query,
      resultsCount,
      trimmedLength: query.trim().length,
    });
  }

  public logAppBackgrounded(metadata: Record<string, any> = {}) {
    this.log('app_backgrounded', {
      trigger: 'AppStateChange',
      ...metadata,
    });
  }

  public logReturnPolicyViewed(metadata: Record<string, any> = {}) {
    this.log('return_policy_viewed', {
      timestamp: new Date().toISOString(),
      ...metadata,
    });
  }
}

export const analytics = new AnalyticsService();
