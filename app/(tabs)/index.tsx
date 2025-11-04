import { Image } from 'expo-image';
import { Pressable, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/useAuth';
import { Redirect } from 'expo-router';

export default function HomeScreen() {
  const { isAuthenticated, user, logout } = useAuth();

  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (isAuthenticated === false) {
    return <Redirect href="/login" />;
  }

  // Пока проверяем авторизацию, показываем заглушку
  if (isAuthenticated === null) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  const handleLogout = async () => {
    await logout();
    // После выхода произойдет автоматическое перенаправление из-за изменения isAuthenticated
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.userInfo}>
        <ThemedText type="subtitle">
          Hello, {user?.name || user?.email || 'User'}!
        </ThemedText>
        <ThemedText>
          You are successfully logged in
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.logoutContainer}>
        <Pressable 
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.logoutButtonPressed
          ]}
          onPress={handleLogout}
        >
          <ThemedText type="defaultSemiBold" style={styles.logoutText}>
            Logout
          </ThemedText>
        </Pressable>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  userInfo: {
    gap: 8,
    marginBottom: 30,
    alignItems: 'center',
  },
  logoutContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  logoutButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  logoutText: {
    color: 'white',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});