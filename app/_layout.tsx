import { Asset } from 'expo-asset';
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import LoadingScreen from './components/LoadingScreen';

const preloadBackgroundImage = async () => {
  try {
    const backgroundImage = require('../assets/images/welcome/background.png');
    await Asset.fromModule(backgroundImage).downloadAsync();
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
    <LoadingScreen 
      title="OMSTU Connect"
      subtitle="Загружаем ваши данные..."
      mode="minimal"
    />
  );
}

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="swipe" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false}} />          
      <Stack.Screen name="registration" options={{ headerShown: false }} />
      <Stack.Screen name="profile-setup" options={{ headerShown: false}} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="chats" options={{ title: "Чаты" }} />
      <Stack.Screen name="filters" options={{ headerShown: false }} />
    </Stack>
  );
}

export default RootLayoutContent;
