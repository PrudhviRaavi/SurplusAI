import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export const SuccessState = ({
  title = 'Action Completed!',
  description = 'Your request has been processed successfully.',
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        <Ionicons name="checkmark-circle" size={36} color="#10B981" />
      </View>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ECFDF5',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    alignItems: 'center',
    marginVertical: 12,
  },
  iconCircle: {
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '800',
    color: '#065F46',
    textAlign: 'center',
  },
  description: {
    fontSize: 13,
    color: '#047857',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
});
