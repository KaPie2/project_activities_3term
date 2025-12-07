import {
    Dimensions,
    StyleSheet
} from 'react-native';

const { width, height } = Dimensions.get('window');

const CARD_WIDTH = Math.min(width * 1, 350); // 85% от ширины экрана, но не больше 328
const CARD_HEIGHT = height * 0.63; // 67% от высоты экрана
const CARD_TOP_MARGIN = height * 0.12; // 8% сверху
const CARD_HORIZONTAL_MARGIN = (width - CARD_WIDTH) / 2; // Автоматический расчет боковых отступов
const BUTTONS_TOP_MARGIN = height * 0.72; // Кнопки на 72% от верха
const BUTTONS_HORIZONTAL_CENTER = width * 0.5; // Центр экрана
const BUTTONS_HEIGHT_OFFSET = height * 0.65; // 65% от высоты экрана (ниже)
const BUTTONS_SPACING = width * 0.1; // 10% от ширины экрана (ближе)

const PHOTO_HEIGHT = CARD_WIDTH * 0.95; // 95% от ширины карточки
const BOTTOM_HEIGHT = CARD_WIDTH * 0.66; // 66% от ширины карточки
const CARD_TOTAL_HEIGHT = PHOTO_HEIGHT + BOTTOM_HEIGHT + 10;
const BUTTONS_BELOW_CARD = CARD_TOP_MARGIN + CARD_TOTAL_HEIGHT + 20; // 20px под карточкой

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

    // === СТИЛИ ДЛЯ ПОЛЯ ПОЛ ===
    genderContainer: {
        flexDirection: 'row',
        gap: 20,
        marginTop: 5,
    },

    genderOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    radioCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
    },

    radioSelected: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#007AFF',
    },

    genderLabel: {
        fontSize: 16,
        color: '#333',
    }, 

    // === СТИЛИ ДЛЯ ФИЛЬТРОВ (FILTERS) ===

    // Верхнее окошко с заголовком и кнопкой назад
    topHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 88,
        backgroundColor: 'rgba(0, 2, 10, 0.8)', // 00020A 80%
        zIndex: 6, // Самый высокий zIndex
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 44, // Для статус бара
    },

    // Кнопка назад
    backButton: {
        position: 'absolute',
        left: 27,
        top: 46,
        zIndex: 7,
    },

    backButtonCircle: {
        width: 35,
        height: 35,
        borderRadius: 17.5,
        backgroundColor: 'rgba(49, 52, 86, 0.22)', // 313456 22%
        borderWidth: 1.5,
        borderColor: '#6472BD', // stroke 6472BD
        justifyContent: 'center',
        alignItems: 'center',
    },

    backIcon: {
        width: 19,
        height: 11,
        // tintColor удален, чтобы отображать оригинальный цвет изображения
    },

    // Заголовок "Критерии подбора"
    headerTitle: {
        position: 'absolute',
        left: 116,
        top: 52,
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        fontWeight: '600',
        letterSpacing: 0.4,
    },

    filtersContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        position: 'relative',
        zIndex: 3, // Контейнер поверх кругов
    },

    // Контейнер для фоновых кругов
    filtersBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2, // Круги поверх BackgroundImage
    },

    // Базовые стили для всех кругов
    ellipse: {
        position: 'absolute',
        width: 400,
        height: 400,
        borderRadius: 200,
        borderWidth: 2,
        opacity: 0.8,
    },

    // Круг 1: x -141 y 750, fill 5B6288 20%, stroke 9CAAF4
    ellipse1: {
        left: -141,
        top: 750,
        backgroundColor: 'rgba(91, 98, 136, 0.2)', // 5B6288 20%
        borderColor: '#9CAAF4',
    },

    // Круг 2: x -242 y 662, stroke 9CAAF4 (только обводка)
    ellipse2: {
        left: -242,
        top: 662,
        backgroundColor: 'transparent',
        borderColor: '#9CAAF4',
    },

    // Круг 3: x 166 y -233, fill 5B6288 20%, stroke F2A3EC
    ellipse3: {
        left: 166,
        top: -233,
        backgroundColor: 'rgba(91, 98, 136, 0.2)', // 5B6288 20%
        borderColor: '#F2A3EC',
    },

    // Круг 4: x 77 y -282, stroke F2A3EC (только обводка)
    ellipse4: {
        left: 77,
        top: -282,
        backgroundColor: 'transparent',
        borderColor: '#F2A3EC',
    },

    // Основной контент (позиция x: 27, y: 176)
    filtersContent: {
        marginTop: 190, // позиция y: 176
        marginHorizontal: 27, // позиция x: 27
        marginBottom: 100, // оставляем место для кнопки
        zIndex: 4,
    },

    filtersTitleContainer: {
        marginBottom: 16,
        alignItems: 'center',
    },

    filtersMainTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontFamily: 'Poppins-Bold',
        fontWeight: '700',
        letterSpacing: 0.4,
        textAlign: 'center',
        marginBottom: 8,
    },

    filtersSubtitle: {
        color: '#6472BD',
        fontSize: 15,
        fontFamily: 'Poppins-Medium',
        fontWeight: '500',
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 20,
    },

    filtersOptionsContainer: {
        gap: 12,
        marginTop: 11,
        alignItems: 'center', // центрируем карточки
    },

    filtersOptionCard: {
        backgroundColor: 'rgba(49, 52, 86, 0.4)',
        borderWidth: 1,
        borderColor: '#585A89',
        borderRadius: 20,
        padding: 16,
        width: 339,
        position: 'relative',
    },

    filtersOptionCardSelected: {
        backgroundColor: 'rgba(49, 52, 86, 0.6)',
        borderColor: '#9CA4FF',
    },

    filtersOptionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        height: '100%',
    },

    filtersIconCircle: {
        width: 43,
        height: 43,
        borderRadius: 21.5,
        justifyContent: 'center',
        alignItems: 'center',
    },

    filtersOptionTextContainer: {
        flex: 1,
        gap: 4,
        justifyContent: 'center',
        minHeight: 43,
    },

    // Контейнер для третьего варианта
    thirdOptionContainer: {
        height: 71, // 103 - 16*2 = 71
        justifyContent: 'center',
        gap: 2,
    },

    // Заголовок для третьего варианта
    thirdOptionTitle: {
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
        fontWeight: '600',
        letterSpacing: 0.4,
        lineHeight: 21,
    },

    // Описание для третьего варианта
    thirdOptionDescription: {
        color: '#C2CCFF',
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        fontWeight: '400',
        letterSpacing: 0.4,
        lineHeight: 18,
        width: 200,
    },

    // Стили для первых двух вариантов
    filtersOptionTitle: {
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
        fontWeight: '600',
        letterSpacing: 0.4,
        lineHeight: 21,
    },

    filtersOptionDescription: {
        color: '#C2CCFF',
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        fontWeight: '400',
        letterSpacing: 0.4,
        lineHeight: 16,
    },

    // Радио кнопки
    filtersOptionRadio: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 1,
        borderColor: '#466382',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },

    filtersOptionRadioSelected: {
        // Цвет границы устанавливается динамически
    },

    filtersOptionRadioDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#466382', // Цвет будет установлен динамически
    },

    filtersInfoCard: {
        backgroundColor: '#0C1025',
        borderRadius: 15,
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 24,
        minHeight: 54,
        width: 339,
        alignSelf: 'center', // центрируем
    },

    filtersInfoIcon: {
        width: 16,
        height: 16,
        tintColor: '#97A1D5',
    },

    filtersInfoText: {
        flex: 1,
        color: '#97A1D5',
        fontSize: 10,
        fontFamily: 'Poppins-Regular',
        fontWeight: '400',
        letterSpacing: 0.4,
        lineHeight: 14,
    },

    filtersFooter: {
        position: 'absolute',
        bottom: 60,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 5, // Кнопка поверх всего
    },

    // Контейнер для кнопки 273×51
    filtersSaveButtonContainer: {
        width: 273,
        height: 51,
        borderRadius: 60,
        overflow: 'hidden',
        // Тень
        shadowColor: '#010124',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
    },

    // === СТИЛИ ДЛЯ SWIPE ЭКРАНА ===

    swipeContainer: {
        flex: 1,
        backgroundColor: 'transparent',
    },

    swipeContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 107,
    },

    // Новая карточка
    swipeCard: {
        position: 'absolute',
        backgroundColor: '#00020A',
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        top: CARD_TOP_MARGIN, 
        left: CARD_HORIZONTAL_MARGIN,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },

    // Верхняя секция
    cardTopSection: {
        width: CARD_WIDTH - 10,
        height: CARD_HEIGHT * 0.57,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        overflow: 'hidden',
        marginHorizontal: 5,
        marginTop: 5,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },

    cardImage: {
        width: '100%',
        height: '106%',
        resizeMode: 'cover',
        position: 'absolute', 
    },

    noImageContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: '#313456',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute', 
    },

    // Имя и возраст
    nameAgeContainer: {
        position: 'absolute',
        top: CARD_HEIGHT * 0.45,
        left: 16,
    },

    nameAgeText: {
        color: '#FFFFFF',
        fontSize: 25,
        fontFamily: 'Poppins-Medium',
        fontWeight: '500',
        lineHeight: 24,
        textShadowColor: 'rgba(0, 0, 0, 0.7)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },

    // Образование
    educationContainer: {
        position: 'absolute',
        top: CARD_HEIGHT * 0.51,
        left: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },

    educationIcon: {
        width: 19.61,
        height: 17.71,
    },

    facultyText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        fontWeight: '500',
        lineHeight: 20,
        textShadowColor: 'rgba(0, 0, 0, 0.7)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },

    // Нижняя секция
    cardBottomSection: {
        width: CARD_WIDTH - 10,
        height: CARD_HEIGHT * 0.4,
        backgroundColor: 'rgba(49, 52, 86, 0.22)',
        borderWidth: 1,
        borderColor: '#585A89',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        marginHorizontal: 5,
        marginTop: 5,
    },

    // Scroll view
    bottomSectionScroll: {
        width: '100%',
        height: CARD_HEIGHT * 0.4, // 🟢 ИЗМЕНЕНО
    },

    bottomSectionContent: {
        paddingHorizontal: 13,
        paddingTop: 12,
        paddingBottom: 20,
    },

    // О себе
    aboutSection: {
        marginBottom: 7,
    },

    aboutHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginLeft: 0,
    },

    aboutIcon: {
        width: 16,
        height: 20,
    },

    aboutTitle: {
        color: '#FFFFFF',
        fontSize: 15,
        fontFamily: 'Poppins-Medium',
        fontWeight: '500',
        lineHeight: 20,
    },

    bioText: {
        color: '#FFFFFF',
        fontSize: Math.min(width * 0.037, 14), // 🟢 ИЗМЕНЕНО
        fontFamily: 'Poppins-Medium',
        fontWeight: '500',
        lineHeight: 18,
        marginTop: 8,
        width: CARD_WIDTH - 30, // 🟢 ИЗМЕНЕНО
        marginLeft: 0,
        textAlign: 'left',
    },

    // Навыки
    skillsSection: {
        marginTop: 7,
    },

    skillsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginLeft: 0,
    },

    skillsIcon: {
        width: 18,
        height: 19.25,
    },

    skillsTitle: {
        color: '#FFFFFF',
        fontSize: 15,
        fontFamily: 'Poppins-Medium',
        fontWeight: '500',
        lineHeight: 20,
    },

    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
        marginLeft: 0,
        paddingRight: 17,
    },

    // Увлечения
    hobbiesSection: {
        marginTop: 7,
    },

    hobbiesHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginLeft: 0,
    },

    hobbiesIcon: {
        width: 15.88,
        height: 19.32,
    },

    hobbiesTitle: {
        color: '#FFFFFF',
        fontSize: 15,
        fontFamily: 'Poppins-Medium',
        fontWeight: '500',
        lineHeight: 20,
    },

    hobbiesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
        marginLeft: 0,
        paddingRight: 17,
    },

    // Овальные окошки
    skillTag: {
        paddingHorizontal: 15,
        paddingVertical: 6,
        height: 31,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
    },

    skillText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontFamily: 'Poppins-Regular',
        fontWeight: '400',
        lineHeight: 16,
    },

    hobbyTag: {
        paddingHorizontal: 15,
        paddingVertical: 6,
        height: 31,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
    },

    hobbyText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontFamily: 'Poppins-Regular',
        fontWeight: '400',
        lineHeight: 16,
    },

    // Кнопки действий
    actionButtons: {
        position: 'absolute',
        top: BUTTONS_BELOW_CARD + 10,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },

    dislikeButtonNew: {
        width: Math.min(width * 0.13, 58),
        height: Math.min(width * 0.13, 58),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: width * 0.08,
    },

    likeButtonNew: {
        width: Math.min(width * 0.16, 70),
        height: Math.min(width * 0.16, 70),
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: width * 0.08, 
    },

    dislikeIcon: {
        width: 61,
        height: 61,
    },

    likeIcon: {
        width: 74,
        height: 74,
    },

    // Нижняя панель
    bottomPanel: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        width: width,
        height: Math.max(height * 0.12, 107), // 🟢 ИЗМЕНЕНО (12% от высоты)
        backgroundColor: 'rgba(0, 2, 10, 0.5)',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingTop: Math.max(height * 0.025, 21), // 🟢 ИЗМЕНЕНО
        paddingHorizontal: Math.max(width * 0.1, 42), // 🟢 ИЗМЕНЕНО
        shadowColor: '#000000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
        overflow: 'hidden',
    },

    bottomPanelButton: {
        alignItems: 'center',
        width: 70,
    },

    bottomPanelIcon: {
        width: Math.min(width * 0.13, 55), // 🟢 ИЗМЕНЕНО (13% от ширины)
        height: Math.min(width * 0.13, 55), // 🟢 ИЗМЕНЕНО
        marginBottom: 8,
    },

    bottomPanelText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontFamily: 'Poppins-SemiBold',
        fontWeight: '600',
        textAlign: 'center',
    },

    centerPanelButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: Math.min(width * 0.15, 64), // 🟢 ИЗМЕНЕНО
        height: Math.min(width * 0.15, 64), // 🟢 ИЗМЕНЕНО
        marginTop: -5,
    },

    centerPanelIcon: {
        width: 64,
        height: 64,
    },

    // Индикаторы свайпа
    likeIndicator: {
        position: 'absolute',
        backgroundColor: '#4CD964',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: 'white',
        transform: [{ translateX: width - 100 }, { translateY: 20 }],
    },

    likeText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },

    dislikeIndicator: {
        position: 'absolute',
        backgroundColor: '#FF3B30',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: 'white',
        transform: [{ translateX: 20 }, { translateY: 20 }],
    },

    dislikeText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },

    // Экран "нет больше профилей"
    noMoreContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginTop: CARD_TOP_MARGIN, 
        marginBottom: 107,
    },

    noMoreText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },

    noMoreSubtext: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 16,
    },

    // Кнопки для переключения профилей
    showAllButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        marginTop: 16,
    },

    showAllButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },

    refreshButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        marginTop: 16,
    },

    refreshButtonText: {
        color: '#007AFF',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
    },
});