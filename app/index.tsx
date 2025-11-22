import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export default function HomeScreen() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Если пользователь уже авторизован, перенаправляем его
    if (isAuthenticated) {
      if (user?.profileCompleted) {
        router.replace('./swipe');
      } else {
        router.replace('/profile-setup');
      }
    } else if (isAuthenticated === false) {
      // Если пользователь не авторизован - отправляем на welcome
      router.replace('./welcome');
    }
  }, [isAuthenticated]);

  // Если проверка еще не завершена, показываем загрузку
  if (isAuthenticated === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Этот return больше не показывается, так как есть редирект
  // Но оставляем его для TypeScript
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: '#FFFFFF',
  },
};