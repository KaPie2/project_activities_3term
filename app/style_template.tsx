import {
    Dimensions,
    StyleSheet
} from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    // === ОСНОВНЫЕ СТИЛИ ДЛЯ ЛОГИНА ===
    loginContainer: {
        flex: 1,
        backgroundColor: 'transparent',
    },

    keyboardAvoidingView: {
        flex: 1,
        backgroundColor: 'transparent',
    },

    backgroundImage: {
        position: 'absolute',
        width: width,
        height: height,
        top: 0,
        left: 0,
    },
    
    loginContent: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    
    loginHeader: {
        alignItems: 'center',
        marginBottom: 40,
    },
    
    logoContainer: {
        width: 79,
        height: 79,
        borderRadius: 41.21,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    
    logoIcon: {
        width: 45.74,
        height: 45.74,
    },
    
    omstuConnectLogo: {
        width: 299,
        height: 33,
        marginBottom: 10,
    },

    subtitleText: {
        fontSize: 15,
        color: '#585a89',
        fontFamily: 'System',
        fontWeight: '400',
        marginTop: 5,
    },
    
    loginForm: {
        backgroundColor: 'rgba(49, 52, 86, 0.22)',
        borderWidth: 1,
        borderColor: '#585a89',
        borderRadius: 10,
        padding: 20,
        marginBottom: 30,
        marginTop: -10,
    },
    
    inputWrapper: {
        marginBottom: 25,
    },
    
    inputLabel: {
        color: '#ffffffde',
        fontSize: 14,
        fontFamily: 'System',
        fontWeight: '500',
        marginBottom: 8,
    },
    
    textInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(49, 52, 86, 0.73)',
        borderWidth: 1,
        borderColor: '#585a89',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        height: 42,
    },
    
    textInputIcon: {
        width: 17.92,
        height: 14.58,
        marginRight: 8,
    },
    
    textInput: {
        flex: 1,
        color: '#ffffff',
        fontSize: 14,
        fontFamily: 'System',
    },
    
    eyeButton: {
        padding: 8,
        marginLeft: 8,
    },

    eyeIcon: {
        width: 20,
        height: 20,
    },
    
    forgotPassword: {
        alignSelf: 'flex-end',
        marginTop: -10,
        marginBottom: 20,
    },
    
    forgotPasswordText: {
        color: '#4e9df7',
        fontSize: 12,
        fontFamily: 'System',
        fontWeight: '500',
    },
    
    footerContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    
    registerText: {
        color: '#585a89',
        fontSize: 13,
        fontFamily: 'System',
        textAlign: 'center',
    },
    
    registerLink: {
        color: '#E9499A',
        fontWeight: '600',
    },

    // === ОБЩИЕ СТИЛИ ДЛЯ ФОРМ ===
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },

    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 20,
    },

    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: "center",
        marginBottom: 30,
        color: '#333',
    },

    inputContainer: {
        marginBottom: 20,
    },

    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
        fontWeight: '500',
    },

    input: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16,
    },

    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },

    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },

    buttonDisabled: {
        backgroundColor: '#cccccc',
    },

    footerText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#666',
    },

    link: {
        color: '#007AFF',
        fontWeight: 'bold',
    },

    // === WELCOME СТИЛИ ===
    welcomeContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
    },

    welcomeBackground: {
        position: 'absolute',
        width: width,
        height: height,
        top: 0,
        left: 0,
    },

    welcomeMainImage: {
        width: 323,
        height: 312,
        position: 'absolute',
        left: width / 2 - 162,
        top: height / 2 - 377,
    },

    welcomeFeaturesContainer: {
        position: 'absolute',
        top: 385,
        left: 39,
        right: 39,
        alignItems: 'center',
        gap: 15,
    },

    welcomeFeatureCard: {
        width: '100%',
        backgroundColor: 'rgba(48, 51, 85, 0.22)',
        borderWidth: 1,
        borderColor: '#575A89',
        borderRadius: 10,
        paddingHorizontal: 11,
        paddingVertical: 13,
    },

    welcomeFeatureContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 13,
    },

    welcomeIconWrapper: {
        width: 35,
        height: 35,
    },

    welcomeGradientIcon: {
        width: 35,
        height: 35,
        borderRadius: 17.5,
        backgroundColor: 'rgba(100, 162, 247, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },

    welcomeIconImage: {
        width: 19,
        height: 19,
    },

    welcomeTextWrapper: {
        flex: 1,
        gap: 5,
    },

    welcomeFeatureTitle: {
        color: '#C2D7FF',
        fontSize: 10,
        fontFamily: 'System',
        fontWeight: '400',
        lineHeight: 11,
        marginTop: -1,
    },

    welcomeFeatureDescription: {
        color: '#FFFFFF',
        fontSize: 10,
        fontFamily: 'System',
        fontWeight: '500',
        lineHeight: 15,
    },

    welcomeButtonContainer: {
        position: 'absolute',
        bottom: 50,
        left: 39,
        right: 39,
        alignItems: 'center',
    },

    // === ОБЩИЕ СТИЛИ ===
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },

    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});