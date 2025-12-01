// hooks/useChat.ts
import {
    addDoc,
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { useAuth } from './useAuth';

export const useChat = (chatId: string) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Real-time подписка на сообщения
  useEffect(() => {
    if (!chatId || !user?.email) return;

    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [chatId, user?.email]);

  // Отправка сообщения
  const sendMessage = async (text: string) => {
    if (!text.trim() || !chatId || !user?.email) return;

    setLoading(true);
    try {
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      await addDoc(messagesRef, {
        senderId: user.email, // используем email как идентификатор
        text: text.trim(),
        timestamp: serverTimestamp(),
        read: false
      });
      
      // Обновляем последнее сообщение в чате
      const chatRef = doc(db, 'chats', chatId);
      await updateDoc(chatRef, {
        lastMessage: text.trim(),
        updatedAt: serverTimestamp()
      });
      
    } catch (error) {
      console.error('Ошибка отправки:', error);
    } finally {
      setLoading(false);
    }
  };

  return { messages, sendMessage, loading };
};