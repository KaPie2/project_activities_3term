import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { db } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';
import LoadingScreen from './components/LoadingScreen';

const defaultAvatar = require('../assets/images/icon.png');

interface UserProfile {
  id: string;
  name: string;
  email: string;
  faculty: string;
  skills: string[];
  hobbies: string[];
  bio: string;
  gender: string;
  birthDate?: any; // Дата рождения из базы данных
  profileCompleted: boolean;
  avatar?: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, [user]);

  const loadUserProfile = async () => {
    if (!user?.email) return;

    try {
      const profilesQuery = query(collection(db, "profile"), where("email", "==", user.email));
      const profilesSnapshot = await getDocs(profilesQuery);
      
      if (!profilesSnapshot.empty) {
        const profileData = profilesSnapshot.docs[0].data();
        
        setProfile({
          id: profilesSnapshot.docs[0].id,
          name: profileData.name || '',
          email: profileData.email || '',
          faculty: profileData.faculty || '',
          skills: profileData.skills || [],
          hobbies: profileData.hobbies || [],
          bio: profileData.bio || '',
          gender: profileData.gender || '',
          birthDate: profileData.birthDate || null, // Берем из базы
          profileCompleted: true,
          avatar: profileData.avatar,
        });
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить профиль');
    } finally {
      setLoading(false);
    }
  };

  // Форматирование даты в дд.мм.гггг
  const formatBirthDate = (birthDate: any): string => {
    if (!birthDate) return 'Не указана';
    
    try {
      // Если это Firebase Timestamp, преобразуем в Date
      const date = birthDate.toDate ? birthDate.toDate() : new Date(birthDate);
      
      // Проверяем что дата валидна
      if (isNaN(date.getTime())) {
        console.error('Invalid date:', birthDate);
        return 'Неверная дата';
      }
      
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}.${month}.${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Ошибка формата';
    }
  };

  // Расчет возраста на основе даты рождения
  const calculateAge = (birthDate: any): number | null => {
    if (!birthDate) return null;
    
    try {
      const birth = birthDate.toDate ? birthDate.toDate() : new Date(birthDate);
      const today = new Date();
      
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      // Если день рождения еще не наступил в этом году, вычитаем 1 год
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      return age;
    } catch (error) {
      console.error('Error calculating age:', error);
      return null;
    }
  };

  // Получение возраста с правильным склонением
  const getAgeWithDeclension = (age: number | null): string => {
    if (age === null) return '';
    
    const lastDigit = age % 10;
    const lastTwoDigits = age % 100;
    
    // 11-19 лет
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return `${age} лет`;
    }
    
    // 1 год
    if (lastDigit === 1) {
      return `${age} год`;
    }
    
    // 2, 3, 4 года
    if (lastDigit >= 2 && lastDigit <= 4) {
      return `${age} года`;
    }
    
    // остальное - лет
    return `${age} лет`;
  };

  const handleEditProfile = () => {
    router.push('/profile-setup');
  };

  const handleLogout = async () => {
    Alert.alert(
      'Выход',
      'Вы уверены, что хотите выйти?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Выйти', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/welcome');
          }
        },
      ]
    );
  };

  const handleBack = () => {
    router.replace('/swipe');
  };

  if (loading) {
    return (
      <LoadingScreen 
        title="Загружаем профиль"
        subtitle="Получаем информацию о пользователе..."
      />
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text>Профиль не найден</Text>
      </View>
    );
  }

  const getGenderDisplayText = (gender: string) => {
    switch (gender) {
      case 'male': return 'Мужской';
      case 'female': return 'Женский';
      default: return 'Не указан';
    }
  };

  // Получаем данные о дате рождения и возрасте
  const formattedBirthDate = formatBirthDate(profile.birthDate);
  const age = calculateAge(profile.birthDate);
  const ageText = getAgeWithDeclension(age);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Профиль</Text>
        <TouchableOpacity onPress={handleEditProfile} style={styles.editButton}>
          <Ionicons name="create-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <Image 
            source={profile.avatar ? { uri: profile.avatar } : defaultAvatar} 
            style={styles.avatar}
            defaultSource={defaultAvatar}
          />
          <Text style={styles.userName}>{profile.name}</Text>
          <Text style={styles.userEmail}>{profile.email}</Text>
        </View>

        {/* Profile Info */}
        <View style={styles.infoSection}>
          {/* Faculty */}
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Ionicons name="school-outline" size={20} color="#007AFF" />
              <Text style={styles.infoTitle}>Факультет</Text>
            </View>
            <Text style={styles.infoValue}>{profile.faculty || 'Не указан'}</Text>
          </View>

          {/* Gender */}
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Ionicons name="male-female-outline" size={20} color="#007AFF" />
              <Text style={styles.infoTitle}>Пол</Text>
            </View>
            <Text style={styles.infoValue}>{getGenderDisplayText(profile.gender)}</Text>
          </View>

          {/* Дата рождения */}
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Ionicons name="calendar-outline" size={20} color="#007AFF" />
              <Text style={styles.infoTitle}>Дата рождения</Text>
            </View>
            
            {profile.birthDate ? (
              <View>
                <Text style={styles.birthDateText}>
                  {formattedBirthDate}
                </Text>
                
                {age !== null && (
                  <View style={styles.ageContainer}>
                    <View style={styles.ageBadge}>
                      <Text style={styles.ageBadgeText}>{ageText}</Text>
                    </View>
                  </View>
                )}
              </View>
            ) : (
              <Text style={styles.noInfoText}>Не указана</Text>
            )}
          </View>

          {/* Skills */}
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Ionicons name="hammer-outline" size={20} color="#007AFF" />
              <Text style={styles.infoTitle}>Навыки</Text>
            </View>
            {profile.skills && profile.skills.length > 0 ? (
              <View style={styles.skillsContainer}>
                {profile.skills.map((skill, index) => (
                  <View key={index} style={styles.skillTag}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noInfoText}>Навыки не указаны</Text>
            )}
          </View>

          {/* Hobbies */}
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Ionicons name="heart-outline" size={20} color="#007AFF" />
              <Text style={styles.infoTitle}>Увлечения</Text>
            </View>
            {profile.hobbies && profile.hobbies.length > 0 ? (
              <View style={styles.skillsContainer}>
                {profile.hobbies.map((hobby, index) => (
                  <View key={index} style={styles.hobbyTag}>
                    <Text style={styles.hobbyText}>{hobby}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noInfoText}>Увлечения не указаны</Text>
            )}
          </View>

          {/* Bio */}
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Ionicons name="person-outline" size={20} color="#007AFF" />
              <Text style={styles.infoTitle}>О себе</Text>
            </View>
            <Text style={styles.infoValue}>
              {profile.bio || 'Информация о себе не указана'}
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionButton} onPress={handleEditProfile}>
            <Ionicons name="create-outline" size={20} color="#007AFF" />
            <Text style={styles.actionButtonText}>Редактировать профиль</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
            <Text style={[styles.actionButtonText, styles.logoutButtonText]}>Выйти</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  editButton: {
    padding: 8,
  },
  scrollContent: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
  infoSection: {
    padding: 16,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  // Стиль для отображения даты рождения
  birthDateText: {
    fontSize: 16,
    color: '#444',
    fontWeight: '500',
    marginBottom: 8,
  },
  // Контейнер для возраста
  ageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ageBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  ageBadgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  skillText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  hobbyTag: {
    backgroundColor: '#34C759',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  hobbyText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  noInfoText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
  },
  actionsSection: {
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  logoutButton: {
    borderColor: '#FF3B30',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
    marginLeft: 12,
  },
  logoutButtonText: {
    color: '#FF3B30',
  },
});