import { useRouter } from 'expo-router'; // Импорт хука для навигации между экранами в Expo Router
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
    // Хук useRouter предоставляет методы для программной навигации
    // Позволяет переходить между экранами без использования компонентов навигации
    const router = useRouter();
    const { login } = useAuth(); // ← Используем хук
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async() => {
        const q = query(collection(db, "users"), where("email", "==", email));

        const q_snap = await getDocs(q);

        if (q_snap.empty){
            Alert.alert("Ошибка", "Пользователь не найден");
            return;
        }

        

        const userData = q_snap.docs[0].data();
        if (userData.password != password){
            Alert.alert("Ошибка", "Пароль неверный");
            return;
        }

        await login({
            id: q_snap.docs[0].id,
            email: userData.email,
            name: userData.name,
            profileCompleted: userData.profileCompleted
        });

        Alert.alert("Успех", "Вход успешно выполнен");

        if (userData.profileCompleted) {
            router.replace('/swipe');
        } else {
            router.replace('/profile-setup');
        }
    }

    // Функция для перехода на экран регистрации
    const handleGoToRegistration = () => {
        router.push('/registration'); // или router.navigate('/login')
    };

    return (<KeyboardAvoidingView
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
                    />
                </View>

            

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Войти</Text>
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