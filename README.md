# Product Catalog Mobile App

A React Native mobile application built with **Expo (SDK 57)**, **TypeScript**, **Zustand**, and **React Native WebView**.

---

## 🚀 Setup & Run Instructions

### Prerequisites
- Node.js (v18+)
- npm
- Expo CLI (`npx expo`)
- Android Studio / Emulator or iOS Simulator / Physical Device with Expo Go

### Installation & Run

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Dev Server**:
   ```bash
   npx expo start
   ```

3. **Run on Android**:
   ```bash
   npm run android
   ```

4. **Run on iOS**:
   ```bash
   npm run ios
   ```

5. **Type Check**:
   ```bash
   npx tsc --noEmit
   ```

6. **Run Tests**:
   ```bash
   npm test
   ```

---

## 🛠 Features Implemented

- **Product Catalog & Search**: Browse products fetched from DummyJSON API with debounced search filtering.
- **Product Details**: Product specification view with image gallery, pricing calculations, stock status, and reviews.
- **Cart Management**: Add items, update quantities with `+` / `-` steppers, remove items, and view total price summary (`useCartStore`).
- **Return Policy WebView**: Accessible from the Cart screen, rendering custom styled HTML content via `react-native-webview` from the local module `returnPolicy/return_policy.ts`.
- **Analytics Event Logger**: In-memory analytics logger tracking product views, cart additions, search queries, app backgrounding, and return policy views (`analytics.ts`).

---

## 💡 Assumptions Made

1. **Product Data**: Assumed DummyJSON (`https://dummyjson.com/products`) as the backend REST API for product catalog data.
2. **Offline Web Content**: Assumed Return Policy content should render offline without relying on external network servers or local file path URI (`file://`) restrictions.

---

## ⚖️ Trade-offs Made

1. **Bundled HTML String Module**:
   - **Trade-off**: Exporting Return Policy HTML directly in `returnPolicy/return_policy.ts`.
   - **Reason**: Guarantees zero network latency and avoids platform-specific local file permission issues on physical devices.
2. **In-Memory Store for Cart & Analytics**:
   - **Trade-off**: Stored cart items and analytics event logs in Zustand memory state without local storage persistence (`AsyncStorage`).
   - **Reason**: Keeps application state lightweight, reactive, and fast for development.

---

## 🔮 Future Improvements

1. **State Persistence**: Add `@react-native-async-storage/async-storage` to persist cart items and analytics logs across app reboots.
2. **Payment Checkout**: Integrate a payment gateway (e.g. Stripe / Apple Pay / Google Pay) for order processing.
3. **E2E Testing**: Add end-to-end integration tests using React Native Testing Library / Detox for complete user journey validation.
