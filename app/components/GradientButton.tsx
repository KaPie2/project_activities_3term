import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function GradientButton({ title, onPress, loading = false, disabled = false }: GradientButtonProps) {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (disabled || loading) return;

    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, [disabled, loading]);

  const opacity1 = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 1]
  });

  const opacity2 = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 0]
  });

  return (
    <View style={styles.shadowContainer}>
      <TouchableOpacity 
        onPress={onPress} 
        disabled={disabled || loading}
        style={styles.buttonContainer}
      >
        <View style={[styles.gradientContainer, (disabled || loading) && styles.gradientDisabled]}>
          <Animated.View style={[styles.gradientBase, { opacity: opacity1 }]}>
            <LinearGradient
              colors={['#64A2F7', '#E7499A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
          
          <Animated.View style={[styles.gradientBase, { opacity: opacity2 }]}>
            <LinearGradient
              colors={['#E7499A', '#64A2F7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
          
          <View style={styles.content}>
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>{title}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowContainer: {
    width: '100%',
    // Тень для iOS
    shadowColor: '#010124',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    // Тень для Android
    elevation: 4,
    borderRadius: 60,
    // Убираем белый фон, вместо этого используем прозрачный
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    width: '100%',
    borderRadius: 60,
    overflow: 'hidden',
    height: 50,
  },
  gradientContainer: {
    flex: 1,
    position: 'relative',
    borderRadius: 60,
  },
  gradientBase: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 70,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
    borderRadius: 60,
  },
  gradientDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});