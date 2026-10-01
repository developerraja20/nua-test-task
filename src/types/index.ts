export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags?: string[];
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: ProductDimensions;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: ProductReview[];
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type ThemeMode = 'system' | 'light' | 'dark';

export type AnalyticsEventType =
  | 'product_viewed'
  | 'add_to_cart'
  | 'search_performed'
  | 'app_backgrounded'
  | 'return_policy_viewed';

export interface AnalyticsEvent {
  id: string;
  event: AnalyticsEventType;
  timestamp: string;
  metadata: Record<string, any>;
}

export type RootStackParamList = {
  ProductList: undefined;
  ProductDetail: { productId: number; initialProduct?: Product };
  Cart: undefined;
  ReturnPolicyWebView: { url: string; title?: string };
};
