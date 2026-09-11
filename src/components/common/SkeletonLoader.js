import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '../../theme/colors';

export const SkeletonLoader = ({ count = 3, height = 80 }) => {
  const animatedValue = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue]);

  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.skeletonCard,
            { height, opacity: animatedValue },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
    marginVertical: 8,
  },
  skeletonCard: {
    backgroundColor: '#FAF4EB',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
