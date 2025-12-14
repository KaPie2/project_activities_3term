import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { addDoc, arrayUnion, collection, getDocs, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, Image, PanResponder, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';
import BackgroundImage from './components/BackgroundImage';
import LoadingScreen from './components/LoadingScreen';
import { styles } from './style_template';

const textsIcon = require('../assets/images/swipe/texts.png');
const circleDevIcon = require('../assets/images/swipe/Circle_dev.png');
const profileIcon = require('../assets/images/swipe/Profile.png');
const dislikeIcon = require('../assets/images/swipe/dislike.png');
const likeIcon = require('../assets/images/swipe/like.png');
const noImageIcon = require('../assets/images/swipe/No_image.png');
const educationIcon = require('../assets/images/swipe/education.png');
const aboutMeIcon = require('../assets/images/swipe/About_me.png');
const robotIcon = require('../assets/images/swipe/Robot.png');
const bowlingIcon = require('../assets/images/swipe/Bowling.png');
const rectangleImage = require('../assets/images/swipe/Rectangle.png');

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
  age?: number;
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
  const [showingMatchedProfiles, setShowingMatchedProfiles] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [visibleCardIndex, setVisibleCardIndex] = useState(0);
  
  const currentCardSwipe = useRef(new Animated.ValueXY()).current;
  const nextCardOpacity = useRef(new Animated.Value(0)).current;
  const nextCardScale = useRef(new Animated.Value(0.95)).current;
  const topSectionRef = useRef<View>(null);

  useFocusEffect(
    React.useCallback(() => {
      loadUserPreferences();
      setRefreshKey(prev => prev + 1);
      setCurrentIndex(0);
      setVisibleCardIndex(0);
      setShowingMatchedProfiles(true);
      setIsAnimating(false);
      currentCardSwipe.setValue({ x: 0, y: 0 });
      nextCardOpacity.setValue(0);
      nextCardScale.setValue(0.95);
    }, [user])
  );
  
  useEffect(() => {
    loadUserPreferences();
  }, [user]);

  useEffect(() => {
    setVisibleCardIndex(currentIndex);
  }, [currentIndex]);

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
        
        setCurrentUserProfile({
          id: profilesSnapshot.docs[0].id,
          name: profileData.name || '',
          email: profileData.email,
          faculty: profileData.faculty || '',
          skills: profileData.skills || [],
          hobbies: profileData.hobbies || [],
          bio: profileData.bio || '',
          avatar: profileData.avatar,
          age: profileData.age
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, [user, matchCriteria, refreshKey, currentUserProfile, showingMatchedProfiles]);

  const loadProfiles = async () => {
    if (!user?.email || !currentUserProfile) return;

    try {
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

      const profilesQuery = query(
        collection(db, "profile"), 
        where("email", "!=", user.email)
      );
      const profilesSnapshot = await getDocs(profilesQuery);
      
      const matchedProfiles: Profile[] = [];
      const otherProfiles: Profile[] = [];
      
      profilesSnapshot.docs.forEach(doc => {
        const profileData = doc.data();
        
        if (excludedEmails.includes(profileData.email)) {
          return;
        }

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
            avatar: profileData.avatar,
            age: profileData.age
          };

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

      let finalProfiles: Profile[] = [];
      
      if (showingMatchedProfiles && matchedProfiles.length > 0) {
        finalProfiles = matchedProfiles;
      } else if (showingMatchedProfiles && matchedProfiles.length === 0) {
        finalProfiles = otherProfiles;
        setShowingMatchedProfiles(false);
      } else {
        finalProfiles = [...matchedProfiles, ...otherProfiles];
      }

      setCurrentIndex(0);
      setVisibleCardIndex(0);
      setProfiles(finalProfiles);
      
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showingMatchedProfiles && currentIndex >= profiles.length && profiles.length > 0) {
      setShowingMatchedProfiles(false);
      setRefreshKey(prev => prev + 1);
    }
  }, [currentIndex, profiles.length, showingMatchedProfiles]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !isAnimating,
    onMoveShouldSetPanResponder: () => !isAnimating,
    onPanResponderMove: (_, gesture) => {
      currentCardSwipe.setValue({ x: gesture.dx, y: 0 });
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        swipeCard('right');
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        swipeCard('left');
      } else {
        resetPosition();
      }
    }
  });

  const swipeCard = (direction: 'right' | 'left') => {
    if (isAnimating || currentIndex >= profiles.length) return;
    
    setIsAnimating(true);
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
    
    // Сразу показываем следующую карточку (но пока еще прозрачную)
    nextCardOpacity.setValue(0.3);
    nextCardScale.setValue(0.98);
    
    // Анимация ухода текущей карточки
    Animated.parallel([
      Animated.timing(currentCardSwipe.x, {
        toValue: x,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(nextCardOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(nextCardScale, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      })
    ]).start(async () => {
      // Выполняем действие (лайк/дизлайк)
      const item = profiles[currentIndex];
      if (direction === 'right') {
        await handleLike(item);
      } else {
        await handleDislike(item);
      }
      
      const isLastProfile = currentIndex === profiles.length - 1;
      
      if (isLastProfile) {
        setCurrentIndex(currentIndex + 1);
        setVisibleCardIndex(currentIndex + 1);
        
        setTimeout(() => {
          if (showingMatchedProfiles) {
            setShowingMatchedProfiles(false);
            setRefreshKey(prev => prev + 1);
          }
          setIsAnimating(false);
        }, 100);
      } else {
        // Меняем индексы
        setCurrentIndex(prev => prev + 1);
        setVisibleCardIndex(prev => prev + 1);
        
        // Сбрасываем анимацию для новой текущей карточки
        currentCardSwipe.setValue({ x: 0, y: 0 });
        nextCardOpacity.setValue(0);
        nextCardScale.setValue(0.95);
        
        setIsAnimating(false);
      }
    });
  };

  const resetPosition = () => {
    Animated.spring(currentCardSwipe, {
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
      }
    } catch (error) {
      console.error('Error disliking profile:', error);
    }
  };

  const handleManualLike = () => {
    swipeCard('right');
  };

  const handleManualDislike = () => {
    swipeCard('left');
  };

  const getCurrentCardStyle = () => {
    const rotate = currentCardSwipe.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-30deg', '0deg', '30deg'],
      extrapolate: 'clamp'
    });

    return {
      transform: [
        { translateX: currentCardSwipe.x },
        { translateY: currentCardSwipe.y },
        { rotate }
      ]
    };
  };

  const getNextCardStyle = () => {
    return {
      opacity: nextCardOpacity,
      transform: [
        { scale: nextCardScale }
      ]
    };
  };

  const renderCard = (profile: Profile, index: number) => {
    if (index !== visibleCardIndex) return null;
    
    const cardStyle = index === visibleCardIndex ? getCurrentCardStyle() : getNextCardStyle();

    return (
      <Animated.View
        key={`card-${profile.id}-${index}`}
        style={[
          styles.swipeCard,
          cardStyle,
          { 
            zIndex: 10,
            position: 'absolute',
          }
        ]}
      >
        <View 
          ref={topSectionRef}
          {...panResponder.panHandlers}
        >
          <View style={styles.cardTopSection}>
            {profile.avatar ? (
              <Image 
                source={{ uri: profile.avatar }} 
                style={styles.cardImage}
              />
            ) : (
              <View style={styles.noImageContainer}>
                <Image 
                  source={noImageIcon}
                  style={styles.cardImage}
                  resizeMode="contain"
                />
              </View>
            )}
            
            <View style={styles.nameAgeContainer}>
              <Text style={styles.nameAgeText}>
                {profile.name || 'Имя не указано'}
                {profile.age ? `, ${profile.age}` : ''}
              </Text>
            </View>
            
            <View style={styles.educationContainer}>
              <Image 
                source={educationIcon}
                style={styles.educationIcon}
                resizeMode="contain"
              />
              <Text style={styles.facultyText}>
                {profile.faculty || 'Факультет не указан'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.cardBottomSection}>
          <ScrollView 
            style={styles.bottomSectionScroll}
            contentContainerStyle={styles.bottomSectionContent}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            <View style={styles.aboutSection}>
              <View style={styles.aboutHeader}>
                <Image 
                  source={aboutMeIcon}
                  style={styles.aboutIcon}
                  resizeMode="contain"
                />
                <Text style={styles.aboutTitle}>О себе:</Text>
              </View>
              {profile.bio ? (
                <Text style={styles.bioText}>{profile.bio}</Text>
              ) : (
                <Text style={[styles.bioText, { color: '#888' }]}>
                  Описание не добавлено
                </Text>
              )}
            </View>

            <View style={styles.skillsSection}>
              <View style={styles.skillsHeader}>
                <Image 
                  source={robotIcon}
                  style={styles.skillsIcon}
                  resizeMode="contain"
                />
                <Text style={styles.skillsTitle}>Навыки:</Text>
              </View>
              {profile.skills && profile.skills.length > 0 ? (
                <View style={styles.skillsContainer}>
                  {profile.skills.map((skill, skillIndex) => (
                    <LinearGradient
                      key={skillIndex}
                      colors={['#8090E4', '#575C8D']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.skillTag}
                    >
                      <Text style={styles.skillText}>{skill}</Text>
                    </LinearGradient>
                  ))}
                </View>
              ) : (
                <Text style={[styles.bioText, { color: '#888' }]}>
                  Навыки не указаны
                </Text>
              )}
            </View>

            <View style={styles.hobbiesSection}>
              <View style={styles.hobbiesHeader}>
                <Image 
                  source={bowlingIcon}
                  style={styles.hobbiesIcon}
                  resizeMode="contain"
                />
                <Text style={styles.hobbiesTitle}>Увлечения:</Text>
              </View>
              {profile.hobbies && profile.hobbies.length > 0 ? (
                <View style={styles.hobbiesContainer}>
                  {profile.hobbies.map((hobby, hobbyIndex) => (
                    <LinearGradient
                      key={hobbyIndex}
                      colors={['#8090E4', '#575C8D']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.hobbyTag}
                    >
                      <Text style={styles.hobbyText}>{hobby}</Text>
                    </LinearGradient>
                  ))}
                </View>
              ) : (
                <Text style={[styles.bioText, { color: '#888' }]}>
                  Увлечения не указаны
                </Text>
              )}
            </View>
          </ScrollView>
        </View>
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <LoadingScreen 
        title="Ищем студентов"
        subtitle="Анализируем профили по вашим критериям..."
      />
    );
  }

  if (currentIndex >= profiles.length) {
    return (
      <View style={styles.swipeContainer}>
        <BackgroundImage />
        
        {/* Верхний прямоугольник 393×61 */}
        <View style={styles.rectangleTop} />
        
        {/* Нижний прямоугольник 438×88 - используем изображение */}
        <Image 
          source={rectangleImage}
          style={styles.rectangleBottomImage}
          resizeMode="stretch"
        />
        
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
                setVisibleCardIndex(0);
              }}
            >
              <Ionicons name="refresh" size={20} color="#007AFF" />
              <Text style={styles.refreshButtonText}>Обновить профили</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.bottomPanel}>
          <TouchableOpacity 
            style={styles.bottomPanelButton} 
            onPress={() => router.push('/chats')}
          >
            <Image 
              source={textsIcon}
              style={styles.bottomPanelIcon}
              resizeMode="contain"
            />
            <Text style={styles.bottomPanelText}>Чаты</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.centerPanelButton} 
            onPress={() => router.push('/filters')}
          >
            <Image 
              source={circleDevIcon}
              style={styles.centerPanelIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.bottomPanelButton} 
            onPress={() => router.push('/profile')}
          >
            <Image 
              source={profileIcon}
              style={styles.bottomPanelIcon}
              resizeMode="contain"
            />
            <Text style={styles.bottomPanelText}>Профиль</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.swipeContainer}>
      <BackgroundImage />
      
      {/* Верхний прямоугольник 393×61 */}
      <View style={styles.rectangleTop} />
      
      {/* Нижний прямоугольник 438×88 - используем изображение */}
      <Image 
        source={rectangleImage}
        style={styles.rectangleBottomImage}
        resizeMode="stretch"
      />
      
      <View style={styles.swipeContent}>
        {/* Текущая карточка - только одна */}
        {renderCard(profiles[visibleCardIndex], visibleCardIndex)}

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.dislikeButtonNew} 
            onPress={handleManualDislike}
            disabled={isAnimating}
          >
            <Image 
              source={dislikeIcon}
              style={styles.dislikeIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.likeButtonNew} 
            onPress={handleManualLike}
            disabled={isAnimating}
          >
            <Image 
              source={likeIcon}
              style={styles.likeIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomPanel}>
        <TouchableOpacity 
          style={styles.bottomPanelButton} 
          onPress={() => router.push('/chats')}
        >
          <Image 
            source={textsIcon}
            style={styles.bottomPanelIcon}
            resizeMode="contain"
          />
          <Text style={styles.bottomPanelText}>Чаты</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.centerPanelButton} 
          onPress={() => router.push('/filters')}
        >
          <Image 
            source={circleDevIcon}
            style={styles.centerPanelIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.bottomPanelButton} 
          onPress={() => router.push('/profile')}
        >
          <Image 
            source={profileIcon}
            style={styles.bottomPanelIcon}
            resizeMode="contain"
          />
          <Text style={styles.bottomPanelText}>Профиль</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}