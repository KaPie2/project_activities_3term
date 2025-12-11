import { useRouter } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { styles } from "../app/style_template";
import { db } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';
import BackgroundImage from './components/BackgroundImage';
import LoadingScreen from './components/LoadingScreen';

const backIcon = require('../assets/images/profile/edit_back.png');
const facultyIcon = require('../assets/images/profile/faculty_icon.png');
const genderIcon = require('../assets/images/profile/gender_icon.png');
const birthdayIcon = require('../assets/images/profile/birth_date_icon.png');
const skillsIcon = require('../assets/images/profile/skills_icon.png');
const hobbiesIcon = require('../assets/images/profile/hobbies_icon.png');
const aboutIcon = require('../assets/images/profile/about_icon.png');
const logoutIcon = require('../assets/images/profile/logout_icon.png');
const defaultAvatarIcon = require('../assets/images/profile/profile_image_icon.png');

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
    <View style={styles.profileScreenContainer}>
      <BackgroundImage/>
        {/* Header с кнопкой назад и редактированием */}
        <View style={styles.profileScreenHeader}>
            <TouchableOpacity 
                style={styles.profileScreenBackButton} 
                onPress={handleBack}
            >
                <Image 
                    source={backIcon}
                    style={styles.profileScreenBackIcon}
                    resizeMode="contain"
                />
            </TouchableOpacity>
            
            <Text style={styles.profileScreenTitle}>Профиль</Text>
        </View>

        <ScrollView 
            style={styles.profileScreenScrollContainer}
            contentContainerStyle={styles.profileScreenScrollContent}
            showsVerticalScrollIndicator={false}
        >
            {/* Аватар и основная информация */}
            <View style={styles.profileScreenAvatarSection}>
                <View style={styles.profileScreenAvatarContainer}>
                    <Image 
                        source={profile.avatar ? { uri: profile.avatar } : defaultAvatarIcon}
                        style={styles.profileScreenAvatar}
                        resizeMode="cover"
                    />
                </View>
                
                <Text style={styles.profileScreenUserName}>{profile.name}</Text>
                <Text style={styles.profileScreenUserEmail}>{profile.email}</Text>
            </View>

            {/* Информация профиля */}
            <View style={styles.profileScreenInfoSection}>
                {/* Факультет */}
                <View style={styles.profileScreenInfoCard}>
                    <View style={styles.profileScreenInfoHeader}>
                        <Image 
                            source={facultyIcon}
                            style={styles.profileScreenInfoIcon}
                            resizeMode="contain"
                        />
                        <Text style={styles.profileScreenInfoTitle}>Факультет</Text>
                    </View>
                    <Text style={styles.profileScreenInfoValue}>
                        {profile.faculty || 'Не указан'}
                    </Text>
                </View>

                {/* Пол */}
                <View style={styles.profileScreenInfoCard}>
                    <View style={styles.profileScreenInfoHeader}>
                        <Image 
                            source={genderIcon}
                            style={styles.profileScreenInfoIcon}
                            resizeMode="contain"
                        />
                        <Text style={styles.profileScreenInfoTitle}>Пол</Text>
                    </View>
                    <Text style={styles.profileScreenInfoValue}>
                        {getGenderDisplayText(profile.gender)}
                    </Text>
                </View>

                {/* Дата рождения */}
                <View style={styles.profileScreenInfoCard}>
                    <View style={styles.profileScreenInfoHeader}>
                        <Image 
                            source={birthdayIcon}
                            style={styles.profileScreenInfoIcon}
                            resizeMode="contain"
                        />
                        <Text style={styles.profileScreenInfoTitle}>Дата рождения</Text>
                    </View>
                    
                    {profile.birthDate ? (
                        <View style={styles.profileScreenBirthDateContainer}>
                            <Text style={styles.profileScreenBirthDateText}>
                                {formattedBirthDate}
                            </Text>
                            {age !== null && (
                                <View style={styles.profileScreenAgeBadge}>
                                    <Text style={styles.profileScreenAgeText}>
                                        {ageText}
                                    </Text>
                                </View>
                            )}
                        </View>
                    ) : (
                        <Text style={styles.profileScreenNoInfoText}>Не указана</Text>
                    )}
                </View>

                {/* Навыки */}
                <View style={styles.profileScreenInfoCard}>
                    <View style={styles.profileScreenInfoHeader}>
                        <Image 
                            source={skillsIcon}
                            style={styles.profileScreenInfoIcon}
                            resizeMode="contain"
                        />
                        <Text style={styles.profileScreenInfoTitle}>Навыки</Text>
                    </View>
                    
                    {profile.skills && profile.skills.length > 0 ? (
                        <View style={styles.profileScreenTagsContainer}>
                            {profile.skills.map((skill, index) => (
                                <View key={index} style={styles.profileScreenSkillTag}>
                                    <Text style={styles.profileScreenSkillText}>{skill}</Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text style={styles.profileScreenNoInfoText}>Навыки не указаны</Text>
                    )}
                </View>

                {/* Увлечения */}
                <View style={styles.profileScreenInfoCard}>
                    <View style={styles.profileScreenInfoHeader}>
                        <Image 
                            source={hobbiesIcon}
                            style={styles.profileScreenInfoIcon}
                            resizeMode="contain"
                        />
                        <Text style={styles.profileScreenInfoTitle}>Увлечения</Text>
                    </View>
                    
                    {profile.hobbies && profile.hobbies.length > 0 ? (
                        <View style={styles.profileScreenTagsContainer}>
                            {profile.hobbies.map((hobby, index) => (
                                <View key={index} style={styles.profileScreenHobbyTag}>
                                    <Text style={styles.profileScreenHobbyText}>{hobby}</Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text style={styles.profileScreenNoInfoText}>Увлечения не указаны</Text>
                    )}
                </View>

                {/* О себе */}
                <View style={styles.profileScreenInfoCard}>
                    <View style={styles.profileScreenInfoHeader}>
                        <Image 
                            source={aboutIcon}
                            style={styles.profileScreenInfoIcon}
                            resizeMode="contain"
                        />
                        <Text style={styles.profileScreenInfoTitle}>О себе</Text>
                    </View>
                    <Text style={styles.profileScreenInfoValue}>
                        {profile.bio || 'Информация о себе не указана'}
                    </Text>
                </View>
            </View>

            {/* Кнопки действий */}
            <View style={styles.profileScreenActionsSection}>
                <TouchableOpacity 
                    style={styles.profileScreenEditProfileButton}
                    onPress={handleEditProfile}
                >
                    <Text style={styles.profileScreenEditProfileText}>Редактировать профиль</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.profileScreenLogoutButton}
                    onPress={handleLogout}
                >
                    <Image 
                        source={logoutIcon}
                        style={styles.profileScreenInfoIcon}
                        resizeMode="contain"
                    />
                    <Text style={styles.profileScreenLogoutText}>Выйти</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    </View>
  )};