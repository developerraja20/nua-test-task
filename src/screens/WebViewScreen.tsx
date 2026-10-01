import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RotateCw } from 'lucide-react-native';
import { RootStackParamList } from '../types';
import { useTheme } from '../theme/useTheme';
import { analytics } from '../services/analytics';
import { RETURN_POLICY } from '../../returnPolicy/return_policy';

type WebViewRouteProp = RouteProp<RootStackParamList, 'ReturnPolicyWebView'>;

export const WebViewScreen: React.FC = () => {
  const route = useRoute<WebViewRouteProp>();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const webViewRef = useRef<WebView>(null);

  const { url, title = 'Return Policy' } = route.params;

  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    analytics.logReturnPolicyViewed({ url, title });
  }, [url, title]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: title,
      headerStyle: { backgroundColor: colors.surface },
      headerTintColor: colors.text,
      headerShadowVisible: false,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            setHasError(false);
            webViewRef.current?.reload();
          }}
          style={styles.refreshBtn}
        >
          <RotateCw size={20} color={colors.text} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, colors, title]);

  const webViewSource =
    !url || url.startsWith('file://') || hasError
      ? { html: RETURN_POLICY }
      : { uri: url };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {isLoading && (
        <View
          style={[
            styles.progressBar,
            {
              backgroundColor: colors.primary,
              width: `${Math.max(15, loadingProgress * 100)}%`,
            },
          ]}
        />
      )}

      <WebView
        ref={webViewRef}
        source={webViewSource}
        style={styles.webView}
        onLoadProgress={({ nativeEvent }) =>
          setLoadingProgress(nativeEvent.progress)
        }
        onLoadEnd={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        startInLoadingState={true}
        renderLoading={() => (
          <View
            style={[
              styles.spinnerOverlay,
              { backgroundColor: colors.background },
            ]}
          >
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.spinnerText, { color: colors.textSecondary }]}>
              Loading Return Policy...
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  refreshBtn: {
    padding: 6,
    marginRight: 6,
  },
  progressBar: {
    height: 3,
  },
  webView: {
    flex: 1,
  },
  spinnerOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '500',
  },
});
