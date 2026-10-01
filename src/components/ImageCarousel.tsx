import React, { useState } from 'react';
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useTheme } from '../theme/useTheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CAROUSEL_HEIGHT = 300;

interface ImageCarouselProps {
  images: string[];
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const { colors } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);

  const validImages = images && images.length > 0 ? images : [];

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slide = Math.round(
      event.nativeEvent.contentOffset.x / SCREEN_WIDTH
    );
    if (slide !== activeIndex && slide >= 0 && slide < validImages.length) {
      setActiveIndex(slide);
    }
  };

  if (validImages.length === 0) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.surfaceSecondary },
        ]}
      />
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        style={styles.scrollView}
      >
        {validImages.map((imageUri, index) => (
          <View
            key={`img-${index}`}
            style={[
              styles.imageWrapper,
              { backgroundColor: colors.surfaceSecondary },
            ]}
          >
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        ))}
      </ScrollView>

      {validImages.length > 1 && (
        <View style={styles.paginationDotsContainer}>
          {validImages.map((_, index) => (
            <View
              key={`dot-${index}`}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === activeIndex
                      ? colors.primary
                      : colors.borderStrong,
                  width: index === activeIndex ? 20 : 6,
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: CAROUSEL_HEIGHT,
    position: 'relative',
  },
  scrollView: {
    width: SCREEN_WIDTH,
    height: CAROUSEL_HEIGHT,
  },
  imageWrapper: {
    width: SCREEN_WIDTH,
    height: CAROUSEL_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  paginationDotsContainer: {
    position: 'absolute',
    bottom: 12,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});
