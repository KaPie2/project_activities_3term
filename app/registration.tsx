import { useRouter } from 'expo-router'; // Импорт хука для навигации между экранами в Expo Router
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
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


export default function RegistrationScreen()  {
    // Хук useRouter предоставляет методы для программной навигации
    // Позволяет переходить между экранами без использования компонентов навигации
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [loading, setLoading] = useState(false);


    const handleRegister = async() => {
        setLoading(true);

        if (!email || !password || !passwordConfirm) {
            Alert.alert("Ошибка", "Заполните все поля");
            setLoading(false);
            return;
        }

        if (password !== passwordConfirm) {
            Alert.alert("Ошибка", "Пароли не совпадают");
            setLoading(false);
            return;
        }

        try {
            // Проверяем, существует ли пользователь с таким email
            const usersQuery = query(collection(db, "users"), where("email", "==", email.trim()));
            const usersSnapshot = await getDocs(usersQuery);
            
            if (!usersSnapshot.empty) {
                Alert.alert("Ошибка", "Пользователь с таким email уже существует");
                setLoading(false);
                return;
            }

            // Создаем пользователя
            const docRef = await addDoc(collection(db, 'users'), {
                email: email,
                password: password,
                // Флаг указывающий, что профиль не заполнен полностью
                // После регистрации пользователь будет перенаправлен на экран заполнения профиля
                profileCompleted: false,
            });

            // Создаем пустой профиль
            await addDoc(collection(db, "profile"), {
                email: email,
                name: null,
                faculty: null,
                skills: null,
                bio: null,
                likes: null,
                dislikes: null,
                createdAt: new Date().toISOString(),
            })

            console.log("User added with ID: ", docRef.id);

            Alert.alert("Успех!", "Пользователь успешно зарегистрирован");
            // Перенаправление на экран заполнения профиля после успешной регистрации
            // replace очищает историю навигации, чтобы пользователь не мог вернуться назад к регистрации
            router.push({
                pathname: '/profile-setup',
                params: { email: email } // ← ПЕРЕДАЕМ EMAIL
            });
        } catch (error) {
            console.error("Registration error:", error);
            Alert.alert("Ошибка", "Не удалось зарегистрировать пользователя");
        } finally {
            setLoading(false);
        }
    };

    // Функция для перехода на экран входа
    const handleGoToLogin = () => {
        router.push('/login'); // или router.navigate('/login')
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView contentContainerStyle={[styles.scrollContainer, { paddingBottom: 50 }]}>

                <Text style={styles.title}>Регистрация</Text>

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

                 <View style={styles.inputContainer}>
                    <Text style={styles.label}>Подтвердите пароль</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Повторите пароль"
                        value={passwordConfirm}
                        onChangeText={setPasswordConfirm}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleRegister} disabled={loading}>
                    <Text style={styles.buttonText}>Зарегистрироваться</Text>
                </TouchableOpacity>

                <Text style={styles.footerText}>
                    Уже есть аккаунт? {' '}
                    <Text style={styles.link} onPress={handleGoToLogin}>
                        Войдите
                    </Text>
                </Text>

            </ScrollView>
        </KeyboardAvoidingView>
    )
};


// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#f5f5f5",
//     },

//     scrollContainer: {
//         flexGrow: 1,
//         justifyContent: "center",
//         padding: 20,
//     },

//     title: {
//         fontSize: 28,
//         fontWeight: 'bold',
//         textAlign: "center",
//         marginBottom: 30,
//         color: '#333',
//     },

//     inputContainer: {
//         marginBottom: 20,
//     },

//     label: {
//         fontSize: 16,
//         marginBottom: 8,
//         color: '#333',
//         fontWeight: '500',
//     },

//     input: {
//         backgroundColor: 'white',
//         padding: 15,
//         borderRadius: 10,
//         borderWidth: 1,
//         borderColor: '#ddd',
//         fontSize: 16,
//     },

//     button: {
//         backgroundColor: '#007AFF',
//         padding: 15,
//         borderRadius: 10,
//         alignItems: 'center',
//         marginTop: 20,
//     },

//      buttonText: {
//         color: 'white',
//         fontSize: 18,
//         fontWeight: 'bold',
//     },
  
//     footerText: {
//         textAlign: 'center',
//         marginTop: 20,
//         color: '#666',
//     },
  
//     link: {
//         color: '#007AFF',
//         fontWeight: 'bold',
//     },

//     buttonDisabled: {
//         backgroundColor: '#cccccc',
//     },

// });

