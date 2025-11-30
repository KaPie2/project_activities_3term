import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
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
import { useAuth } from '../hooks/useAuth';
import GradientButton from './components/GradientButton';
import { styles } from "./style_template";

// Импортируем изображения
const backgroundImage = require('../assets/images/welcome/background.png');
const emailIcon = require('../assets/images/login/email_icon.png');
const lockIcon = require('../assets/images/login/lock_icon.png');
const openEyeIcon = require('../assets/images/login/open_eye.png');
const closeEyeIcon = require('../assets/images/login/close_eye.png');
const logoIcon = require('../assets/images/login/dev_icon.png');
const omstuConnectLogo = require('../assets/images/login/omstu-connect.png'); // Добавляем логотип

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Убрали SplashScreen.hideAsync() - это было проблемой
    }, []);

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert("Ошибка", "Заполните все поля");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            Alert.alert("Ошибка", "Введите корректный email адрес");
            return;
        }

        setLoading(true);

        try {
            const q = query(collection(db, "users"), where("email", "==", email.trim()));
            const q_snap = await getDocs(q);

            if (q_snap.empty) {
                Alert.alert("Ошибка", "Пользователь не найден");
                setLoading(false);
                return;
            }

            const userDoc = q_snap.docs[0];
            const userData = userDoc.data();

            if (userData.password !== password) {
                Alert.alert("Ошибка", "Пароль неверный");
                setLoading(false);
                return;
            }

            await login({
                id: userDoc.id,
                email: userData.email,
                name: userData.name || '',
                profileCompleted: userData.profileCompleted || false
            });

            Alert.alert("Успех", "Вход успешно выполнен");

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

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <SafeAreaView style={styles.loginContainer}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            
            {/* Background Image */}
            <Image 
                source={backgroundImage} 
                style={styles.backgroundImage}
                resizeMode="cover"
            />
            
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
                        
                        {/* Заменяем текст на картинку с логотипом */}
                        <Image 
                            source={omstuConnectLogo}
                            style={styles.omstuConnectLogo}
                            resizeMode="contain"
                        />
                        
                        <Text style={styles.subtitleText}>
                            Войдите в свой аккаунт
                        </Text>
                    </View>

                    {/* Форма с email и паролем */}
                    <View style={styles.loginForm}>
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

                        <TouchableOpacity style={styles.forgotPassword}>
                            <Text style={styles.forgotPasswordText}>
                                Забыли пароль?
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Кнопка ВОЙТИ */}
                    <GradientButton
                        title="Войти"
                        onPress={handleLogin}
                        loading={loading}
                        disabled={loading}
                    />

                    <View style={styles.footerContainer}>
                        <Text style={styles.registerText}>
                            Нет аккаунта?{' '}
                            <Text 
                                style={styles.registerLink}
                                onPress={handleGoToRegistration}
                            >
                                Зарегистрироваться
                            </Text>
                        </Text>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
