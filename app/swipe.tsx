import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { addDoc, arrayUnion, collection, getDocs, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';

import { useFocusEffect } from '@react-navigation/native';
import { Alert, Animated, Dimensions, Image, PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';

const defaultAvatar = require('../assets/images/icon.png');

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

interface Profile {
  id: string;
  name: string;
  email: string;
  faculty: string;
  skills: string[];
  hobbies: string[];
  bio: string;
  avatar?: string;
}

interface Chat {
  id: string;
  participants: string[];
  lastMessage?: string;
  createdAt: Date;
}

type MatchCriteria = 'skills' | 'hobbies' | 'both';

export default function SwipeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [matchCriteria, setMatchCriteria] = useState<MatchCriteria>('both');
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentUserProfile, setCurrentUserProfile] = useState<Profile | null>(null);
  const [showingMatchedProfiles, setShowingMatchedProfiles] = useState(true); // 👈 Новое состояние
  
  const swipe = useRef(new Animated.ValueXY()).current;
  const position = useRef(new Animated.ValueXY()).current;

  useFocusEffect(
    React.useCallback(() => {
      loadUserPreferences();
      // Принудительно обновляем данные
      setRefreshKey(prev => prev + 1);
      setCurrentIndex(0); // 👈 Сбрасываем индекс
      setShowingMatchedProfiles(true); // 👈 Сбрасываем показ профилей
    }, [user])
  );
  
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
          setMatchCriteria(profileData.matchCriteria);
        }
        
        // 👇 Сохраняем профиль текущего пользователя
        setCurrentUserProfile({
          id: profilesSnapshot.docs[0].id,
          name: profileData.name || '',
          email: profileData.email,
          faculty: profileData.faculty || '',
          skills: profileData.skills || [],
          hobbies: profileData.hobbies || [],
          bio: profileData.bio || '',
          avatar: profileData.avatar
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, [user, matchCriteria, refreshKey, currentUserProfile, showingMatchedProfiles]); // 👈 Добавил showingMatchedProfiles

  const loadProfiles = async () => {
    if (!user?.email || !currentUserProfile) return;

    try {
      // Получаем текущий профиль чтобы узнать лайки/дизлайки и данные для подбора
      const currentProfileQuery = query(
        collection(db, "profile"), 
        where("email", "==", user.email)
      );
      const currentProfileSnapshot = await getDocs(currentProfileQuery);
      
      let userLikes: string[] = [];
      let userDislikes: string[] = [];
      let userSkills: string[] = [];
      let userHobbies: string[] = [];
      
      if (!currentProfileSnapshot.empty) {
        const currentProfileData = currentProfileSnapshot.docs[0].data();
        userLikes = currentProfileData.likes || [];
        userDislikes = currentProfileData.dislikes || [];
        userSkills = currentProfileData.skills || [];
        userHobbies = currentProfileData.hobbies || [];
      }

      const excludedEmails = [...userLikes, ...userDislikes, user.email];

      // Получаем ВСЕ профили кроме текущего пользователя
      const profilesQuery = query(
        collection(db, "profile"), 
        where("email", "!=", user.email)
      );
      const profilesSnapshot = await getDocs(profilesQuery);
      
      const matchedProfiles: Profile[] = []; // 👈 Профили подходящие под критерии
      const otherProfiles: Profile[] = [];    // 👈 Остальные профили
      
      profilesSnapshot.docs.forEach(doc => {
        const profileData = doc.data();
        
        // Пропускаем если уже лайкали или дизлайкали
        if (excludedEmails.includes(profileData.email)) {
          return;
        }

        // Проверяем совпадение по критериям
        const hasMatchingSkills = profileData.skills && currentUserProfile.skills.some(skill => 
          profileData.skills.includes(skill)
        );
        
        const hasMatchingHobbies = profileData.hobbies && currentUserProfile.hobbies.some(hobby => 
          profileData.hobbies.includes(hobby)
        );

        let shouldInclude = false;
        
        switch (matchCriteria) {
          case 'skills':
            shouldInclude = hasMatchingSkills;
            break;
          case 'hobbies':
            shouldInclude = hasMatchingHobbies;
            break;
          case 'both':
            shouldInclude = hasMatchingSkills || hasMatchingHobbies;
            break;
        }

        // Проверяем обязательные поля
        if (profileData.name && profileData.faculty) {
          const skills = Array.isArray(profileData.skills) ? profileData.skills : [];
          const hobbies = Array.isArray(profileData.hobbies) ? profileData.hobbies : [];
          
          const profile = {
            id: doc.id,
            name: profileData.name,
            email: profileData.email,
            faculty: profileData.faculty,
            skills: skills,
            hobbies: hobbies,
            bio: profileData.bio || '',
            avatar: profileData.avatar
          };

          // 👇 Определяем, соответствует ли профиль критериям
          const matchesCriteria = (profile: Profile): boolean => {
            const hasMatchingSkills = profile.skills && currentUserProfile.skills.some(skill => 
              profile.skills.includes(skill)
            );
            
            const hasMatchingHobbies = profile.hobbies && currentUserProfile.hobbies.some(hobby => 
              profile.hobbies.includes(hobby)
            );

            switch (matchCriteria) {
              case 'skills':
                return hasMatchingSkills;
              case 'hobbies':
                return hasMatchingHobbies;
              case 'both':
                return hasMatchingSkills || hasMatchingHobbies;
              default:
                return false;
            }
          };

          if (matchesCriteria(profile)) {
            matchedProfiles.push(profile);
          } else {
            otherProfiles.push(profile);
          }
        }
      });

      console.log(`📊 Статистика загрузки: 
        Подходящих профилей: ${matchedProfiles.length}
        Остальных профилей: ${otherProfiles.length}
        Показываем: ${showingMatchedProfiles ? 'подходящие' : 'все'}`);

      // 👇 КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: 
      // Если показываем подходящие профили и они есть - показываем их
      // Если показываем подходящие профили, но их нет - переключаемся на остальные
      // Если показываем все профили - показываем все
      let finalProfiles: Profile[] = [];
      
      if (showingMatchedProfiles && matchedProfiles.length > 0) {
        finalProfiles = matchedProfiles;
      } else if (showingMatchedProfiles && matchedProfiles.length === 0) {
        // Если подходящих профилей нет, автоматически переключаемся на все профили
        finalProfiles = otherProfiles;
        setShowingMatchedProfiles(false);
      } else {
        // Показываем все профили
        finalProfiles = [...matchedProfiles, ...otherProfiles];
      }

      // 👇 ВАЖНО: Сбрасываем currentIndex при загрузке новых профилей
      setCurrentIndex(0);
      setProfiles(finalProfiles);
      
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  // 👇 ДОБАВЛЕНО: Функция для автоматической загрузки остальных профилей
  useEffect(() => {
    // Если мы просмотрели все подходящие профили, автоматически переключаемся на остальные
    if (showingMatchedProfiles && currentIndex >= profiles.length && profiles.length > 0) {
      console.log('Переключение на остальные профили');
      setShowingMatchedProfiles(false);
      setRefreshKey(prev => prev + 1); // 👈 Перезагружаем профили
    }
  }, [currentIndex, profiles.length, showingMatchedProfiles]);

  const getDisplayData = (profile: Profile) => {
    switch (matchCriteria) {
      case 'skills':
        return {
          showSkills: true,
          showHobbies: false,
          title: 'Навыки:',
          data: profile.skills,
          emptyText: 'Навыки не указаны',
          tagStyle: styles.skillTag,
          textStyle: styles.skillText
        };
      case 'hobbies':
        return {
          showSkills: false,
          showHobbies: true,
          title: 'Увлечения:',
          data: profile.hobbies,
          emptyText: 'Увлечения не указаны',
          tagStyle: styles.hobbyTag,
          textStyle: styles.hobbyText
        };
      case 'both':
        return {
          showSkills: true,
          showHobbies: true,
          title: '',
          data: [],
          emptyText: '',
          tagStyle: styles.skillTag,
          textStyle: styles.skillText
        };
      default:
        return {
          showSkills: true,
          showHobbies: true,
          title: '',
          data: [],
          emptyText: '',
          tagStyle: styles.skillTag,
          textStyle: styles.skillText
        };
    }
  };

  // Функция для определения, подходит ли профиль под критерии
  const isProfileMatching = (profile: Profile): boolean => {
    if (!currentUserProfile) return false;
    
    const hasMatchingSkills = profile.skills && currentUserProfile.skills.some(skill => 
      profile.skills.includes(skill)
    );
    
    const hasMatchingHobbies = profile.hobbies && currentUserProfile.hobbies.some(hobby => 
      profile.hobbies.includes(hobby)
    );

    switch (matchCriteria) {
      case 'skills':
        return hasMatchingSkills;
      case 'hobbies':
        return hasMatchingHobbies;
      case 'both':
        return hasMatchingSkills || hasMatchingHobbies;
      default:
        return false;
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => {
      // Свайп возможен ТОЛЬКО если есть активный профиль
      const hasActiveProfile = currentIndex < profiles.length && profiles.length > 0;
      return hasActiveProfile;
    },
    onMoveShouldSetPanResponder: () => {
      const hasActiveProfile = currentIndex < profiles.length && profiles.length > 0;
      return hasActiveProfile;
    },
    onPanResponderMove: (_, gesture) => {
      if (currentIndex < profiles.length) {
        swipe.setValue({ x: gesture.dx, y: gesture.dy });
      }
    },
    onPanResponderRelease: (_, gesture) => {
      // Если нет активного профиля - игнорируем
      if (currentIndex >= profiles.length) {
        resetPosition();
        return;
      }
      
      if (gesture.dx > SWIPE_THRESHOLD) {
        forceSwipe('right');
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        forceSwipe('left');
      } else {
        resetPosition();
      }
    }
  });

  const forceSwipe = (direction: 'right' | 'left') => {
    // Двойная проверка
    if (currentIndex >= profiles.length || profiles.length === 0) {
      resetPosition();
      return;
    }
    
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
    
    Animated.timing(swipe, {
      toValue: { x, y: 0 },
      duration: 250,
      useNativeDriver: true
    }).start(() => {
      onSwipeComplete(direction);
    });
  };

  const onSwipeComplete = async (direction: 'right' | 'left') => {
    
    // Финальная проверка
    if (profiles.length === 0 || currentIndex >= profiles.length) {
      resetPosition();
      return;
    }

    const item = profiles[currentIndex];
    
    // Выполняем лайк/дизлайк
    if (direction === 'right') {
      await handleLike(item);
    } else {
      await handleDislike(item);
    }

    // Сбрасываем анимацию
    swipe.setValue({ x: 0, y: 0 });
    
    // Определяем следующий шаг
    const isLastProfile = currentIndex === profiles.length - 1;
    
    if (isLastProfile) {
      
      // Немедленно увеличиваем индекс, чтобы скрыть карточку
      setCurrentIndex(currentIndex + 1);
      
      // Небольшая задержка для плавности
      setTimeout(() => {
        if (showingMatchedProfiles) {
          setShowingMatchedProfiles(false);
          setRefreshKey(prev => prev + 1); // Вызовет loadProfiles()
        } else {
          console.log('Все профили просмотрены');
          // Остаемся в состоянии "профили закончились"
        }
      }, 100);
    } else {
      // Просто переходим к следующему профилю
      setCurrentIndex(prev => prev + 1);
    }
  };

  const resetPosition = () => {
    Animated.spring(swipe, {
      toValue: { x: 0, y: 0 },
      friction: 5,
      useNativeDriver: true
    }).start();
  };

  const createChat = async (otherUserEmail: string): Promise<string | null> => {
    if (!user?.email) return null;

    try {
      const chatsQuery = query(
        collection(db, "chats"),
        where("participants", "array-contains", user.email)
      );
      const chatsSnapshot = await getDocs(chatsQuery);
      
      const existingChat = chatsSnapshot.docs.find(doc => 
        doc.data().participants.includes(otherUserEmail)
      );

      if (existingChat) {
        return existingChat.id;
      }

      const chatRef = await addDoc(collection(db, "chats"), {
        participants: [user.email, otherUserEmail],
        createdAt: new Date(),
        lastMessage: "Чат создан",
        lastMessageTime: new Date()
      });

      return chatRef.id;
    } catch (error) {
      console.error('Error creating chat:', error);
      return null;
    }
  };

  const checkForMatch = async (likedUserEmail: string): Promise<boolean> => {
    if (!user?.email) return false;

    try {
      const likedUserQuery = query(
        collection(db, "profile"), 
        where("email", "==", likedUserEmail)
      );
      const likedUserSnapshot = await getDocs(likedUserQuery);
      
      if (!likedUserSnapshot.empty) {
        const likedUserData = likedUserSnapshot.docs[0].data();
        const theirLikes = likedUserData.likes || [];
        
        return theirLikes.includes(user.email);
      }
      
      return false;
    } catch (error) {
      console.error('Error checking for match:', error);
      return false;
    }
  };

  const handleLike = async (profile: Profile) => {
    if (!user?.email) return;

    try {
      const currentProfileQuery = query(
        collection(db, "profile"), 
        where("email", "==", user.email)
      );
      const currentProfileSnapshot = await getDocs(currentProfileQuery);
      
      if (!currentProfileSnapshot.empty) {
        const currentProfileDoc = currentProfileSnapshot.docs[0];
        
        await updateDoc(currentProfileDoc.ref, {
          likes: arrayUnion(profile.email),
          updatedAt: new Date()
        });

        console.log('Liked:', profile.name);

        const isMatch = await checkForMatch(profile.email);
        
        if (isMatch) {
          const chatId = await createChat(profile.email);
          
          if (chatId) {
            setTimeout(() => {
              Alert.alert(
                "Мэтч! 🎉",
                `Вы понравились ${profile.name}! Начните общение`,
                [
                  { text: "Позже", style: "cancel" },
                  { 
                    text: "Перейти в чат", 
                    onPress: () => router.push('/chats')
                  }
                ]
              );
            }, 500);
          }
        }
      }
    } catch (error) {
      console.error('Error liking profile:', error);
    }
  };

  const handleDislike = async (profile: Profile) => {
    if (!user?.email) return;

    try {
      const currentProfileQuery = query(
        collection(db, "profile"), 
        where("email", "==", user.email)
      );
      const currentProfileSnapshot = await getDocs(currentProfileQuery);
      
      if (!currentProfileSnapshot.empty) {
        const currentProfileDoc = currentProfileSnapshot.docs[0];
        
        await updateDoc(currentProfileDoc.ref, {
          dislikes: arrayUnion(profile.email),
          updatedAt: new Date()
        });

        console.log('Disliked:', profile.name);
      }
    } catch (error) {
      console.error('Error disliking profile:', error);
    }
  };

  const handleManualLike = () => {
    forceSwipe('right');
  };

  const handleManualDislike = () => {
    forceSwipe('left');
  };

  const getCardStyle = () => {
    const rotate = swipe.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-120deg', '0deg', '120deg'],
      extrapolate: 'clamp'
    });

    return {
      transform: [
        { translateX: swipe.x },
        { translateY: swipe.y },
        { rotate }
      ]
    };
  };

  const getCardStackStyle = (index: number) => {
    const offset = (index - currentIndex) * 10;
    const scale = 1 - (index - currentIndex) * 0.05;
    const opacity = index === currentIndex ? 1 : 0.95 - (index - currentIndex) * 0.1;

    return {
      transform: [
        { translateY: offset },
        { scale: scale }
      ],
      opacity: opacity,
      zIndex: profiles.length - index,
    };
  };

  const renderCard = (profile: Profile, index: number) => {
    if (index < 0 || index >= profiles.length) {
      return null;
    }

    if (index < currentIndex) return null;

    const isTopCard = index === currentIndex;
    
    const displayData = getDisplayData(profile);
    const skills = Array.isArray(profile.skills) ? profile.skills : [];
    const hobbies = Array.isArray(profile.hobbies) ? profile.hobbies : [];
    
    const displaySkills = skills.slice(0, 4);
    const remainingSkills = skills.length > 4 ? skills.length - 4 : 0;
    const displayHobbies = hobbies.slice(0, 4);
    const remainingHobbies = hobbies.length > 4 ? hobbies.length - 4 : 0;

    const cardStyle = isTopCard ? getCardStyle() : {};
    const stackStyle = getCardStackStyle(index);

    // Проверяем, подходит ли профиль под критерии
    const isMatching = isProfileMatching(profile);

    return (
      <Animated.View
        key={profile.id}
        style={[
          styles.card, 
          stackStyle,
          cardStyle
        ]}
        {...(isTopCard ? panResponder.panHandlers : {})}
      >
        {/* Аватар */}
        <View style={styles.cardHeader}>
          <View style={styles.avatar}>
            <Image 
              source={profile.avatar ? { uri: profile.avatar } : defaultAvatar} 
              style={styles.avatarImage}
              defaultSource={defaultAvatar}
            />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardName}>{profile.name}</Text>
            <Text style={styles.cardFaculty}>{profile.faculty}</Text>
            
            {/* 👇 Показываем разную информацию в зависимости от совпадения */}
            {isMatching ? (
              <Text style={styles.criteriaIndicator}>
                {matchCriteria === 'skills' && '🎯 Подобрано по навыкам'}
                {matchCriteria === 'hobbies' && '❤️ Подобрано по увлечениям'}
                {matchCriteria === 'both' && '🌟 Подобрано по навыкам и увлечениям'}
              </Text>
            ) : (
              <Text style={styles.nonMatchingIndicator}>
                ⚠️ Не подходит под ваши критерии
              </Text>
            )}
          </View>
        </View>

        {/* Динамическое отображение данных в зависимости от критериев */}
        {matchCriteria === 'both' ? (
          <>
            {/* Отображаем и навыки, и увлечения */}
            {skills.length > 0 && (
              <View style={styles.skillsSection}>
                <Text style={styles.skillsTitle}>Навыки:</Text>
                <View style={styles.skillsContainer}>
                  {displaySkills.map((skill, skillIndex) => (
                    <View key={skillIndex} style={styles.skillTag}>
                      <Text style={styles.skillText}>{skill}</Text>
                    </View>
                  ))}
                  {remainingSkills > 0 && (
                    <View style={styles.moreSkillsTag}>
                      <Text style={styles.moreSkillsText}>+{remainingSkills}</Text>
                    </View>
                  )}
                </View>
              </View>
            )}
            
            {hobbies.length > 0 && (
              <View style={styles.skillsSection}>
                <Text style={styles.skillsTitle}>Увлечения:</Text>
                <View style={styles.skillsContainer}>
                  {displayHobbies.map((hobby, hobbyIndex) => (
                    <View key={hobbyIndex} style={styles.hobbyTag}>
                      <Text style={styles.hobbyText}>{hobby}</Text>
                    </View>
                  ))}
                  {remainingHobbies > 0 && (
                    <View style={styles.moreSkillsTag}>
                      <Text style={styles.moreSkillsText}>+{remainingHobbies}</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {skills.length === 0 && hobbies.length === 0 && (
              <Text style={styles.noSkillsText}>Навыки и увлечения не указаны</Text>
            )}
          </>
        ) : (
          /* Отображаем только выбранный тип данных */
          <>
            {displayData.data.length > 0 ? (
              <View style={styles.skillsSection}>
                <Text style={styles.skillsTitle}>{displayData.title}</Text>
                <View style={styles.skillsContainer}>
                  {displayData.data.slice(0, 4).map((item, itemIndex) => (
                    <View key={itemIndex} style={displayData.tagStyle}>
                      <Text style={displayData.textStyle}>{item}</Text>
                    </View>
                  ))}
                  {displayData.data.length > 4 && (
                    <View style={styles.moreSkillsTag}>
                      <Text style={styles.moreSkillsText}>+{displayData.data.length - 4}</Text>
                    </View>
                  )}
                </View>
              </View>
            ) : (
              <Text style={styles.noSkillsText}>{displayData.emptyText}</Text>
            )}
          </>
        )}

        {/* Описание */}
        {profile.bio ? (
          <View style={styles.bioSection}>
            <Text style={styles.bioTitle}>О себе:</Text>
            <Text style={styles.cardBio}>{profile.bio}</Text>
          </View>
        ) : (
          <Text style={styles.noBioText}>Пользователь не добавил описание</Text>
        )}

        {/* Индикаторы свайпа */}
        {isTopCard && (
          <>
            <Animated.View 
              style={[
                styles.likeIndicator, 
                { 
                  opacity: swipe.x.interpolate({
                    inputRange: [0, SWIPE_THRESHOLD],
                    outputRange: [0, 1],
                    extrapolate: 'clamp'
                  })
                }
              ]}
            >
              <Text style={styles.likeText}>👍 ЛАЙК</Text>
            </Animated.View>
            <Animated.View 
              style={[
                styles.dislikeIndicator, 
                { 
                  opacity: swipe.x.interpolate({
                    inputRange: [-SWIPE_THRESHOLD, 0],
                    outputRange: [1, 0],
                    extrapolate: 'clamp'
                  })
                }
              ]}
            >
              <Text style={styles.dislikeText}>👎 ПАС</Text>
            </Animated.View>
          </>
        )}
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Загрузка профилей...</Text>
      </View>
    );
  }

  if (currentIndex >= profiles.length) {
    return (
      <View style={styles.container}>
        <View style={styles.bottomButtonsContainer}>
        {/* Кнопка слева - Чаты */}
        <TouchableOpacity style={styles.sideButton} onPress={() => router.push('/chats')}>
          <Ionicons name="chatbubble" size={24} color="#007AFF" />
          <Text style={styles.sideButtonText}>Чаты</Text>
        </TouchableOpacity>

        {/* Центральная кнопка - Смена параметров подбора по увлечениям/навыкам */}
        <TouchableOpacity style={styles.centerButton}  onPress={() => router.push('/filters')}>
          <Ionicons name="settings" size={28} color="white" />
        </TouchableOpacity>

        {/* Кнопка справа - Профиль */}
        <TouchableOpacity style={styles.sideButton}  onPress={() => router.push('/profile')}>
          <Ionicons name="person" size={24} color="#007AFF" />
          <Text style={styles.sideButtonText}>Профиль</Text>
        </TouchableOpacity>
      </View>
        <View style={styles.noMoreContainer}>
          <Text style={styles.noMoreText}>
              {profiles.length === 0 ? 'Нет доступных профилей' : 'Пока что больше нет профилей'}
          </Text>
          <Text style={styles.noMoreSubtext}>
            {showingMatchedProfiles ? 
              'Показать все профили, включая неподходящие под критерии?' : 
              matchCriteria === 'skills' && 'Попробуйте изменить критерии подбора или добавить больше навыков в профиль'}
            {showingMatchedProfiles ? 
              '' : 
              matchCriteria === 'hobbies' && 'Попробуйте изменить критерии подбора или добавить больше увлечений в профиль'}
            {showingMatchedProfiles ? 
              '' : 
              matchCriteria === 'both' && 'Попробуйте изменить критерии подбора или добавить больше навыков и увлечений в профиль'}
          </Text>
          
          {/* 👇 ДОБАВЛЕНО: Кнопка для переключения между профилями */}
          {showingMatchedProfiles ? (
            <TouchableOpacity 
              style={styles.showAllButton} 
              onPress={() => {
                setShowingMatchedProfiles(false);
                setRefreshKey(prev => prev + 1);
              }}
            >
              <Text style={styles.showAllButtonText}>Показать все профили</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.refreshButton} 
              onPress={() => {
                setRefreshKey(prev => prev + 1);
                setCurrentIndex(0);
              }}
            >
              <Ionicons name="refresh" size={20} color="#007AFF" />
              <Text style={styles.refreshButtonText}>Обновить профили</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Основной контент */}
      <View style={styles.content}>
        {profiles.map((profile, index) => renderCard(profile, index))}

        {/* Кнопки действий */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.dislikeButton} onPress={handleManualDislike}>
            <Ionicons name="close" size={32} color="#FF3B30" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.likeButton} onPress={handleManualLike}>
            <Ionicons name="heart" size={32} color="#4CD964" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomButtonsContainer}>
        {/* Кнопка слева - Чаты */}
        <TouchableOpacity style={styles.sideButton} onPress={() => router.push('/chats')}>
          <Ionicons name="chatbubble" size={24} color="#007AFF" />
          <Text style={styles.sideButtonText}>Чаты</Text>
        </TouchableOpacity>

        {/* Центральная кнопка - Смена параметров подбора по увлечениям/навыкам */}
        <TouchableOpacity style={styles.centerButton}  onPress={() => router.push('/filters')}>
          <Ionicons name="settings" size={28} color="white" />
        </TouchableOpacity>

        {/* Кнопка справа - Профиль */}
        <TouchableOpacity style={styles.sideButton}  onPress={() => router.push('/profile')}>
          <Ionicons name="person" size={24} color="#007AFF" />
          <Text style={styles.sideButtonText}>Профиль</Text>
        </TouchableOpacity>
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
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: SCREEN_WIDTH - 32,
    height: 550,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardFaculty: {
    fontSize: 16,
    color: '#666',
  },
  criteriaIndicator: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
    marginTop: 2,
  },
  nonMatchingIndicator: {
    fontSize: 12,
    color: '#FF9500',
    fontWeight: '500',
    marginTop: 2,
    fontStyle: 'italic',
  },
  skillsSection: {
    marginBottom: 12,
  },
  skillsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
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
    fontSize: 12,
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
    fontSize: 12,
    fontWeight: '500',
  },
  moreSkillsTag: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  moreSkillsText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500',
  },
  bioSection: {
    marginBottom: 8,
  },
  bioTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  cardBio: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  noBioText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 16,
  },
  noSkillsText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 450,
    gap: 40,
    zIndex: 1000,
    position: 'relative',
  },
  dislikeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  likeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bottomButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    zIndex: 1000,
  },
  sideButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    flex: 1,
  },
  centerButton: {
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginHorizontal: 20,
  },
  sideButtonText: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  likeIndicator: {
    position: 'absolute',
    backgroundColor: '#4CD964',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'white',
    transform: [{ translateX: SCREEN_WIDTH - 100 }, { translateY: 20 }],
  },
  likeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dislikeIndicator: {
    position: 'absolute',
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'white',
    transform: [{ translateX: 20 }, { translateY: 20 }],
  },
  dislikeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noMoreContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noMoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  noMoreSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  // 👇 ДОБАВЛЕНО: Стили для кнопок
  showAllButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  showAllButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  refreshButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});