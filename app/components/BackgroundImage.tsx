// app/components/BackgroundImage.tsx
import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

const backgroundImage = require('../../assets/images/welcome/background.png');

interface BackgroundImageProps {
  children?: React.ReactNode; // Добавляем поддержку children
}

export default function BackgroundImage({ children }: BackgroundImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <View style={styles.container}>
      {/* Fallback фон */}
      <View style={[styles.fallback, { opacity: isLoaded ? 0 : 1 }]} />
      
      {/* Фоновое изображение */}
      <Image 
        source={backgroundImage} 
        style={[styles.image, { opacity: isLoaded ? 1 : 0 }]}
        resizeMode="cover"
        fadeDuration={0}
        onLoad={() => {
          console.log('✅ Background loaded');
          setIsLoaded(true);
        }}
      />
      
      {/* Children (другие компоненты поверх фона) */}
      {children && (
        <View style={styles.content}>
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  fallback: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1a1a2e',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});