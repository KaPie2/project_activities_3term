// app/registration.tsx
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { db } from "../config/firebase";
import BackgroundImage from './components/BackgroundImage';
import GradientButton from './components/GradientButton';
import { styles } from "./style_template";

// Импортируем изображения
const emailIcon = require('../assets/images/login/email_icon.png');
const lockIcon = require('../assets/images/login/lock_icon.png');
const openEyeIcon = require('../assets/images/login/open_eye.png');
const closeEyeIcon = require('../assets/images/login/close_eye.png');
const logoIcon = require('../assets/images/login/dev_icon.png');
const omstuConnectLogo = require('../assets/images/login/omstu-connect.png');

export default function RegistrationScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        setLoading(true);

        if (!email.trim() || !password.trim() || !passwordConfirm.trim()) {
            Alert.alert("Ошибка", "Заполните все поля");
            setLoading(false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            Alert.alert("Ошибка", "Введите корректный email адрес");
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
                email: email.trim(),
                password: password,
                profileCompleted: false,
            });

            // Создаем пустой профиль
            await addDoc(collection(db, "profile"), {
                email: email.trim(),
                name: null,
                faculty: null,
                skills: null,
                bio: null,
                likes: null,
                dislikes: null,
                createdAt: new Date().toISOString(),
            });

            console.log("User added with ID: ", docRef.id);

            Alert.alert("Успех!", "Пользователь успешно зарегистрирован");
            // Перенаправление на экран заполнения профиля
            router.push({
                pathname: '/profile-setup',
                params: { email: email.trim() }
            });
        } catch (error) {
            console.error("Registration error:", error);
            Alert.alert("Ошибка", "Не удалось зарегистрировать пользователя");
        } finally {
            setLoading(false);
        }
    };

    const handleGoToLogin = () => {
        router.push('/login');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const togglePasswordConfirmVisibility = () => {
        setShowPasswordConfirm(!showPasswordConfirm);
    };

    return (
        <SafeAreaView style={styles.loginContainer}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            
            {/* Background Image */}
            <BackgroundImage/>
            
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View style={styles.loginContent}>
                    <View style={styles.loginHeader}>
                        <LinearGradient
                            colors={['#64A2F7', '#E7499A']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.logoContainer}
                        >
                            <Image 
                                source={logoIcon}
                                style={styles.logoIcon}
                                resizeMode="contain"
                            />
                        </LinearGradient>
                        
                        {/* Логотип */}
                        <Image 
                            source={omstuConnectLogo}
                            style={styles.omstuConnectLogo}
                            resizeMode="contain"
                        />
                        
                        <Text style={styles.subtitleText}>
                            Создайте новый аккаунт
                        </Text>
                    </View>

                    {/* Форма регистрации */}
                    <View style={styles.loginForm}>
                        {/* Поле Email */}
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>Email</Text>
                            <View style={styles.textInputContainer}>
                                <Image 
                                    source={emailIcon}
                                    style={styles.textInputIcon}
                                    resizeMode="contain"
                                />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="your.email@omstu.ru"
                                    placeholderTextColor="#585a89"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    editable={!loading}
                                />
                            </View>
                        </View>

                        {/* Поле Пароль */}
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>Пароль</Text>
                            <View style={styles.textInputContainer}>
                                <Image 
                                    source={lockIcon}
                                    style={styles.textInputIcon}
                                    resizeMode="contain"
                                />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="**********"
                                    placeholderTextColor="#585a89"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    autoComplete="password"
                                    editable={!loading}
                                />
                                <TouchableOpacity 
                                    onPress={togglePasswordVisibility}
                                    style={styles.eyeButton}
                                >
                                    <Image 
                                        source={showPassword ? closeEyeIcon : openEyeIcon}
                                        style={styles.eyeIcon}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Поле Подтверждение пароля */}
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>Подтвердите пароль</Text>
                            <View style={styles.textInputContainer}>
                                <Image 
                                    source={lockIcon}
                                    style={styles.textInputIcon}
                                    resizeMode="contain"
                                />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="**********"
                                    placeholderTextColor="#585a89"
                                    value={passwordConfirm}
                                    onChangeText={setPasswordConfirm}
                                    secureTextEntry={!showPasswordConfirm}
                                    autoCapitalize="none"
                                    autoComplete="password"
                                    editable={!loading}
                                />
                                <TouchableOpacity 
                                    onPress={togglePasswordConfirmVisibility}
                                    style={styles.eyeButton}
                                >
                                    <Image 
                                        source={showPasswordConfirm ? closeEyeIcon : openEyeIcon}
                                        style={styles.eyeIcon}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Кнопка ЗАРЕГИСТРИРОВАТЬСЯ */}
                    <GradientButton
                        title="Зарегистрироваться"
                        onPress={handleRegister}
                        loading={loading}
                        disabled={loading}
                    />

                    <View style={styles.footerContainer}>
                        <Text style={styles.registerText}>
                            Уже есть аккаунт?{' '}
                            <Text 
                                style={styles.registerLink}
                                onPress={handleGoToLogin}
                            >
                                Войти
                            </Text>
                        </Text>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}