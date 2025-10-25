import {
    StyleSheet
} from 'react-native';


export const styles = StyleSheet.create({
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

});