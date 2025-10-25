import { addDoc, collection } from 'firebase/firestore';
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
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [loading, setLoading] = useState(false);


    const handleRegister = async() => {
        setLoading(true);

        if (!name || !email || !password || !passwordConfirm) {
            Alert.alert("Ошибка", "Заполните все поля");
            return;
        }

        if (password !== passwordConfirm) {
            Alert.alert("Ошибка", "Пароли не совпадают");
            return;
        }

        const docRef = await addDoc(collection(db, 'users'), {
        name: name,
        email: email,
        password: password,
        
        });

        console.log("User added with ID: ", docRef.id);


        Alert.alert("Успех!", "Пользователь успешно зарегистрирован");

        setName("");
        setEmail("");
        setPassword("");
        setPasswordConfirm("");

        setLoading(false);

    };


    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>

                <Text style={styles.title}>Регистрация</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Имя</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Введите ваше имя"
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                    />
                </View>

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
                    Уже есть аккаунт? <Text style={styles.link}>Войдите</Text>
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

