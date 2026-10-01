import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Search, XCircle } from 'lucide-react-native';
import { useTheme } from '../theme/useTheme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  isLoading?: boolean;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onClear,
  isLoading = false,
  placeholder = 'Search products, brands, categories...',
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <Search
        size={20}
        color={colors.textSecondary}
        style={styles.searchIcon}
      />

      <TextInput
        style={[styles.input, { color: colors.text }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        clearButtonMode="never"
      />

      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={colors.primary}
          style={styles.rightAction}
        />
      ) : value.length > 0 ? (
        <TouchableOpacity
          onPress={onClear}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.rightAction}
        >
          <XCircle size={18} color={colors.textMuted} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    height: 48,
    marginHorizontal: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    paddingVertical: 8,
  },
  rightAction: {
    marginLeft: 8,
  },
});
