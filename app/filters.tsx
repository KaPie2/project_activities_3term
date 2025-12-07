// app/filters.tsx
import { useRouter } from 'expo-router';
import { collection, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';
import BackgroundImage from './components/BackgroundImage';
import GradientButton from './components/GradientButton';
import { styles } from './style_template';

// Импортируем изображения из assets
const devBlueIcon = require('../assets/images/filters/dev_blue.png');
const kubikiRedIcon = require('../assets/images/filters/kubiki_red.png');
const flagPurpleIcon = require('../assets/images/filters/flag_purple.png');
const attentionIcon = require('../assets/images/filters/attention.png');
const backIcon = require('../assets/images/filters/back.png');

type MatchCriteria = 'skills' | 'hobbies' | 'both';

interface CriteriaOption {
  id: MatchCriteria;
  title: string;
  description: string;
  icon: any;
  circleColor: string;
  iconWidth: number;
  iconHeight: number;
  cardHeight: number;
  radioBorderColor: string;
}

export default function FiltersScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedCriteria, setSelectedCriteria] = useState<MatchCriteria>('both');
  const [loading, setLoading] = useState(false);

  const criteriaOptions: CriteriaOption[] = [
    {
      id: 'skills',
      title: 'По навыкам',
      description: 'Подбирать людей с похожими профессиональными навыками',
      icon: devBlueIcon,
      circleColor: '#D3E1FF',
      iconWidth: 26,
      iconHeight: 26,
      cardHeight: 84,
      radioBorderColor: '#466382',
    },
    {
      id: 'hobbies',
      title: 'По увлечениям',
      description: 'Находить людей с общими интересами и хобби',
      icon: kubikiRedIcon,
      circleColor: '#FFDEDE',
      iconWidth: 25,
      iconHeight: 25,
      cardHeight: 84,
      radioBorderColor: '#C36062',
    },
    {
      id: 'both',
      title: 'По навыкам и увлечениям',
      description: 'Учитывать и профессиональные навыки, и общие интересы',
      icon: flagPurpleIcon,
      circleColor: '#F8D3FF',
      iconWidth: 23,
      iconHeight: 25,
      cardHeight: 103,
      radioBorderColor: '#8F5E98',
    },
  ];

  useEffect(() => {
    loadUserPreferences();
  }, [user]);

  const loadUserPreferences = async () => {
    if (!user?.email) return;

    try {
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

  return (
    <View style={{ flex: 1 }}>
      {/* Фоновое изображение */}
      <BackgroundImage />
      
      {/* Фоновые круги */}
      <View style={styles.filtersBackground}>
        <View style={[styles.ellipse, styles.ellipse1]} />
        <View style={[styles.ellipse, styles.ellipse2]} />
        <View style={[styles.ellipse, styles.ellipse3]} />
        <View style={[styles.ellipse, styles.ellipse4]} />
      </View>
      
      {/* Статус бар */}
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Верхнее окошко с заголовком и кнопкой назад */}
      <View style={styles.topHeader}>
        {/* Кнопка назад */}
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <View style={styles.backButtonCircle}>
            <Image 
              source={backIcon}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
        
        {/* Заголовок "Критерии подбора" */}
        <Text style={styles.headerTitle}>Критерии подбора</Text>
      </View>

      {/* Основной контейнер */}
      <View style={styles.filtersContainer}>
        {/* Основной контент */}
        <View style={styles.filtersContent}>
          {/* Заголовок и подзаголовок */}
          <View style={styles.filtersTitleContainer}>
            <Text style={styles.filtersMainTitle}>Как подбирать людей?</Text>
            <Text style={styles.filtersSubtitle}>
              Выберите, по каким критериям система будет предлагать вам людей для знакомства
            </Text>
          </View>

          {/* Карточки с опциями */}
          <View style={styles.filtersOptionsContainer}>
            {criteriaOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.filtersOptionCard,
                  { height: option.cardHeight },
                  selectedCriteria === option.id && styles.filtersOptionCardSelected,
                ]}
                onPress={() => setSelectedCriteria(option.id)}
                activeOpacity={0.7}
              >
                <View style={styles.filtersOptionContent}>
                  {/* Круглая иконка 43x43 по центру по вертикали */}
                  <View style={[
                    styles.filtersIconCircle,
                    { backgroundColor: option.circleColor }
                  ]}>
                    <Image 
                      source={option.icon}
                      style={{ 
                        width: option.iconWidth, 
                        height: option.iconHeight 
                      }}
                      resizeMode="contain"
                    />
                  </View>

                  {/* Текст для всех вариантов */}
                  <View style={[
                    styles.filtersOptionTextContainer,
                    option.id === 'both' && styles.thirdOptionContainer
                  ]}>
                    <Text style={[
                      styles.filtersOptionTitle,
                      option.id === 'both' && styles.thirdOptionTitle
                    ]}>
                      {option.title}
                    </Text>
                    <Text style={[
                      styles.filtersOptionDescription,
                      option.id === 'both' && styles.thirdOptionDescription
                    ]}>
                      {option.description}
                    </Text>
                  </View>

                  {/* Радио кнопка по центру по вертикали */}
                  <View style={[
                    styles.filtersOptionRadio,
                    { borderColor: option.radioBorderColor },
                    selectedCriteria === option.id && [
                      styles.filtersOptionRadioSelected,
                      { borderColor: option.radioBorderColor }
                    ]
                  ]}>
                    {selectedCriteria === option.id && (
                      <View style={[
                        styles.filtersOptionRadioDot,
                        { backgroundColor: option.radioBorderColor }
                      ]} />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Информационная карточка */}
          <View style={styles.filtersInfoCard}>
            <Image 
              source={attentionIcon}
              style={styles.filtersInfoIcon}
              resizeMode="contain"
            />
            <Text style={styles.filtersInfoText}>
              Система будет предлагать людей, у которых есть совпадения по выбранным критериям
            </Text>
          </View>
        </View>

        {/* Footer с кнопкой сохранить */}
        <View style={styles.filtersFooter}>
          <View style={styles.filtersSaveButtonContainer}>
            <GradientButton
              title="Сохранить"
              onPress={handleSavePreferences}
              loading={loading}
              disabled={loading}
            />
          </View>
        </View>
      </View>
    </View>
  );
}