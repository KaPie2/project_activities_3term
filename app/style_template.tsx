import {
    Dimensions,
    StyleSheet
} from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    // === СУЩЕСТВУЮЩИЕ СТИЛИ ===
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
  
    footerText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#666',
    },
  
    link: {
        color: '#007AFF',
        fontWeight: 'bold',
    },

    buttonDisabled: {
        backgroundColor: '#cccccc',
    },

    // === НОВЫЕ СТИЛИ ДЛЯ WELCOME-СТРАНИЦЫ ===
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

    welcomeFirstCard: {
        marginTop: -4.5,
    },

    welcomeLastCard: {
        marginBottom: -4.5,
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
        fontFamily: 'PublicSans-Regular',
        fontWeight: '400',
        lineHeight: 11,
        marginTop: -1,
    },

    welcomeFeatureDescription: {
        color: '#FFFFFF',
        fontSize: 10,
        fontFamily: 'Poppins-Medium',
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

    // === ДОПОЛНИТЕЛЬНЫЕ УНИВЕРСАЛЬНЫЕ СТИЛИ ===
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