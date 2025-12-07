import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { collection, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
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
  const [hobbies, setHobbies] = useState('');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState(''); 
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

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
      const profilesQuery = query(collection(db, "profile"), where("email", "==", user.email));
      const profilesSnapshot = await getDocs(profilesQuery);
      
      if (!profilesSnapshot.empty) {
        const profileData = profilesSnapshot.docs[0].data();
        setName(profileData.name || '');
        setFaculty(profileData.faculty || '');
        setSkills(profileData.skills ? profileData.skills.join(', ') : '');
        setHobbies(profileData.hobbies ? profileData.hobbies.join(', ') : '');
        setBio(profileData.bio || '');
        setGender(profileData.gender || '');
        
        // Загружаем дату рождения если есть
        if (profileData.birthDate) {
          const date = profileData.birthDate.toDate();
          setBirthDate(date);
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const formatDateToDDMMYYYY = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (selectedDate) {
      // Проверяем что возраст не меньше 16 лет
      const today = new Date();
      const minBirthDate = new Date();
      minBirthDate.setFullYear(today.getFullYear() - 16);
      
      if (selectedDate > minBirthDate) {
        Alert.alert('Ошибка', 'Вам должно быть не менее 16 лет');
        return;
      }
      
      // Проверяем что возраст не больше 100 лет
      const maxBirthDate = new Date();
      maxBirthDate.setFullYear(today.getFullYear() - 100);
      
      if (selectedDate < maxBirthDate) {
        Alert.alert('Ошибка', 'Пожалуйста, введите корректную дату рождения');
        return;
      }
      
      setBirthDate(selectedDate);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);

    if (!name || !faculty || !gender || !birthDate) {
      Alert.alert("Ошибка", "Заполните все обязательные поля: имя, факультет, пол и дату рождения");
      setLoading(false);
      return;
    }

    try {
      // РЕЖИМ РЕДАКТИРОВАНИЯ - пользователь уже существует
      if (isEditing && user?.email) {
        const profilesQuery = query(collection(db, "profile"), where("email", "==", user.email));
        const profilesSnapshot = await getDocs(profilesQuery);
        
        if (profilesSnapshot.empty) {
          Alert.alert("Ошибка", "Профиль не найден");
          return;
        }

        const profileDoc = profilesSnapshot.docs[0];
      
        await updateDoc(profileDoc.ref, {
          name: name,
          faculty: faculty,
          skills: skills.split(',').map(skill => skill.trim()).filter(skill => skill !== ''),
          hobbies: hobbies.split(',').map(hobby => hobby.trim()).filter(hobby => hobby !== ''),
          bio: bio,
          gender: gender,
          birthDate: birthDate, // 🟢 Сохраняем дату рождения
          updatedAt: new Date().toISOString(),
        });

        await login({
          id: user.id,
          email: user.email,
          profileCompleted: true
        });

        Alert.alert("Успех!", "Профиль успешно обновлен");
        router.replace('/profile');
      } 
      // РЕЖИМ СОЗДАНИЯ - новый пользователь из регистрации
      else if (!isEditing) {
        const usersQuery = query(collection(db, "users"), where("email", "==", userEmail));
        const usersSnapshot = await getDocs(usersQuery);
            
        if (usersSnapshot.empty) {
            Alert.alert("Ошибка", "Пользователь не найден");
            return;
        }

        const userDoc = usersSnapshot.docs[0];
        
        const profilesQuery = query(collection(db, "profile"), where("email", "==", userEmail));
        const profilesSnapshot = await getDocs(profilesQuery);
        const profileDoc = profilesSnapshot.docs[0];

        await updateDoc(profileDoc.ref, {
            name: name,
            faculty: faculty,
            skills: skills.split(',').map(skill => skill.trim()).filter(skill => skill !== ''),
            hobbies: hobbies.split(',').map(hobby => hobby.trim()).filter(hobby => hobby !== ''),
            bio: bio,
            gender: gender,
            birthDate: birthDate, // 🟢 Сохраняем дату рождения
            updatedAt: new Date().toISOString(),
        });

        await updateDoc(userDoc.ref, {
            profileCompleted: true,
            updatedAt: new Date().toISOString(),
        });

        await login({
            id: userDoc.id,
            email: userEmail,
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
      router.back();
    } else {
      router.replace('/login');
    }
  };

  // Вычисляем возраст если дата рождения установлена
  const age = birthDate ? calculateAge(birthDate) : null;

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
          <Text style={styles.label}>Дата рождения *</Text>
          <TouchableOpacity 
            style={[styles.input, { justifyContent: 'center' }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={birthDate ? styles.inputText : styles.placeholderText}>
              {birthDate ? formatDateToDDMMYYYY(birthDate) : 'дд.мм.гггг'}
            </Text>
            {age !== null && (
              <Text style={styles.ageText}>
                {age} {age === 1 ? 'год' : age < 5 ? 'года' : 'лет'}
              </Text>
            )}
          </TouchableOpacity>
          
          {showDatePicker && (
            <Modal
              transparent={true}
              animationType="slide"
              visible={showDatePicker}
              onRequestClose={() => setShowDatePicker(false)}
            >
              <TouchableWithoutFeedback onPress={() => setShowDatePicker(false)}>
                <View style={styles.modalOverlay}>
                  <View style={styles.datePickerContainer}>
                    <DateTimePicker
                      value={birthDate || new Date(2000, 0, 1)}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={handleDateChange}
                      maximumDate={new Date()}
                      minimumDate={new Date(1920, 0, 1)}
                    />
                    
                    {Platform.OS === 'ios' && (
                      <View style={styles.iosButtons}>
                        <TouchableOpacity 
                          style={styles.iosButton} 
                          onPress={() => setShowDatePicker(false)}
                        >
                          <Text style={styles.iosButtonText}>Готово</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Пол *</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity 
              style={styles.genderOption}
              onPress={() => setGender('male')}
            >
              <View style={styles.radioCircle}>
                {gender === 'male' && <View style={styles.radioSelected} />}
              </View>
              <Text style={styles.genderLabel}>Мужской</Text>
            </TouchableOpacity>
    
            <TouchableOpacity 
              style={styles.genderOption}
              onPress={() => setGender('female')}
            >
              <View style={styles.radioCircle}>
                {gender === 'female' && <View style={styles.radioSelected} />}
              </View>
              <Text style={styles.genderLabel}>Женский</Text>
            </TouchableOpacity>
          </View>
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
          <Text style={styles.label}>Увлечения</Text>
          <TextInput
            style={styles.input}
            placeholder="Фотография, музыка, спорт, путешествия..."
            value={hobbies}
            onChangeText={setHobbies}
          />
          <Text style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
            Перечислите увлечения через запятую
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>О себе</Text>
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            placeholder="Расскажите немного о себе, своих интересах и целях..."
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