import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export const CardGridSelector = ({
  options = [],
  selectedId,
  onSelect,
  columns = 2,
  style,
}) => {
  return (
    <View style={[styles.gridContainer, style]}>
      {options.map((item) => {
        const isSelected = item.id === selectedId;
        const widthStyle = columns === 2 ? styles.colHalf : styles.colFull;

        return (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.8}
            onPress={() => onSelect(item.id)}
            style={[
              styles.card,
              widthStyle,
              isSelected && styles.cardSelected,
            ]}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.emoji}>{item.icon || '🍽️'}</Text>
              <View
                style={[
                  styles.radio,
                  isSelected && styles.radioSelected,
                ]}
              >
                {isSelected && <Ionicons name="checkmark" size={12} color={colors.white} />}
              </View>
            </View>

            <Text style={[styles.title, isSelected && styles.titleSelected]}>
              {item.label}
            </Text>

            {item.description && (
              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  colHalf: {
    width: '48.5%',
    marginBottom: 12,
  },
  colFull: {
    width: '100%',
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: '#FAF4EB',
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  emoji: {
    fontSize: 26,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  radioSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  title: {
    fontSize: 15,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  titleSelected: {
    color: colors.primary,
  },
  description: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 17,
  },
});
