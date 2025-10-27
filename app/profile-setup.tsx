import { addDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { styles } from "../app/style_template";
import { db } from "../config/firebase";


export default function ProfileSetupScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const params = useLocalSearchParams();
  const userEmail = params.email as string;

  const [name, setName] = useState('');
  const [faculty, setFaculty] = useState('');
  const [skills, setSkills] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSaveProfile = async () => {
    setLoading(true);

    if (!name || !faculty) {
      Alert.alert("Ошибка", "Заполните обязательные поля: имя и факультет");
      setLoading(false);
      return;
    }

    try {
      // ⬇️⬇️⬇️ ВРЕМЕННОЕ РЕШЕНИЕ ⬇️⬇️⬇️
        // Создаем нового пользователя (как было раньше)
        const docRef = await addDoc(collection(db, 'users'), {
            name: name,
            email: "temp@example.com", // временный email
            faculty: faculty,
            skills: skills.split(',').map(skill => skill.trim()).filter(skill => skill !== ''),
            bio: bio,
            profileCompleted: true,
            createdAt: new Date().toISOString(),
        });

        // Сохраняем в сессию
        await login({
            id: docRef.id,
            email: "temp@example.com",
            name: name,
            profileCompleted: true
        });

        Alert.alert("Успех!", "Профиль успешно сохранен");
        router.replace('/(tabs)');

      // // 1. Находим пользователя по email
      // const q = query(collection(db, "users"), where("email", "==", userEmail));
      // const querySnapshot = await getDocs(q);
          
      // if (querySnapshot.empty) {
      //   Alert.alert("Ошибка", "Пользователь не найден");
      //   return;
      // }

      // const userDoc = querySnapshot.docs[0];
          
      // // 2. ОБНОВЛЯЕМ существующего пользователя
      // await updateDoc(userDoc.ref, {
      //   name: name,
      //   faculty: faculty,
      //   skills: skills.split(',').map(skill => skill.trim()).filter(skill => skill !== ''),
      //   bio: bio,
      //   profileCompleted: true, // ← ВАЖНО!
      //   updatedAt: new Date().toISOString(),
      // });

      // // 3. ОБНОВЛЯЕМ СЕССИЮ!
      // await login({
      //   id: userDoc.id,
      //   email: userEmail,
      //   name: name,
      //   profileCompleted: true // ← теперь true
      // });

      // Alert.alert("Успех!", "Профиль успешно сохранен");
    
      // // Переходим на главный экран
      // router.replace('/(tabs)');
    
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Ошибка", "Не удалось сохранить профиль");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Заполните ваш профиль</Text>

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
          {loading ? "Сохранение..." : "Сохранить профиль"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
