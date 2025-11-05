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
    // Если пользователь уже авторизован, загружаем его данные для редактирования
    if (user && user.profileCompleted) {
      loadUserProfile();
      setIsEditing(true);
    } else if (userEmail) {
      // Если перешли из регистрации с email
      setIsEditing(false);
    }
  }, [user, userEmail]);

  const loadUserProfile = async () => {
    if (!user?.id) return;

    try {
      const userDoc = await getDoc(doc(db, 'users', user.id));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setName(userData.name || '');
        setFaculty(userData.faculty || '');
        setSkills(userData.skills ? userData.skills.join(', ') : '');
        setBio(userData.bio || '');
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
      if (isEditing && user?.id) {
        const userRef = doc(db, 'users', user.id);
        
        await updateDoc(userRef, {
          name: name,
          faculty: faculty,
          skills: skills.split(',').map(skill => skill.trim()).filter(skill => skill !== ''),
          bio: bio,
          profileCompleted: true,
          updatedAt: new Date().toISOString(),
        });

        // Обновляем сессию
        await login({
          id: user.id,
          email: user.email,
          name: name,
          profileCompleted: true
        });

        Alert.alert("Успех!", "Профиль успешно обновлен");
        router.replace('/profile'); // Возвращаем в профиль

      } 
      // РЕЖИМ СОЗДАНИЯ - новый пользователь из регистрации
      else if (userEmail) {
        // 1. Находим пользователя по email
        const q = query(collection(db, "users"), where("email", "==", userEmail));
        const querySnapshot = await getDocs(q);
            
        if (querySnapshot.empty) {
          Alert.alert("Ошибка", "Пользователь не найден");
          return;
        }

        const userDoc = querySnapshot.docs[0];
            
        // 2. ОБНОВЛЯЕМ существующего пользователя
        await updateDoc(userDoc.ref, {
          name: name,
          faculty: faculty,
          skills: skills.split(',').map(skill => skill.trim()).filter(skill => skill !== ''),
          bio: bio,
          profileCompleted: true,
          updatedAt: new Date().toISOString(),
        });

        // 3. ОБНОВЛЯЕМ СЕССИЮ!
        await login({
          id: userDoc.id,
          email: userEmail,
          name: name,
          profileCompleted: true
        });

        Alert.alert("Успех!", "Профиль успешно сохранен");
        router.replace('/swipe');
      }
      // РЕЗЕРВНЫЙ ВАРИАНТ (временный код)
      else {
        const docRef = await addDoc(collection(db, 'users'), {
          name: name,
          email: "temp@example.com",
          faculty: faculty,
          skills: skills.split(',').map(skill => skill.trim()).filter(skill => skill !== ''),
          bio: bio,
          profileCompleted: true,
          createdAt: new Date().toISOString(),
        });

        await login({
          id: docRef.id,
          email: "temp@example.com",
          name: name,
          profileCompleted: true
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