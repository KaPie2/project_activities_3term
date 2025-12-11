// app/profile-setup.tsx
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { collection, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { styles } from "../app/style_template";
import { db } from "../config/firebase";
import { useAuth } from '../hooks/useAuth';
import BackgroundImage from './components/BackgroundImage';
import GradientButton from './components/GradientButton';

// Импортируем иконки
const backIcon = require('../assets/images/profile-setup/edit_back.png');
const ProfileImageIcon = require('../assets/images/profile-setup/profile_image_icon.png');
const cameraIcon = require('../assets/images/profile-setup/camera_icon.png');
const firstNameIcon = require('../assets/images/profile-setup/first_name_icon.png');
const lastNameIcon = require('../assets/images/profile-setup/last_name_icon.png');
const emailIcon = require('../assets/images/profile-setup/email_icon.png');
const facultyIcon = require('../assets/images/profile-setup/facualty_icon.png');
const smileIcon = require('../assets/images/profile-setup/birth_date_icon.png');
const aboutIcon = require('../assets/images/profile-setup/about_icon.png');
const skillsIcon = require('../assets/images/profile-setup/skills_icon.png');
const hobbiesIcon = require('../assets/images/profile-setup/hobbies_icon.png');

// Навыки для выбора
const skillsOptions = [
  'JavaScript', 'React', 'TypeScript', 'Node.js', 'Python', 
  'Java', 'C++', 'HTML/CSS', 'UI/UX Design', 'Figma',
  'Git', 'SQL', 'MongoDB', 'Firebase', 'AWS'
];

// Увлечения для выбора
const hobbiesOptions = [
  'Настольные игры', 'Чтение', 'Фотография', 'Музыка', 'Спорт',
  'Путешествия', 'Кино', 'Кулинария', 'Программирование', 'Рисование',
  'Танцы', 'Йога', 'Велоспорт', 'Походы', 'Игры'
];

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { user, login } = useAuth();
  const params = useLocalSearchParams();
  const userEmail = params.email as string;
  
  const { width, height } = Dimensions.get('window');
  
  // Динамические размеры для адаптивности
  const dynamicFontSize = {
    small: Math.max(width * 0.035, 12),
    medium: Math.max(width * 0.04, 14),
    large: Math.max(width * 0.045, 16),
    xlarge: Math.max(width * 0.05, 18),
    xxlarge: Math.max(width * 0.055, 20),
  };

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [faculty, setFaculty] = useState('');
  const [skills, setSkills] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [hobbies, setHobbies] = useState('');
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState(''); 
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (userEmail) {
      console.log('Режим СОЗДАНИЯ - из регистрации');
      setIsEditing(false);
      return;
    } 
    if (user && !user.profileCompleted) {
      console.log('Режим СОЗДАНИЯ - пользователь есть, но профиль не заполнен');
      setIsEditing(false);
      return;
    }
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
        
        // Разделяем имя и фамилию
        const fullName = profileData.name || '';
        const nameParts = fullName.split(' ');
        if (nameParts.length > 0) {
          setFirstName(nameParts[0]);
          if (nameParts.length > 1) {
            setLastName(nameParts.slice(1).join(' '));
          }
        }
        
        setFaculty(profileData.faculty || '');
        setSkills(profileData.skills ? profileData.skills.join(', ') : '');
        setSelectedSkills(profileData.skills || []);
        setHobbies(profileData.hobbies ? profileData.hobbies.join(', ') : '');
        setSelectedHobbies(profileData.hobbies || []);
        setBio(profileData.bio || '');
        setGender(profileData.gender || '');
        
        if (profileData.birthDate) {
          const date = profileData.birthDate.toDate();
          setBirthDate(date);
        }
        
        if (profileData.photoUrl) {
          setSelectedImage(profileData.photoUrl);
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
      const today = new Date();
      const minBirthDate = new Date();
      minBirthDate.setFullYear(today.getFullYear() - 16);
      
      if (selectedDate > minBirthDate) {
        Alert.alert('Ошибка', 'Вам должно быть не менее 16 лет');
        return;
      }
      
      const maxBirthDate = new Date();
      maxBirthDate.setFullYear(today.getFullYear() - 100);
      
      if (selectedDate < maxBirthDate) {
        Alert.alert('Ошибка', 'Пожалуйста, введите корректную дату рождения');
        return;
      }
      
      setBirthDate(selectedDate);
    }
  };

  const handleSkillSelect = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
    // Обновляем текстовое поле
    const newSkills = selectedSkills.includes(skill) 
      ? selectedSkills.filter(s => s !== skill)
      : [...selectedSkills, skill];
    setSkills(newSkills.join(', '));
  };

  const handleHobbySelect = (hobby: string) => {
    if (selectedHobbies.includes(hobby)) {
      setSelectedHobbies(selectedHobbies.filter(h => h !== hobby));
    } else {
      setSelectedHobbies([...selectedHobbies, hobby]);
    }
    // Обновляем текстовое поле
    const newHobbies = selectedHobbies.includes(hobby)
      ? selectedHobbies.filter(h => h !== hobby)
      : [...selectedHobbies, hobby];
    setHobbies(newHobbies.join(', '));
  };

  const handleSaveProfile = async () => {
    setLoading(true);

    if (!firstName || !lastName || !faculty || !gender || !birthDate) {
      Alert.alert("Ошибка", "Заполните все обязательные поля: имя, фамилия, факультет, пол и дата рождения");
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
          name: `${firstName} ${lastName}`.trim(),
          faculty: faculty,
          skills: skills.split(',').map(skill => skill.trim()).filter(skill => skill !== ''),
          hobbies: hobbies.split(',').map(hobby => hobby.trim()).filter(hobby => hobby !== ''),
          bio: bio,
          gender: gender,
          birthDate: birthDate,
          photoUrl: selectedImage,
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
            name: `${firstName} ${lastName}`.trim(),
            faculty: faculty,
            skills: skills.split(',').map(skill => skill.trim()).filter(skill => skill !== ''),
            hobbies: hobbies.split(',').map(hobby => hobby.trim()).filter(hobby => hobby !== ''),
            bio: bio,
            gender: gender,
            birthDate: birthDate,
            photoUrl: selectedImage,
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

  const handleBack = () => {
    if (isEditing) {
      router.back();
    } else {
      router.replace('/login');
    }
  };

  const handleImagePicker = () => {
    Alert.alert('Выбор фото', 'Функционал загрузки фото будет добавлен позже');
  };

  // Вычисляем возраст если дата рождения установлена
  const age = birthDate ? calculateAge(birthDate) : null;

  return (
    <BackgroundImage>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Хэдер с кнопкой назад и заголовком */}
      <View style={styles.profileHeader}>
        <TouchableOpacity style={styles.profileBackButton} onPress={handleBack}>
          <Image 
            source={backIcon}
            style={styles.profileBackIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        
        <View style={styles.profileTitleContainer}>
          <Text style={styles.profileTitleText}>
            Редактирование профиля
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView 
          style={styles.profileScrollContainer}
          contentContainerStyle={styles.profileScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Аватар с кнопкой загрузки фото */}
          <View style={styles.profilePhotoSection}>
            <View style={styles.profileImageContainer}>
              {selectedImage ? (
                <Image 
                  source={{ uri: selectedImage }} 
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.profileEmptyImage}>
                  <Image 
                    source={ProfileImageIcon}
                    style={styles.profileImageIcon}
                    resizeMode="contain"
                  />
                </View>
              )}
              
              <TouchableOpacity 
                style={styles.profileAddImageButton}
                onPress={handleImagePicker}
              >
                <View style={styles.profileAddImageGradient}>
                  <Image 
                    source={cameraIcon}
                    style={styles.cameraIcon}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
            </View>
            <Text style={styles.profileImageText}>Нажмите на камеру для загрузки фото</Text>
          </View>

          {/* Личная информация */}
          <View style={styles.profileSection}>
            <Text style={styles.sectionTitle}>Личная информация</Text>
            
            {/* Имя и Фамилия в одну строку */}
            <View style={styles.nameRow}>
              <View style={styles.nameInputContainer}>
                <Text style={styles.profileInputLabel}>Имя*</Text>
                <View style={styles.inputWrapperWithIcon}>
                  <Image source={firstNameIcon} style={styles.inputIcon} />
                  <TextInput
                    style={styles.profileInput}
                    placeholder="Иван"
                    placeholderTextColor="#6472BD"
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="words"
                  />
                </View>
              </View>
              
              <View style={styles.nameInputContainer}>
                <Text style={styles.profileInputLabel}>Фамилия*</Text>
                <View style={styles.inputWrapperWithIcon}>
                  <Image source={lastNameIcon} style={styles.inputIcon} />
                  <TextInput
                    style={styles.profileInput}
                    placeholder="Иванов"
                    placeholderTextColor="#6472BD"
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="words"
                  />
                </View>
              </View>
            </View>

            {/* Пол */}
            <View style={styles.inputContainer}>
              <Text style={styles.profileInputLabel}>Пол*</Text>
              <View style={styles.profileGenderContainer}>
                <TouchableOpacity 
                  style={[
                    styles.profileGenderOption,
                    gender === 'male' && styles.profileGenderOptionSelectedMale
                  ]}
                  onPress={() => setGender('male')}
                >
                  <View style={[
                    styles.radioCircleMale,
                    gender === 'male' && styles.radioCircleSelectedMale
                  ]}>
                    {gender === 'male' && <View style={styles.radioDotMale} />}
                  </View>
                  <Text style={[
                    styles.genderLabel,
                    gender === 'male' && styles.profileGenderLabelSelected
                  ]}>Мужской</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[
                    styles.profileGenderOption,
                    gender === 'female' && styles.profileGenderOptionSelectedFemale
                  ]}
                  onPress={() => setGender('female')}
                >
                  <View style={[
                    styles.radioCircleFemale,
                    gender === 'female' && styles.radioCircleSelectedFemale
                  ]}>
                    {gender === 'female' && <View style={styles.radioDotFemale} />}
                  </View>
                  <Text style={[
                    styles.genderLabel,
                    gender === 'female' && styles.profileGenderLabelSelected
                  ]}>Женский</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Дата рождения */}
            <View style={styles.inputContainer}>
              <Text style={styles.profileInputLabel}>Возраст*</Text>
              <TouchableOpacity 
                style={styles.inputWrapperWithIcon}
                onPress={() => setShowDatePicker(true)}
              >
                <Image source={smileIcon} style={styles.inputIcon} />
                <Text style={birthDate ? styles.profileInputText : styles.profileInputPlaceholder}>
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
                          textColor = '#ffffffff'
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

            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.profileInputLabel}>Email*</Text>
              <View style={styles.inputWrapperWithIcon}>
                <Image source={emailIcon} style={styles.inputIcon} />
                <TextInput
                  style={styles.profileInput}
                  placeholder="your.email@omstu.ru"
                  placeholderTextColor="#6472BD"
                  value={userEmail || user?.email || ''}
                  editable={false}
                />
              </View>
            </View>

            {/* Факультет */}
            <View style={styles.inputContainer}>
              <Text style={styles.profileInputLabel}>Факультет*</Text>
              <View style={styles.inputWrapperWithIcon}>
                <Image source={facultyIcon} style={styles.inputIcon} />
                <TextInput
                  style={styles.profileInput}
                  placeholder="ФИТиКС"
                  placeholderTextColor="#6472BD"
                  value={faculty}
                  onChangeText={setFaculty}
                />
              </View>
            </View>

            <Text style={styles.sectionTitle}>О себе</Text>
            <View style={styles.bioInputContainer}>
              <Image source={aboutIcon} style={styles.inputIcon} />
              <TextInput
                style={styles.bioInput}
                placeholder="Расскажите немного о себе, своих интересах и целях..."
                placeholderTextColor="#6472BD"
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* IT-Навыки */}
          <View style={styles.profileSection}>
            <View style={styles.profileSkillsHeader}>
              <Text style={styles.sectionTitle}>IT-Навыки</Text>
            </View>
            <Text style={styles.sectionSubtitle}>Выберите навыки которыми владеете</Text>
            
            <View style={styles.profileSkillsContainer}>
              {skillsOptions.map((skill) => (
                <TouchableOpacity
                  key={skill}
                  style={[
                    styles.profileSkillTag,
                    selectedSkills.includes(skill) && styles.profileSkillTagSelected
                  ]}
                  onPress={() => handleSkillSelect(skill)}
                >
                  <Text style={[
                    styles.profileSkillTagText,
                    selectedSkills.includes(skill) && styles.profileSkillTagTextSelected
                  ]}>
                    {skill}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.profileInputHint}>Добавьте свои навыки (через запятую)</Text>
            <View style={styles.inputWrapperWithIcon}>
              <Image source={skillsIcon} style={styles.inputIcon} />
              <TextInput
                style={styles.profileInput}
                placeholder="Например: HTML, CSS, JavaScript"
                placeholderTextColor="#6472BD"
                value={skills}
                onChangeText={setSkills}
              />
            </View>
          </View>

          {/* Увлечения */}
          <View style={styles.profileSection}>
            <View style={styles.profileSkillsHeader}>
              <Text style={styles.sectionTitle}>Увлечения</Text>
            </View>
            <Text style={styles.sectionSubtitle}>Выберите ваши интересы и хобби</Text>
            
            <View style={styles.profileSkillsContainer}>
              {hobbiesOptions.map((hobby) => (
                <TouchableOpacity
                  key={hobby}
                  style={[
                    styles.profileSkillTag,
                    selectedHobbies.includes(hobby) && styles.profileSkillTagSelected
                  ]}
                  onPress={() => handleHobbySelect(hobby)}
                >
                  <Text style={[
                    styles.profileSkillTagText,
                    selectedHobbies.includes(hobby) && styles.profileSkillTagTextSelected
                  ]}>
                    {hobby}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.profileInputHint}>Добавьте свои увлечения (через запятую)</Text>
            <View style={styles.inputWrapperWithIcon}>
              <Image source={hobbiesIcon} style={styles.inputIcon} />
              <TextInput
                style={styles.profileInput}
                placeholder="Например: Настольные игры, Чтение"
                placeholderTextColor="#6472BD"
                value={hobbies}
                onChangeText={setHobbies}
              />
            </View>
          </View>

          {/* Кнопка сохранения */}
          <View style={styles.saveButtonContainer}>
            <GradientButton
              title={loading ? "Сохранение..." : "Сохранить"}
              onPress={handleSaveProfile}
              loading={loading}
              disabled={loading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </BackgroundImage>
  );
}