import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, getDocs, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { db } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';

type MatchCriteria = 'skills' | 'hobbies' | 'both';

export default function FiltersScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedCriteria, setSelectedCriteria] = useState<MatchCriteria>('both');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserPreferences();
  }, [user]);

  const loadUserPreferences = async () => {
    if (!user?.email) return;

    try {
      // Ищем профиль по email
      const profilesQuery = query(
        collection(db, "profile"), 
        where("email", "==", user.email)
      );
      const profilesSnapshot = await getDocs(profilesQuery);
      
      if (!profilesSnapshot.empty) {
        const profileData = profilesSnapshot.docs[0].data();
        if (profileData.matchCriteria) {
          setSelectedCriteria(profileData.matchCriteria);
        }
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const handleSavePreferences = async () => {
    if (!user?.email) return;

    setLoading(true);
    try {
      // Находим профиль по email
      const profilesQuery = query(
        collection(db, "profile"), 
        where("email", "==", user.email)
      );
      const profilesSnapshot = await getDocs(profilesQuery);
      
      if (profilesSnapshot.empty) {
        Alert.alert('Ошибка', 'Профиль не найден');
        return;
      }

      const profileDoc = profilesSnapshot.docs[0];
      
      // Обновляем найденный документ профиля
      await updateDoc(profileDoc.ref, {
        matchCriteria: selectedCriteria,
        updatedAt: new Date().toISOString(),
      });

      Alert.alert('Успех!', 'Настройки подбора сохранены');
      router.back();
    } catch (error) {
      console.error('Error saving preferences:', error);
      Alert.alert('Ошибка', 'Не удалось сохранить настройки');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const criteriaOptions = [
    {
      id: 'skills' as MatchCriteria,
      title: 'По навыкам',
      description: 'Подбирать людей с похожими профессиональными навыками',
      icon: 'hammer-outline' as any,
      color: '#007AFF',
    },
    {
      id: 'hobbies' as MatchCriteria,
      title: 'По увлечениям',
      description: 'Находить людей с общими интересами и хобби',
      icon: 'heart-outline' as any,
      color: '#FF2D55',
    },
    {
      id: 'both' as MatchCriteria,
      title: 'По навыкам и увлечениям',
      description: 'Учитывать и профессиональные навыки, и общие интересы',
      icon: 'star-outline' as any,
      color: '#5856D6',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Критерии подбора</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Как подбирать людей?</Text>
          <Text style={styles.subtitle}>
            Выберите, по каким критериям система будет предлагать вам людей для знакомства
          </Text>

          <View style={styles.optionsContainer}>
            {criteriaOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionCard,
                  selectedCriteria === option.id && styles.optionCardSelected,
                ]}
                onPress={() => setSelectedCriteria(option.id)}
              >
                <View style={styles.optionHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: `${option.color}20` }]}>
                    <Ionicons name={option.icon} size={24} color={option.color} />
                  </View>
                  <View style={styles.optionText}>
                    <Text style={styles.optionTitle}>{option.title}</Text>
                    <Text style={styles.optionDescription}>{option.description}</Text>
                  </View>
                  <View style={[
                    styles.radioCircle,
                    selectedCriteria === option.id && styles.radioCircleSelected,
                    selectedCriteria === option.id && { borderColor: option.color }
                  ]}>
                    {selectedCriteria === option.id && (
                      <View style={[styles.radioSelected, { backgroundColor: option.color }]} />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.infoCard}>
            <Ionicons name="information-circle-outline" size={24} color="#007AFF" />
            <Text style={styles.infoText}>
              Система будет предлагать людей, у которых есть совпадения по выбранным критериям
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
          onPress={handleSavePreferences}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Сохранение...' : 'Сохранить настройки'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  optionsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  optionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionCardSelected: {
    borderColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleSelected: {
    borderWidth: 2,
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1976D2',
    lineHeight: 18,
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});