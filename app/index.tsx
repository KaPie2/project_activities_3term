// app/index.tsx
import { Href, Link, useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';

export default function HomeScreen() {
  const testPages: { name: string; href: Href }[] = [
    { name: 'Регистрация', href: '/registration' },
    { name: 'Вход', href: '../login' },
  ];
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Если пользователь уже авторизован, перенаправляем его
    if (isAuthenticated) {
      if (user?.profileCompleted) {
        router.replace('/(tabs)');
      } else {
        router.replace('/profile-setup');
      }
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧪 Меню тестирования</Text>
      <Text style={styles.subtitle}>Выберите страницу для тестирования:</Text>
      
      <ScrollView style={styles.menuContainer}>
        {testPages.map((page, index) => (
          <Link key={index} href={page.href} asChild>
            <TouchableOpacity style={styles.menuButton}>
              <Text style={styles.menuButtonText}>{page.name}</Text>
            </TouchableOpacity>
          </Link>
        ))}
      </ScrollView>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  menuContainer: {
    flex: 1,
  },
  menuButton: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  footer: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    color: '#999',
    fontSize: 14,
  },
});