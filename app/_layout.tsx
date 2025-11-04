import { useAuth } from '../hooks/useAuth';
import { Stack } from "expo-router";
import { View, ActivityIndicator } from 'react-native';

function RootLayoutContent() {
  const { isAuthenticated, user } = useAuth();

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
      <Stack.Screen name="swipe" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ title: "Вход" }} />
      <Stack.Screen name="registration" options={{ title: "Регистрация" }} />
      <Stack.Screen name="profile-setup" options={{ title: "Профиль" }} />
      <Stack.Screen name="profile" options={{ title: "Профиль" }} />
      <Stack.Screen name="chats" options={{ title: "Чаты" }} />
    </Stack>
  );
}
