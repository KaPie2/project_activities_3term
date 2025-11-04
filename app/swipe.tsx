import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SwipeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Хедер */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => router.push('/chats')}
        >
          <Ionicons name="chatbubble-outline" size={24} color="black" />
        </TouchableOpacity>
        
        <Text style={styles.title}>OmGTU Connect</Text>
        
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => router.push('/profile')}
        >
          <Ionicons name="menu-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Заголовок секции */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Найди свою команду</Text>
        <Text style={styles.sectionSubtitle}>Свайпай профили студентов</Text>
      </View>

      {/* Контент - временные карточки */}
      <View style={styles.content}>
        
        {/* Карточка 1 */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.avatar, { backgroundColor: '#A1CEDC' }]} />
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>Анна, ФИВТ</Text>
              <Text style={styles.cardSkills}>React, Node.js, UI/UX</Text>
            </View>
          </View>
          <Text style={styles.cardBio}>
            Ищу команду для хакатона по мобильной разработке. Люблю чистый код и интересные задачи.
          </Text>
          <View style={styles.cardActions}>
            <Text style={styles.actionText}>👈 Свайпните влево</Text>
            <Text style={styles.actionText}>👉 Свайпните вправо</Text>
          </View>
        </View>

        {/* Карточка 2 */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.avatar, { backgroundColor: '#FFB6C1' }]} />
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>Максим, Дизайн</Text>
              <Text style={styles.cardSkills}>Figma, Illustrator, UI/UX</Text>
            </View>
          </View>
          <Text style={styles.cardBio}>
            Дизайнер ищу разработчиков для совместного проекта. Есть идея для образовательного приложения.
          </Text>
          <View style={styles.cardActions}>
            <Text style={styles.actionText}>👈 Свайпните влево</Text>
            <Text style={styles.actionText}>👉 Свайпните вправо</Text>
          </View>
        </View>

        {/* Подсказка */}
        <Text style={styles.hint}>
          Здесь будут реальные профили студентов для свайпов
        </Text>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  iconButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardSkills: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  cardBio: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginBottom: 12,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  hint: {
    textAlign: 'center',
    color: '#888',
    fontSize: 12,
    marginTop: 20,
    fontStyle: 'italic',
  },
});
