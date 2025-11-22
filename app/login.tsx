import { useRouter } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useState } from 'react';
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

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        // Валидация полей
        if (!email.trim() || !password.trim()) {
            Alert.alert("Ошибка", "Заполните все поля");
            return;
        }

        setLoading(true);

        try {
            const q = query(collection(db, "users"), where("email", "==", email.trim()));
            const q_snap = await getDocs(q);

            // Проверяем, есть ли пользователь с таким email
            if (q_snap.empty) {
                Alert.alert("Ошибка", "Пользователь не найден");
                setLoading(false);
                return;
            }

            // Получаем данные первого найденного пользователя
            const userDoc = q_snap.docs[0];
            const userData = userDoc.data();

            // Проверяем пароль
            if (userData.password !== password) {
                Alert.alert("Ошибка", "Пароль неверный");
                setLoading(false);
                return;
            }

            // Логиним пользователя
            await login({
                id: userDoc.id,
                email: userData.email,
                name: userData.name || '',
                profileCompleted: userData.profileCompleted || false
            });

            Alert.alert("Успех", "Вход успешно выполнен");

            // Перенаправляем в зависимости от заполненности профиля
            if (userData.profileCompleted) {
                router.replace('/swipe');
            } else {
                router.replace('/profile-setup');
            }

        } catch (error) {
            console.error("Login error:", error);
            Alert.alert("Ошибка", "Не удалось выполнить вход");
        } finally {
            setLoading(false);
        }
    }

    const handleGoToRegistration = () => {
        router.push('/registration');
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>

                <Text style={styles.title}>Вход в аккаунт</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Введите ваш email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType='email-address'
                        autoCapitalize="none"
                        editable={!loading}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Пароль</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Введите пароль"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        editable={!loading}
                    />
                </View>

                <TouchableOpacity 
                    style={[styles.button, loading && styles.buttonDisabled]} 
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? "Вход..." : "Войти"}
                    </Text>
                </TouchableOpacity>

                <Text style={styles.footerText}>
                    Ещё нет аккаунта? {' '}
                    <Text style={styles.link} onPress={handleGoToRegistration}>
                        Зарегистрироваться
                    </Text>
                </Text>

            </ScrollView>
        </KeyboardAvoidingView>
    )
}
