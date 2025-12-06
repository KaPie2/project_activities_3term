import { Asset } from 'expo-asset';
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../hooks/useAuth';

const preloadBackgroundImage = async () => {
  try {
    const backgroundImage = require('../assets/images/welcome/background.png');
    await Asset.fromModule(backgroundImage).downloadAsync();
    console.log('✅ Фоновое изображение предзагружено');
  } catch (error) {
    console.warn('⚠️ Ошибка предзагрузки фона:', error);
  }
};

SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    preloadBackgroundImage();
  }, []);

  const hideSplashScreen = async () => {
    if (isAuthenticated !== null) {
      await SplashScreen.hideAsync();
    }
  };

  useEffect(() => {
    hideSplashScreen();
  }, [isAuthenticated]);

  // Показываем индикатор загрузки пока проверяем авторизацию
  if (isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="swipe" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false}} />          
      <Stack.Screen name="registration" options={{ headerShown: false }} />
      <Stack.Screen name="profile-setup" options={{ title: "Профиль" }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="chats" options={{ title: "Чаты" }} />
      <Stack.Screen name="filters" options={{ headerShown: false }} />
    </Stack>
  );
}

export default RootLayoutContent;
