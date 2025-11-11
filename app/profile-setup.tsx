import { useLocalSearchParams, useRouter } from 'expo-router';
import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { styles } from "../app/style_template";
import { db } from "../config/firebase";
import { useAuth } from '../hooks/useAuth';

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { user, login } = useAuth();
  const params = useLocalSearchParams();
  const userEmail = params.email as string;

  const [name, setName] = useState('');
  const [faculty, setFaculty] = useState('');
  const [skills, setSkills] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (userEmail) {
    console.log('Режим СОЗДАНИЯ - из регистрации');
    setIsEditing(false);
    return;
    } 
    // Если пользователь авторизован но профиль не заполнен - создание
    if (user && !user.profileCompleted) {
      console.log('Режим СОЗДАНИЯ - пользователь есть, но профиль не заполнен');
      setIsEditing(false);
      return;
    }
    // Если пользователь уже авторизован и профиль заполнен - редактирование
    else if (user && user.profileCompleted) {
      console.log('Режим РЕДАКТИРОВАНИЯ - профиль заполнен');
      loadUserProfile();
      setIsEditing(true);
      return;
    }
  }, [user, userEmail]);

  const loadUserProfile = async () => {
    if (!user?.email) return;

    try {
      // Загружаем данные из коллекции profile (откуда будем сохранять)
      const profilesQuery = query(collection(db, "profile"), where("email", "==", user.email));
      const profilesSnapshot = await getDocs(profilesQuery);
      
      if (!profilesSnapshot.empty) {
        const profileData = profilesSnapshot.docs[0].data();
        setName(profileData.name || '');
        setFaculty(profileData.faculty || '');
        setSkills(profileData.skills ? profileData.skills.join(', ') : '');
        setBio(profileData.bio || '');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);

    if (!name || !faculty) {
      Alert.alert("Ошибка", "Заполните обязательные поля: имя и факультет");
      setLoading(false);
      return;
    }

    try {
      // РЕЖИМ РЕДАКТИРОВАНИЯ - пользователь уже существует
      if (isEditing && user?.email) {
        // 1. Находим профиль пользователя по email
        const profilesQuery = query(collection(db, "profile"), where("email", "==", user.email));
        const profilesSnapshot = await getDocs(profilesQuery);
        
        if (profilesSnapshot.empty) {
          Alert.alert("Ошибка", "Профиль не найден");
          return;
        }

        const profileDoc = profilesSnapshot.docs[0];
      
        // 2. Обновляем данные в коллекции profile
        await updateDoc(profileDoc.ref, {
          name: name,
          faculty: faculty,
          skills: skills.split(',').map(skill => skill.trim()).filter(skill => skill !== ''),
          bio: bio,
          updatedAt: new Date().toISOString(),
        });

        // 3. Обновляем сессию
        await login({
          id: user.id,
          email: user.email,
          profileCompleted: true
        });

        Alert.alert("Успех!", "Профиль успешно обновлен");
        router.replace('/profile'); // Возвращаем в профиль
      } 
      // РЕЖИМ СОЗДАНИЯ - новый пользователь из регистрации
      else if (!isEditing) {
        // 1. Находим пользователя по email
        const usersQuery = query(collection(db, "users"), where("email", "==", userEmail));
        const usersSnapshot = await getDocs(usersQuery);
            
        if (usersSnapshot.empty) {
            Alert.alert("Ошибка", "Пользователь не найден");
            return;
        }

        const userDoc = usersSnapshot.docs[0];
        
        // 2. Находим профиль по email
        const profilesQuery = query(collection(db, "profile"), where("email", "==", userEmail));
        const profilesSnapshot = await getDocs(profilesQuery);
        const profileDoc = profilesSnapshot.docs[0];

        // 3. Обновляем профиль
        await updateDoc(profileDoc.ref, {
            name: name,
            faculty: faculty,
            skills: skills.split(',').map(skill => skill.trim()).filter(skill => skill !== ''),
            bio: bio,
            updatedAt: new Date().toISOString(),
        });

        // 4. Обновляем пользователя - устанавливаем profileCompleted: true
        await updateDoc(userDoc.ref, {
            profileCompleted: true, // ← меняем на TRUE
            updatedAt: new Date().toISOString(),
        });

        // 5. Обновляем сессию
        await login({
            id: userDoc.id,
            email: userEmail,
            profileCompleted: true // ← И в сессии тоже
        });

        Alert.alert("Успех!", "Профиль успешно сохранен");
        router.replace('/swipe');
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Ошибка", "Не удалось сохранить профиль");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (isEditing) {
      router.back(); // Возврат в профиль
    } else {
      router.replace('/login'); // Если отмена при создании профиля
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>
          {isEditing ? 'Редактировать профиль' : 'Заполните ваш профиль'}
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Имя *</Text>
          <TextInput
            style={styles.input}
            placeholder="Введите ваше имя"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Факультет *</Text>
          <TextInput
            style={styles.input}
            placeholder="Введите ваш факультет"
            value={faculty}
            onChangeText={setFaculty}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Навыки</Text>
          <TextInput
            style={styles.input}
            placeholder="JavaScript, React, Figma, Python..."
            value={skills}
            onChangeText={setSkills}
          />
          <Text style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
            Перечислите навыки через запятую
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>О себе</Text>
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            placeholder="Расскажите о себе, каких партнеров ищете..."
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleSaveProfile} 
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Сохранение..." : (isEditing ? "Обновить профиль" : "Сохранить профиль")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#666', marginTop: 10 }]} 
          onPress={handleCancel}
        >
          <Text style={styles.buttonText}>Отмена</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}