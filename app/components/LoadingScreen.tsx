// app/components/LoadingScreen.tsx
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Easing,
    StyleSheet,
    Text,
    View
} from 'react-native';
import BackgroundImage from './BackgroundImage';

// Простые SVG-шестеренки
const GearIcon = ({ size = 100, color = '#E7499A', style = {} }) => (
  <View style={[styles.gearContainer, { width: size, height: size }, style]}>
    {/* Внешнее кольцо шестеренки */}
    <View style={[styles.gearRing, { borderColor: color }]} />
    
    {/* Зубья шестеренки */}
    <View style={[styles.gearTooth, styles.tooth1, { backgroundColor: color }]} />
    <View style={[styles.gearTooth, styles.tooth2, { backgroundColor: color }]} />
    <View style={[styles.gearTooth, styles.tooth3, { backgroundColor: color }]} />
    <View style={[styles.gearTooth, styles.tooth4, { backgroundColor: color }]} />
    <View style={[styles.gearTooth, styles.tooth5, { backgroundColor: color }]} />
    <View style={[styles.gearTooth, styles.tooth6, { backgroundColor: color }]} />
    <View style={[styles.gearTooth, styles.tooth7, { backgroundColor: color }]} />
    <View style={[styles.gearTooth, styles.tooth8, { backgroundColor: color }]} />
    
    {/* Внутренний круг */}
    <View style={[styles.gearCenter, { backgroundColor: '#64A2F7' }]} />
  </View>
);

interface LoadingScreenProps {
  title?: string;
  subtitle?: string;
  mode?: 'default' | 'minimal';
}

export default function LoadingScreen({
  title = "Загрузка",
  subtitle = "OMSTU Connect | Ищем подходящих людей...",
  mode = 'default'
}: LoadingScreenProps) {
  const rotateValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;
  const textFadeValue = useRef(new Animated.Value(0)).current;

  // Анимация вращения
  useEffect(() => {
    // Анимация вращения шестеренок
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 2500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // Анимация появления шестеренок
    Animated.timing(fadeValue, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Анимация появления текста (с задержкой)
    Animated.sequence([
      Animated.delay(400),
      Animated.timing(textFadeValue, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();

    rotateAnimation.start();

    return () => {
      rotateAnimation.stop();
    };
  }, []);

  const rotateInterpolate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const rotateInterpolateReverse = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });

  // Стили для анимированных элементов
  const animatedStyles = {
    gearRotation: {
      transform: [{ rotate: rotateInterpolate }],
    },
    gearRotationReverse: {
      transform: [{ rotate: rotateInterpolateReverse }],
    },
    fade: {
      opacity: fadeValue,
    },
    textFade: {
      opacity: textFadeValue,
    },
  };

  // Минимальная версия
  if (mode === 'minimal') {
    return (
      <View style={styles.fullScreen}>
        <BackgroundImage>
          <View style={styles.minimalContainer}>
            <Animated.View style={[styles.minimalGear, animatedStyles.gearRotation, animatedStyles.fade]}>
              <GearIcon size={100} color="#E7499A" />
            </Animated.View>
            <Animated.View style={[styles.minimalTextContainer, animatedStyles.textFade]}>
              <Text style={styles.minimalTitle}>OMSTU Connect</Text>
            </Animated.View>
          </View>
        </BackgroundImage>
      </View>
    );
  }

  // Полная версия
  return (
    <View style={styles.fullScreen}>
      <BackgroundImage>
        {/* Основной контент */}
        <View style={styles.content}>
          {/* Шестеренки */}
          <Animated.View style={[styles.gearsWrapper, animatedStyles.fade]}>
            {/* Большая шестеренка */}
            <Animated.View style={[styles.gearWrapperLarge, animatedStyles.gearRotation]}>
              <GearIcon size={160} color="#E7499A" />
            </Animated.View>
            
            {/* Маленькая шестеренка */}
            <Animated.View style={[styles.gearWrapperSmall, animatedStyles.gearRotationReverse]}>
              <GearIcon size={100} color="#64A2F7" />
            </Animated.View>
          </Animated.View>

          {/* Текст под шестеренкой */}
          <Animated.View style={[styles.textContainer, animatedStyles.textFade]}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </Animated.View>
        </View>
      </BackgroundImage>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  minimalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  minimalGear: {
    marginBottom: 30,
  },
  minimalTextContainer: {
    alignItems: 'center',
  },
  minimalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  gearsWrapper: {
    marginBottom: 60, // Отступ для текста снизу
    position: 'relative',
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gearWrapperLarge: {
    position: 'absolute',
  },
  gearWrapperSmall: {
    position: 'absolute',
    top: 30,
    right: 20,
  },
  gearContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gearRing: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 1000,
    borderWidth: 10,
    opacity: 0.8,
  },
  gearTooth: {
    position: 'absolute',
    width: 18,
    height: 50,
    borderRadius: 9,
  },
  tooth1: { transform: [{ translateY: -80 }] },
  tooth2: { transform: [{ translateY: -80 }, { rotate: '45deg' }] },
  tooth3: { transform: [{ translateY: -80 }, { rotate: '90deg' }] },
  tooth4: { transform: [{ translateY: -80 }, { rotate: '135deg' }] },
  tooth5: { transform: [{ translateY: -80 }, { rotate: '180deg' }] },
  tooth6: { transform: [{ translateY: -80 }, { rotate: '225deg' }] },
  tooth7: { transform: [{ translateY: -80 }, { rotate: '270deg' }] },
  tooth8: { transform: [{ translateY: -80 }, { rotate: '315deg' }] },
  gearCenter: {
    width: 50,
    height: 50,
    borderRadius: 25,
    position: 'absolute',
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 30,
    maxWidth: 400,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 10,
    fontFamily: 'System',
  },
  subtitle: {
    fontSize: 18,
    color: '#C2D7FF',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.95,
    fontFamily: 'System',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
});