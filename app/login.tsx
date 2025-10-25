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


export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async() => {
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

        Alert.alert("Успех", "Вход успешно выполнен");
    }

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

            

                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Войти</Text>
                </TouchableOpacity>


            </ScrollView>
        </KeyboardAvoidingView>
    )

}