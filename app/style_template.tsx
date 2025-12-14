import {
    Dimensions,
    Platform,
    StyleSheet
} from 'react-native';

const { width, height } = Dimensions.get('window');

const CARD_WIDTH = Math.min(width * 1, 350); // 85% от ширины экрана, но не больше 350
const CARD_HEIGHT = height * 0.63; // 63% от высоты экрана
const CARD_TOP_MARGIN = height * 0.12; // 12% сверху
const CARD_HORIZONTAL_MARGIN = (width - CARD_WIDTH) / 2; // Автоматический расчет боковых отступов

const PHOTO_HEIGHT = CARD_WIDTH * 0.95; // 95% от ширины карточки
const BOTTOM_HEIGHT = CARD_WIDTH * 0.66; // 66% от ширины карточки
const CARD_TOTAL_HEIGHT = PHOTO_HEIGHT + BOTTOM_HEIGHT + 10;
const BUTTONS_BELOW_CARD = CARD_TOP_MARGIN + CARD_TOTAL_HEIGHT + 20; // 20px под карточкой

const dynamicFontSize = {
    small: Math.max(width * 0.035, 12),
    medium: Math.max(width * 0.04, 14),
    large: Math.max(width * 0.045, 16),
    xlarge: Math.max(width * 0.05, 18),
    xxlarge: Math.max(width * 0.055, 20),
};

const dynamicIconSize = {
    small: Math.max(width * 0.06, 24),
    medium: Math.max(width * 0.07, 28),
    large: Math.max(width * 0.08, 32),
};

const dynamicSpacing = {
    small: Math.max(width * 0.02, 8),
    medium: Math.max(width * 0.03, 12),
    large: Math.max(width * 0.04, 16),
    xlarge: Math.max(width * 0.05, 20),
};

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

    radioCircleMale: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
    },

    radioCircleFemale: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#E91E63',
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
        color: '#ffffffff',
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
    },

    // Заголовок "Критерии подбора"
    headerTitle: {
        position: 'absolute',
        left: 0, 
        right: 0, 
        top: 52,
        color: '#FFFFFF',
        fontSize: dynamicFontSize.large, 
        fontFamily: 'Poppins-SemiBold',
        fontWeight: '600',
        letterSpacing: 0.4,
        textAlign: 'center',
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

// Верхний прямоугольник 393×61
rectangleTop: {
    position: 'absolute',
    top: 0,
    left: (Dimensions.get('window').width - 393) / 2,
    width: 393,
    height: 61,
    backgroundColor: 'rgba(0, 2, 10, 0.8)',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
    zIndex: 5,
},
// Нижний прямоугольник как изображение (с сохранением пропорций)
rectangleBottomImage: {
    position: 'absolute',
    top: 0,
    left: -22,
    right: 0,
    width: Dimensions.get('window').width + 44,
    height: 200,
    zIndex: 4,
    resizeMode: 'cover', 
},

// Эффект рассеивания для нижнего прямоугольника
textureOverlay: {
    width: '100%',
    height: '100%',
    backgroundColor: '#001230',
    // Эффект рассеивания через тень
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 100,
    elevation: 20,
},

swipeContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 107,
    zIndex: 10,
},

// Обновленная карточка - центрированная
swipeCard: {
    position: 'absolute',
    backgroundColor: '#00020A',
    width: 328,
    height: 548,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    // Центрирование по x
    left: (Dimensions.get('window').width - 328) / 2,
    top: 87,
    zIndex: 10,
},

// Верхняя секция (фото)
cardTopSection: {
    width: 318,
    height: 312,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden',
    marginHorizontal: 5,
    marginTop: 5,
    position: 'relative',
},

cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
},

noImageContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#313456',
    justifyContent: 'center',
    alignItems: 'center',
},

// Имя и возраст
nameAgeContainer: {
    position: 'absolute',
    top: 250,
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
    top: 280,
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
    width: 318,
    height: 217,
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
    height: 217,
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
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    lineHeight: 18,
    marginTop: 8,
    width: 295,
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

// Обновленные кнопки действий - центрированные
actionButtons: {
    position: 'absolute',
    top: 659,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
},

dislikeButtonNew: {
    width: 61,
    height: 61,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 54,
},

dislikeIcon: {
    width: 61,
    height: 61,
},

likeButtonNew: {
    width: 74,
    height: 74,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -6,
},

likeIcon: {
    width: 74,
    height: 74,
},

// Нижняя панель
bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 1,
    right: 1,
    width: Dimensions.get('window').width - 2,
    height: 107,
    backgroundColor: 'rgba(0, 2, 10, 0.5)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 21,
    paddingHorizontal: 42,
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    overflow: 'hidden',
    zIndex: 20,
},

bottomPanelButton: {
    alignItems: 'center',
    width: 70,
},

bottomPanelIcon: {
    width: 55,
    height: 55,
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
    width: 64,
    height: 64,
    marginTop: -5,
},

centerPanelIcon: {
    width: 64,
    height: 64,
},

// Экран "нет больше профилей"
noMoreContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginBottom: 107,
    zIndex: 10,
},

noMoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
},

noMoreSubtext: {
    fontSize: 16,
    color: '#6472BD',
    textAlign: 'center',
    marginBottom: 16,
},

// Кнопки для переключения профилей
showAllButton: {
    backgroundColor: '#63A3F8',
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


//СТИЛИ PROFILE
    // Стили для даты рождения
    placeholderText: {
        fontSize: 16,
        color: '#666',
    },
    ageText: {
        position: 'absolute',
        right: 12,
        fontSize: 14,
        color: '#8090E4',
        fontWeight: '500',
    },
    
    // Стили для модального окна с DatePicker
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    
    datePickerContainer: {
        backgroundColor: '#212136ff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 20,
        paddingBottom: Platform.OS === 'ios' ? 30 : 20,
        borderColor: '#383957ff',
        shadowColor: '#ffffffff',
        shadowOffset: {
            width: 2,
            height: 4,
        },
    },

    iosButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },

    iosButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },

    iosButtonText: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '600',
    },

    profileHeader: {
        position: 'absolute',
        top: 5,
        left: 0,
        right: 0,
        height: 100,
        backgroundColor: 'rgba(0, 2, 10, 0.8)',
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 44,
    },

    profileBackButton: {
        position: 'absolute',
        left: dynamicSpacing.large,
        top: 46,
        zIndex: 11,
        padding: dynamicSpacing.small
    },

    profileBackIcon: {
        width: dynamicIconSize.small * 1.5,
        height: dynamicIconSize.small * 1.5,
        tintColor: '#6472BD',
    },

    profileTitleContainer: {
        backgroundColor: 'transparent',
    },

    profileTitleText: {
        fontSize: dynamicFontSize.large,
        fontFamily: 'Poppins-Bold',
        fontWeight: '700',
        letterSpacing: 0.4,
        color: '#FFFFFF',
        textAlign: 'center',
    },

    profileScrollContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        marginTop: 88,
    },

    profileScrollContent: {
        paddingBottom: dynamicSpacing.xlarge * 3,
        paddingTop: dynamicSpacing.large,
        paddingHorizontal: dynamicSpacing.large,
    },

    // Аватар с кнопкой загрузки фото
    profilePhotoSection: {
        backgroundColor: 'rgba(49, 52, 86, 0.22)',
        borderWidth: 1,
        borderColor: '#585A89',
        borderRadius: 20,
        padding: dynamicSpacing.large,
        alignItems: 'center',
        marginBottom: dynamicSpacing.large,
        marginTop: 10
    },

    profileImageContainer: {
        width: width * 0.3,
        height: width * 0.3,
        maxWidth: 120,
        maxHeight: 120,
        minWidth: 90,
        minHeight: 90,
        borderRadius: width * 0.15,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderWidth: 0,
        borderColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginBottom: dynamicSpacing.medium,
        opacity: 1,
        
    },

    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: width * 0.15,
    },

    profileEmptyImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: width * 0.15, // Совпадает с радиусом контейнера
        overflow: 'hidden', // Обрезаем иконку по контуру
    },

    profileImageIcon: {
        width: '100%',
        height: '100%',
        //tintColor: '#6472BD',
    },

    profileAddImageButton: {
        position: 'absolute',
        bottom: dynamicSpacing.small * 0.1,
        right: dynamicSpacing.small * 0.1,
        width: dynamicIconSize.medium,
        height: dynamicIconSize.medium,
        borderRadius: dynamicIconSize.medium / 2,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

    profileAddImageGradient: {
        width: '100%',
        height: '100%',
        backgroundColor: '#8090E4',
        justifyContent: 'center',
        alignItems: 'center',
    },

    cameraIcon: {
        width: '50%',
        height: '50%',
        tintColor: '#FFFFFF',
    },

    profileImageText: {
        color: '#FFFFFF',
        fontSize: dynamicFontSize.medium,
        fontFamily: 'Poppins-Medium',
        fontWeight: '500',
        letterSpacing: 0.4,
        textAlign: 'center',
        opacity: 0.8,
    },

    profileSection: {
        backgroundColor: 'rgba(49, 52, 86, 0.22)',
        borderWidth: 1,
        borderColor: '#585A89',
        borderRadius: 20,
        padding: dynamicSpacing.large,
        marginBottom: dynamicSpacing.large,
    },

    sectionTitle: {
        color: '#FFFFFF',
        fontSize: dynamicFontSize.large,
        fontFamily: 'Poppins-SemiBold',
        fontWeight: '600',
        letterSpacing: 0.4,
        marginBottom: dynamicSpacing.medium * 0.4,
    },

    sectionSubtitle: {
        color: '#C2CCFF',
        fontSize: dynamicFontSize.small,
        fontFamily: 'Poppins-Regular',
        fontWeight: '400',
        letterSpacing: 0.4,
        marginBottom: dynamicSpacing.medium,
        marginTop: -dynamicSpacing.small * 0.9,
    },

    profileSkillsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: dynamicSpacing.small,
        padding: 0,
        marginTop: 0,
    },

    nameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: dynamicSpacing.medium,
        marginBottom: dynamicSpacing.large,
    },

    nameInputContainer: {
        flex: 1,
    },

    profileInputContainer: {
        marginBottom: dynamicSpacing.small,
    },

    profileInputLabel: {
        color: '#FFFFFF',
        fontSize: dynamicFontSize.medium,
        fontFamily: 'Poppins-SemiBold',
        fontWeight: '600',
        letterSpacing: 0.4,
        marginBottom: dynamicSpacing.small,
        marginLeft: dynamicSpacing.small,
    },

    inputWrapperWithIcon: {
        backgroundColor: 'rgba(49, 52, 86, 0.4)',
        borderWidth: 1,
        borderColor: '#585A89',
        borderRadius: 10,
        paddingHorizontal: dynamicSpacing.large,
        paddingVertical: 0, // Убираем вертикальный padding
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: dynamicIconSize.medium, // Уменьшаем с large на medium
        height: dynamicIconSize.medium * 1.8, // Фиксированная меньшая высота
        width: '100%',
        alignSelf: 'stretch',
        justifyContent: 'center',
    },

    inputIcon: {
        width: dynamicIconSize.small,
        height: dynamicIconSize.small,
        marginRight: dynamicSpacing.small,
        tintColor: '#6472BD',
        flexShrink: 0,
        resizeMode: 'contain'
    },

    profileInput: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: dynamicFontSize.medium,
        fontFamily: 'Poppins-Regular',
        letterSpacing: 0.4,
        paddingVertical: dynamicSpacing.medium, // Добавляем padding внутрь TextInput
        paddingHorizontal: 0,
        textAlignVertical: 'center',
        includeFontPadding: false,
        minHeight: dynamicIconSize.large * 1.5,
    },

    profileInputPlaceholder: {
        color: '#6472BD',
        fontSize: dynamicFontSize.medium,
        fontFamily: 'Poppins-Regular',
        letterSpacing: 0.4,
        flex: 1,
    },

    profileInputText: {
        color: '#FFFFFF',
        fontSize: dynamicFontSize.medium,
        fontFamily: 'Poppins-Regular',
        letterSpacing: 0.4,
        flex: 1,
    },

    profileAgeText: {
        fontSize: dynamicFontSize.small,
        color: '#8090E4',
        fontFamily: 'Poppins-Medium',
        fontWeight: '500',
        marginLeft: dynamicSpacing.small,
    },

    profileGenderContainer: {
        flexDirection: 'row',
        gap: dynamicSpacing.large,
        marginTop: dynamicSpacing.small,
        justifyContent: 'space-between',
    },

    profileGenderOptionSelectedMale: {
        backgroundColor: 'rgba(49, 52, 86, 0.5)',
        borderColor: '#007AFF',
    },

    profileGenderOptionSelectedFemale: {
        backgroundColor: 'rgba(49, 52, 86, 0.5)',
        borderColor: '#E91E63',
    },

    profileRadioCircleSelectedMale: {
        borderColor: '#007AFF',
    },

    profileRadioCircleSelectedFemale: {
        borderColor: '#E91E63',
    },

    profileRadioDot: {
        width: dynamicIconSize.small * 0.4,
        height: dynamicIconSize.small * 0.4,
        borderRadius: (dynamicIconSize.small * 0.4) / 2,
        backgroundColor: '#8090E4',
    },

    profileGenderLabel: {
        color: '#ffffffff',
        fontSize: dynamicFontSize.medium,
        fontFamily: 'Poppins-Regular',
        letterSpacing: 0.4,
    },

    profileGenderLabelSelected: {
        color: '#FFFFFF',
        fontWeight: '500',
    },

    profileBioWrapper: {
        backgroundColor: 'rgba(49, 52, 86, 0.4)',
        borderWidth: 1,
        borderColor: '#585A89',
        borderRadius: 10,
        padding: dynamicSpacing.medium,
        flexDirection: 'row',
        alignItems: 'flex-start',
        minHeight: width * 0.25,
    },

    profileBioInput: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: dynamicFontSize.medium,
        fontFamily: 'Poppins-Regular',
        letterSpacing: 0.4,
        padding: 0,
        height: width * 0.2,
        textAlignVertical: 'top',
    },

    profileSkillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: dynamicSpacing.small,
        marginBottom: dynamicSpacing.large,
    },

    profileSkillTag: {
        paddingHorizontal: dynamicSpacing.medium,
        paddingVertical: dynamicSpacing.small,
        borderRadius: 25,
        backgroundColor: 'rgba(49, 52, 86, 0.3)',
        borderWidth: 1,
        borderColor: '#585A89',
    },

    profileSkillTagSelected: {
        backgroundColor: 'rgba(128, 144, 228, 0.3)',
        borderColor: '#8090E4',
    },

    profileSkillTagText: {
        color: '#FFFFFF',
        fontSize: dynamicFontSize.small,
        fontFamily: 'Poppins-Regular',
        letterSpacing: 0.4,
    },

    profileSkillTagTextSelected: {
        color: '#8090E4',
        //fontWeight: '500',
    },

    profileInputHint: {
        color: '#6472BD',
        fontSize: dynamicFontSize.small,
        fontFamily: 'Poppins-Regular',
        letterSpacing: 0.4,
        marginBottom: dynamicSpacing.small,
        marginLeft: dynamicSpacing.small,
    },

    saveButtonContainer: {
        alignItems: 'center',
        marginTop: dynamicSpacing.xlarge,
        marginBottom: dynamicSpacing.xlarge * 0.4,
    },

    bioInputContainer: {
        backgroundColor: 'rgba(49, 52, 86, 0.4)',
        borderWidth: 1,
        borderColor: '#585A89',
        borderRadius: 10,
        padding: dynamicSpacing.medium,
        flexDirection: 'row',
        alignItems: 'flex-start',
        minHeight: width * 0.25,
    },

    bioInput: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: dynamicFontSize.medium,
        fontFamily: 'Poppins-Regular',
        letterSpacing: 0.4,
        padding: 0,
        height: width * 0.2,
        textAlignVertical: 'top',
    },

    profileGenderOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: dynamicSpacing.medium,
        padding: dynamicSpacing.medium,
        borderRadius: 12,
        backgroundColor: 'rgba(49, 52, 86, 0.4)',
        borderWidth: 1,
        borderColor: '#585A89',
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: dynamicSpacing.small,
        minHeight: dynamicIconSize.large * 1.2,
    },

    genderOptionSelectedMale: {
        backgroundColor: 'rgba(49, 52, 86, 0.5)',
        borderColor: '#007AFF',
        borderWidth: 2,
    },

    genderOptionSelectedFemale: {
        backgroundColor: 'rgba(49, 52, 86, 0.5)',
        borderColor: '#E91E63',
        borderWidth: 2,
    },

    profileRadioCircle: {
        width: dynamicIconSize.medium * 0.8,
        height: dynamicIconSize.medium * 0.8,
        borderRadius: (dynamicIconSize.medium * 0.8) / 2,
        borderWidth: 2,
        borderColor: '#6472BD',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent'
    },

    radioCircleSelectedMale: {
        borderColor: '#007AFF',
    },

    radioCircleSelectedFemale: {
        borderColor: '#E91E63',
    },

    radioDotMale: {
        width: dynamicIconSize.small * 0.4,
        height: dynamicIconSize.small * 0.4,
        borderRadius: (dynamicIconSize.small * 0.4) / 2,
        backgroundColor: '#007AFF',
    },

    radioDotFemale: {
        width: dynamicIconSize.small * 0.4,
        height: dynamicIconSize.small * 0.4,
        borderRadius: (dynamicIconSize.small * 0.4) / 2,
        backgroundColor: '#E91E63',
    },

    inputHint: {
        color: '#C2CCFF',
        fontSize: dynamicFontSize.small,
        fontFamily: 'Poppins-Regular',
        letterSpacing: 0.4,
        marginBottom: dynamicSpacing.small,
        marginLeft: dynamicSpacing.small,
    },

        // === СТИЛИ ДЛЯ PROFILE SCREEN ===

    // Основной контейнер
    profileScreenContainer: {
        flex: 1,
        backgroundColor: '#00020A',
    },

    // Хэдер профиля
    profileScreenHeader: {
        position: 'absolute',
        top: 8,
        left: 0,
        right: 0,
        height: 88,
        backgroundColor: 'rgba(0, 2, 10, 0.8)',
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 44,
    },

    profileScreenBackButton: {
        position: 'absolute',
        left: dynamicSpacing.large,
        top: 31,
        zIndex: 11,
        padding: dynamicSpacing.medium,
    },

    profileScreenBackIcon: {
        width: dynamicIconSize.medium * 1.3 ,
        height: dynamicIconSize.medium * 1.3 ,
        tintColor: '#6472BD',
    },

    profileScreenTitle: {
        fontSize: dynamicFontSize.large,
        fontFamily: 'Poppins-Bold',
        fontWeight: '700',
        letterSpacing: 0.4,
        color: '#FFFFFF',
        textAlign: 'center',
    },

    profileScreenEditButton: {
        position: 'absolute',
        right: dynamicSpacing.large,
        top: 46,
        zIndex: 11,
        padding: dynamicSpacing.small,
    },

    profileScreenEditIcon: {
        width: dynamicIconSize.small,
        height: dynamicIconSize.small,
        tintColor: '#8090E4',
    },

    // Основной контент
    profileScreenScrollContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        marginTop: 88,
    },

    profileScreenScrollContent: {
        paddingBottom: dynamicSpacing.xlarge * 2,
        paddingTop: dynamicSpacing.large,
        paddingHorizontal: dynamicSpacing.large,
    },

    // Аватар секция
    profileScreenAvatarSection: {
        backgroundColor: 'rgba(49, 52, 86, 0.22)',
        borderWidth: 1,
        borderColor: '#585A89',
        borderRadius: 20,
        padding: dynamicSpacing.large,
        alignItems: 'center',
        marginBottom: dynamicSpacing.large,
    },

    profileScreenAvatarContainer: {
        width: width * 0.25,
        height: width * 0.25,
        maxWidth: 120,
        maxHeight: 120,
        minWidth: 90,
        minHeight: 90,
        borderRadius: width * 0.125,
        backgroundColor: 'rgba(49, 52, 86, 0.73)',
        borderWidth: 3,
        borderColor: 'rgba(88, 90, 137, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: dynamicSpacing.medium,
        overflow: 'hidden',
    },

    profileScreenAvatar: {
        width: '100%',
        height: '100%',
        borderRadius: width * 0.125,
    },

    profileScreenUserName: {
        color: '#FFFFFF',
        fontSize: dynamicFontSize.xlarge,
        fontFamily: 'Poppins-Bold',
        fontWeight: '700',
        letterSpacing: 0.4,
        marginBottom: dynamicSpacing.small,
        textAlign: 'center',
    },

    profileScreenUserEmail: {
        color: '#6472BD',
        fontSize: dynamicFontSize.medium,
        fontFamily: 'Poppins-Medium',
        fontWeight: '500',
        letterSpacing: 0.4,
        textAlign: 'center',
    },

    // Секция информации
    profileScreenInfoSection: {
        gap: dynamicSpacing.large,
    },

    profileScreenInfoCard: {
        backgroundColor: 'rgba(49, 52, 86, 0.22)',
        borderWidth: 1,
        borderColor: '#585A89',
        borderRadius: 20,
        padding: dynamicSpacing.large,
    },

    profileScreenInfoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: dynamicSpacing.medium,
        gap: dynamicSpacing.small,
    },

    profileScreenInfoIcon: {
        width: dynamicIconSize.small * 0.8,
        height: dynamicIconSize.small * 0.8,
        tintColor: '#8090E4',
        resizeMode: 'contain',
    },

    profileScreenInfoTitle: {
        color: '#FFFFFF',
        fontSize: dynamicFontSize.large,
        fontFamily: 'Poppins-SemiBold',
        fontWeight: '600',
        letterSpacing: 0.4,
    },

    profileScreenInfoValue: {
        color: '#C2CCFF',
        fontSize: dynamicFontSize.medium,
        fontFamily: 'Poppins-Regular',
        fontWeight: '400',
        letterSpacing: 0.4,
        lineHeight: dynamicFontSize.medium * 1.4,
    },

    // Дата рождения и возраст
    profileScreenBirthDateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: dynamicSpacing.small,
    },

    profileScreenBirthDateText: {
        color: '#FFFFFF',
        fontSize: dynamicFontSize.medium,
        fontFamily: 'Poppins-Regular',
        fontWeight: '400',
        letterSpacing: 0.4,
        flex: 1,
    },

    profileScreenAgeBadge: {
        backgroundColor: 'rgba(128, 144, 228, 0.3)',
        borderWidth: 1,
        borderColor: '#8090E4',
        borderRadius: 12,
        paddingHorizontal: dynamicSpacing.medium,
        paddingVertical: dynamicSpacing.small,
        marginLeft: dynamicSpacing.small,
    },

    profileScreenAgeText: {
        color: '#8090E4',
        fontSize: dynamicFontSize.small,
        fontFamily: 'Poppins-SemiBold',
        fontWeight: '600',
        letterSpacing: 0.4,
    },

    // Теги навыков и увлечений
    profileScreenTagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: dynamicSpacing.small,
        marginTop: dynamicSpacing.small,
    },

    profileScreenSkillTag: {
        backgroundColor: 'rgba(27, 37, 146, 0.4)',
        borderWidth: 1,
        borderColor: '#7c7eb8ff',
        borderRadius: 20,
        paddingHorizontal: dynamicSpacing.medium,
        paddingVertical: dynamicSpacing.small,
        marginBottom: dynamicSpacing.small,
    },

    profileScreenSkillText: {
        color: '#FFFFFF',
        fontSize: dynamicFontSize.small,
        fontFamily: 'Poppins-Regular',
        fontWeight: '400',
        letterSpacing: 0.4,
        textAlign: 'center',
    },

    profileScreenHobbyTag: {
        backgroundColor: 'rgba(233, 30, 99, 0.2)',
        borderWidth: 1,
        borderColor: '#E91E63',
        borderRadius: 20,
        paddingHorizontal: dynamicSpacing.medium,
        paddingVertical: dynamicSpacing.small,
        marginBottom: dynamicSpacing.small,
    },

    profileScreenHobbyText: {
        color: '#FF80AB',
        fontSize: dynamicFontSize.small,
        fontFamily: 'Poppins-Regular',
        fontWeight: '400',
        letterSpacing: 0.4,
        textAlign: 'center',
    },

    // Секция действий
    profileScreenActionsSection: {
        marginTop: dynamicSpacing.xlarge,
        gap: dynamicSpacing.medium,
    },

    profileScreenEditProfileButton: {
        backgroundColor: 'rgba(128, 144, 228, 0.3)',
        borderWidth: 1,
        borderColor: '#8090E4',
        borderRadius: 60,
        paddingVertical: dynamicSpacing.large,
        paddingHorizontal: dynamicSpacing.xlarge,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: dynamicSpacing.medium,
    },

    profileScreenEditProfileText: {
        color: '#8090E4',
        fontSize: dynamicFontSize.medium,
        fontFamily: 'Poppins-SemiBold',
        fontWeight: '600',
        letterSpacing: 0.4,
    },

    profileScreenLogoutButton: {
        backgroundColor: 'rgba(49, 52, 86, 0.3)',
        borderWidth: 1,
        borderColor: '#585A89',
        borderRadius: 60,
        paddingVertical: dynamicSpacing.large,
        paddingHorizontal: dynamicSpacing.xlarge,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: dynamicSpacing.medium,
    },

    profileScreenLogoutText: {
        color: '#FF6B6B',
        fontSize: dynamicFontSize.medium,
        fontFamily: 'Poppins-SemiBold',
        fontWeight: '600',
        letterSpacing: 0.4,
    },

    // Нет информации
    profileScreenNoInfoText: {
        color: '#6472BD',
        fontSize: dynamicFontSize.medium,
        fontFamily: 'Poppins-Regular',
        fontWeight: '400',
        letterSpacing: 0.4,
        fontStyle: 'italic',
    },
});