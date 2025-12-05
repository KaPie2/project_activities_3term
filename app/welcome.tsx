import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient'; // ← ИЗМЕНИТЕ ИМПОРТ
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import GradientButton from './components/GradientButton';

const { width, height } = Dimensions.get('window');

// Импортируем ваши изображения
const backgroundImage = require('../assets/images/welcome/background.png');
const logoImage = require('../assets/images/welcome/logo.png');
const friendsIcon = require('../assets/images/welcome/friends-icon.png');
const datingIcon = require('../assets/images/welcome/dating-icon.png');
const teamsIcon = require('../assets/images/welcome/teams-icon.png');
const experienceIcon = require('../assets/images/welcome/experience-icon.png');

// 👇 ПРАВИЛЬНЫЙ ПУТЬ - шрифт в папке images/fonts/
const PublicPixelFont = require('../assets/images/fonts/PublicPixel.otf');

const features = [
  {
    id: '1',
    icon: friendsIcon,
    title: 'Находи друзей',
    description: 'Общайся с учащимися разных факультетов.',
  },
  {
    id: '2',
    icon: datingIcon, 
    title: 'Знакомься',
    description: 'Ищи возлюбленных или единомышленников.',
  },
  {
    id: '3',
    icon: teamsIcon,
    title: 'Собирай команды',
    description: 'Находи партнёров для проектов и стартапов.',
  },
  {
    id: '4',
    icon: experienceIcon,
    title: 'Обменивайся опытом',
    description: 'Обсуждай учебу, хобби и карьеру.',
  }
];

export default function WelcomeScreen() {
  const router = useRouter();

  // 👇 ЗАГРУЖАЕМ ШРИФТ
  const [fontsLoaded] = useFonts({
    'Public-Pixel': PublicPixelFont,
  });

  const handleGetStarted = () => {
    router.push('/login');
  };

  // 👇 ПОКАЗЫВАЕМ ЗАГРУЗКУ ПОКА ШРИФТ НЕ ЗАГРУЗИЛСЯ
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#64A2F7" />
      </View>
    );
  }

  const FeatureCard = ({ feature }: { feature: typeof features[0] }) => (
    <View style={styles.featureCard}>
      <View style={styles.featureContent}>
        <View style={styles.iconWrapper}>
          <LinearGradient
            colors={['#64A2F7', '#E7499A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientIcon}
          >
            <Image 
              source={feature.icon} 
              style={styles.iconImage}
              resizeMode="contain"
            />
          </LinearGradient>
        </View>

        <View style={styles.textWrapper}>
          <Text style={styles.featureTitle}>{feature.title}</Text>
          <Text style={styles.featureDescription}>{feature.description}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Background Image */}
      <Image 
        source={backgroundImage} 
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Основной контент без скролла */}
      <View style={styles.content}>
        {/* Main Logo/Image */}
        <View style={styles.logoContainer}>
          <Image 
            source={logoImage} 
            style={styles.mainImage}
            resizeMode="contain"
          />
        </View>

        {/* Features List */}
        <View style={styles.featuresContainer}>
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </View>

        {/* Button */}
        <View style={styles.buttonContainer}>
          <GradientButton 
            title="Далее" 
            onPress={handleGetStarted}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  backgroundImage: {
    position: 'absolute',
    width: width,
    height: height,
    top: 0,
    left: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: height * 0.02, 
    paddingBottom: height * 0.02,
    justifyContent: 'space-between', 
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: height * 0.01,
    flex: 0.5, 
    justifyContent: 'center',
  },
  mainImage: {
    width: Math.min(320, width - 40), 
    height: Math.min(300, height * 0.35),
  },
  featuresContainer: {
    flex: 0.55, 
    gap: 10, 
    justifyContent: 'center',
  },
  featureCard: {
    width: '100%',
    backgroundColor: 'rgba(48, 51, 85, 0.7)',
    borderWidth: 1,
    borderColor: '#575A89',
    borderRadius: 10, 
    paddingHorizontal: 12,
    paddingVertical: 10, 
    marginBottom: 8, 
  },
  featureContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    width: 36, 
    height: 36,
  },
  gradientIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  iconImage: {
    width: 20, 
    height: 20,
  },
  textWrapper: {
    flex: 1,
    gap: 4,
  },
  featureTitle: {
    color: '#C2D7FF',
    fontSize: 12, 
    fontFamily: 'Public-Pixel',
    lineHeight: 14,
    includeFontPadding: false,
  },
  featureDescription: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 14,
    includeFontPadding: false,
  },
  buttonContainer: {
    flex: 0.15, 
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 10,
  },
});