import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export const MultiSelectPills = ({
  options = [],
  selectedValues = [],
  onToggle,
  style,
}) => {
  return (
    <View style={[styles.pillsContainer, style]}>
      {options.map((item) => {
        const value = typeof item === 'string' ? item : item.value;
        const label = typeof item === 'string' ? item : item.label;
        const icon = typeof item === 'object' ? item.icon : null;
        const isSelected = selectedValues.includes(value);

        return (
          <TouchableOpacity
            key={value}
            activeOpacity={0.7}
            onPress={() => onToggle(value)}
            style={[styles.pill, isSelected && styles.pillSelected]}
          >
            {isSelected && (
              <Ionicons
                name="checkmark"
                size={14}
                color={colors.primary}
                style={styles.checkIcon}
              />
            )}
            {icon && <Text style={styles.pillIcon}>{icon}</Text>}
            <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginRight: 8,
    marginBottom: 10,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  pillSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(75, 99, 85, 0.08)',
  },
  checkIcon: {
    marginRight: 6,
  },
  pillIcon: {
    marginRight: 6,
    fontSize: 14,
  },
  pillText: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: colors.textPrimary,
  },
  pillTextSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
});
