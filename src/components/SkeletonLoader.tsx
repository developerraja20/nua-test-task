import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from '../theme/useTheme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export const SkeletonCard: React.FC = () => {
  const { colors } = useTheme();
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.8,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, [opacityAnim]);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.imagePlaceholder,
          {
            backgroundColor: colors.surfaceSecondary,
            opacity: opacityAnim,
          },
        ]}
      />
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.lineCategory,
            { backgroundColor: colors.surfaceSecondary, opacity: opacityAnim },
          ]}
        />
        <Animated.View
          style={[
            styles.lineTitle,
            { backgroundColor: colors.surfaceSecondary, opacity: opacityAnim },
          ]}
        />
        <Animated.View
          style={[
            styles.lineTitleShort,
            { backgroundColor: colors.surfaceSecondary, opacity: opacityAnim },
          ]}
        />
        <Animated.View
          style={[
            styles.linePrice,
            { backgroundColor: colors.surfaceSecondary, opacity: opacityAnim },
          ]}
        />
        <Animated.View
          style={[
            styles.buttonPlaceholder,
            { backgroundColor: colors.surfaceSecondary, opacity: opacityAnim },
          ]}
        />
      </View>
    </View>
  );
};

export const SkeletonGrid: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <View style={styles.grid}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={`skeleton-${index}`} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    width: '100%',
    height: 140,
  },
  content: {
    padding: 12,
  },
  lineCategory: {
    width: '40%',
    height: 10,
    borderRadius: 5,
    marginBottom: 8,
  },
  lineTitle: {
    width: '90%',
    height: 14,
    borderRadius: 6,
    marginBottom: 6,
  },
  lineTitleShort: {
    width: '65%',
    height: 14,
    borderRadius: 6,
    marginBottom: 10,
  },
  linePrice: {
    width: '50%',
    height: 18,
    borderRadius: 6,
    marginBottom: 10,
  },
  buttonPlaceholder: {
    width: '100%',
    height: 32,
    borderRadius: 10,
  },
});
