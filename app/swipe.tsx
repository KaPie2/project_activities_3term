import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { addDoc, arrayUnion, collection, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
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
  bio: string;
  avatar?: string;
}

interface Chat {
  id: string;
  participants: string[];
  lastMessage?: string;
  createdAt: Date;
}

export default function SwipeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const swipe = useRef(new Animated.ValueXY()).current;
  const position = useRef(new Animated.ValueXY()).current;

  useEffect(() => {
    loadProfiles();
  }, [user]);

  const loadProfiles = async () => {
    if (!user?.email) return;

    try {
      // Получаем текущий профиль чтобы узнать лайки/дизлайки
      const currentProfileQuery = query(
        collection(db, "profile"), 
        where("email", "==", user.email)
      );
      const currentProfileSnapshot = await getDocs(currentProfileQuery);
      
      let userLikes: string[] = [];
      let userDislikes: string[] = [];
      
      if (!currentProfileSnapshot.empty) {
        const currentProfileData = currentProfileSnapshot.docs[0].data();
        userLikes = currentProfileData.likes || [];
        userDislikes = currentProfileData.dislikes || [];
      }

      const excludedEmails = [...userLikes, ...userDislikes, user.email];

      // Получаем ВСЕ профили кроме текущего пользователя
      const profilesQuery = query(
        collection(db, "profile"), 
        where("email", "!=", user.email)
      );
      const profilesSnapshot = await getDocs(profilesQuery);
      
      const loadedProfiles: Profile[] = [];
      
      profilesSnapshot.docs.forEach(doc => {
        const profileData = doc.data();
        
        // Пропускаем если уже лайкали или дизлайкали
        if (excludedEmails.includes(profileData.email)) {
          return;
        }

        // Проверяем обязательные поля
        if (profileData.name && profileData.faculty) {
          const skills = Array.isArray(profileData.skills) ? profileData.skills : [];
          
          loadedProfiles.push({
            id: doc.id,
            name: profileData.name,
            email: profileData.email,
            faculty: profileData.faculty,
            skills: skills,
            bio: profileData.bio || '',
            avatar: profileData.avatar
          });
        }
      });

      setProfiles(loadedProfiles);
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      swipe.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        // Свайп вправо - лайк
        forceSwipe('right');
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        // Свайп влево - дизлайк
        forceSwipe('left');
      } else {
        // Возврат на место
        resetPosition();
      }
    }
  });

  const forceSwipe = (direction: 'right' | 'left') => {
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
    
    Animated.timing(swipe, {
      toValue: { x, y: 0 },
      duration: 250,
      useNativeDriver: true
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = async (direction: 'right' | 'left') => {
    if (profiles.length === 0) return;

    const item = profiles[currentIndex];
    
    if (direction === 'right') {
      await handleLike(item);
    } else {
      await handleDislike(item);
    }

    // Сбрасываем позицию и переходим к следующему
    swipe.setValue({ x: 0, y: 0 });
    setCurrentIndex(prev => prev + 1);
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
      // Проверяем, существует ли уже чат
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

      // Создаем новый чат
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
      // Проверяем профиль пользователя, которого лайкнули
      const likedUserQuery = query(
        collection(db, "profile"), 
        where("email", "==", likedUserEmail)
      );
      const likedUserSnapshot = await getDocs(likedUserQuery);
      
      if (!likedUserSnapshot.empty) {
        const likedUserData = likedUserSnapshot.docs[0].data();
        const theirLikes = likedUserData.likes || [];
        
        // Если они тоже нас лайкнули - это мэтч!
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
      // Находим документ текущего пользователя в profile
      const currentProfileQuery = query(
        collection(db, "profile"), 
        where("email", "==", user.email)
      );
      const currentProfileSnapshot = await getDocs(currentProfileQuery);
      
      if (!currentProfileSnapshot.empty) {
        const currentProfileDoc = currentProfileSnapshot.docs[0];
        
        // Обновляем лайки в профиле текущего пользователя
        await updateDoc(currentProfileDoc.ref, {
          likes: arrayUnion(profile.email),
          updatedAt: new Date()
        });

        console.log('Liked:', profile.name);

        // Проверяем на мэтч
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
      // Находим документ текущего пользователя в profile
      const currentProfileQuery = query(
        collection(db, "profile"), 
        where("email", "==", user.email)
      );
      const currentProfileSnapshot = await getDocs(currentProfileQuery);
      
      if (!currentProfileSnapshot.empty) {
        const currentProfileDoc = currentProfileSnapshot.docs[0];
        
        // Обновляем дизлайки в профиле текущего пользователя
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
    // Смещаем карточки в стопке
    const offset = (index - currentIndex) * 10; // 10px смещение для каждой следующей карточки
    const scale = 1 - (index - currentIndex) * 0.05; // Уменьшаем масштаб для следующих карточек
    const opacity = index === currentIndex ? 1 : 0.95 - (index - currentIndex) * 0.1;

    return {
      transform: [
        { translateY: offset },
        { scale: scale }
      ],
      opacity: opacity,
      zIndex: profiles.length - index, // Чтобы верхние карточки были поверх нижних
    };
  };

  const renderCard = (profile: Profile, index: number) => {
    if (index < currentIndex) return null;

    const isTopCard = index === currentIndex;
    
    // Безопасная обработка skills
    const skills = Array.isArray(profile.skills) ? profile.skills : [];
    const displaySkills = skills.slice(0, 4);
    const remainingSkills = skills.length > 4 ? skills.length - 4 : 0;

    const cardStyle = isTopCard ? getCardStyle() : {};
    const stackStyle = getCardStackStyle(index);

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
          </View>
        </View>

        {/* Скилы */}
        {skills.length > 0 ? (
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
        ) : (
          <Text style={styles.noSkillsText}>Навыки не указаны</Text>
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
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/chats')}>
            <Ionicons name="chatbubble-outline" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>OmGTU Connect</Text>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/profile')}>
            <Ionicons name="menu-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.noMoreContainer}>
          <Text style={styles.noMoreText}>Пока что больше нет профилей</Text>
          <Text style={styles.noMoreSubtext}>Загляните позже или измените критерии поиска!</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Хедер */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/chats')}>
          <Ionicons name="chatbubble-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>OmGTU Connect</Text>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/profile')}>
          <Ionicons name="menu-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

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
    zIndex: 1000, // ДОБАВИТЬ высокий zIndex
    position: 'relative', // ДОБАВИТЬ для работы zIndex
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
  },
});
