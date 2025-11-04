import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Animated,
    Dimensions,
    Easing,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface GradientButtonProps {
  title: string;
  onPress: () => void;
}

export default function GradientButton({ title, onPress }: GradientButtonProps) {
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const animateGradient = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateGradient();
  }, []);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <TouchableOpacity 
      style={styles.buttonContainer} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Animated.View 
        style={[
          styles.gradientBackground,
          {
            transform: [{ rotate: rotateInterpolate }],
          },
        ]}
      >
        <LinearGradient
          colors={['#64A2F7', '#E7499A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
      </Animated.View>
      <View style={styles.buttonInner}>
        <Text style={styles.buttonText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    overflow: 'hidden',
  },
  gradientBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gradient: {
    width: '100%',
    height: '100%',
  },
  buttonInner: {
    flex: 1,
    backgroundColor: 'rgba(48, 51, 85, 0.9)',
    margin: 2,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#575A89',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});