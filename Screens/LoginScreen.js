import React, { useState, useContext } from 'react';
import { StyleSheet, SafeAreaView, TextInput, Text, View, Keyboard, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, signInWithEmailAndPassword, get, ref, database } from '../Firebase/firebase';
import { AuthContext } from '../Tools/AuthContext';
import { useTheme } from '../Tools/ThemeContext'; // Import ThemeContext
import colors from '../Tools/theme'; // Import the colors from theme.js

function LoginScreen(props) {
  const navigation = useNavigation();
  const { theme } = useTheme(); // Use theme from context
  const currentColors = colors[theme]; // Use colors from the current theme

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useContext(AuthContext);

  const onChangeEmail = (emailText) => {
    setEmail(emailText);
  };

  const onChangePassword = (passwordText) => {
    setPassword(passwordText);
  };

  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Login successful!',
      visibilityTime: 2000,
      autoHide: true,
    });
  };

const handleLogin = async () => {
  Keyboard.dismiss();
  setLoading(true);
  setErrorMessage(''); // Reset error message on each attempt
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    const usersRef = ref(database, `users/${uid}`);
    const snapshot = await get(usersRef);

    if (snapshot.exists()) {
      const userData = snapshot.val();
      const firstName = userData.firstName || '';
      const lastName = userData.lastName || '';
      const fullName = `${firstName} ${lastName}`.trim();
      const role = userData.role || 'user'; // 🚀 get role

      await AsyncStorage.setItem('uid', uid);
      await AsyncStorage.setItem('firstName', firstName);
      await AsyncStorage.setItem('lastName', lastName);

      login(uid, fullName, role); // 🚀 pass role into login
      showToast();
    } else {
      setErrorMessage('User record not found.');
    }
  } catch (error) {
    let errorMsg = '';
    switch (error.code) {
      case 'auth/invalid-email':
        errorMsg = 'The email address is not valid. Please check and try again.';
        break;
      case 'auth/user-disabled':
        errorMsg = 'This account has been disabled. Please contact support.';
        break;
      case 'auth/user-not-found':
        errorMsg = 'No account found with this email. Please check and try again.';
        break;
      case 'auth/wrong-password':
        errorMsg = 'Incorrect password. Please try again.';
        break;
      case 'auth/network-request-failed':
        errorMsg = 'Network error. Please check your internet connection and try again.';
        break;
      default:
        errorMsg = 'Wrong email or password, please try again.';
    }
    setErrorMessage(errorMsg);
  } finally {
    setLoading(false);
  }
};


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentColors.background }]}>
      <View style={styles.headerContainer}>
        <Ionicons name="lock-closed" size={32} color={currentColors.accent} />
        <Text style={[styles.heading, { color: currentColors.text }]}>Fill in the form below to login</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          placeholder="Enter email:"
		   placeholderTextColor={currentColors.text}
          style={[styles.input, { borderColor: currentColors.border, backgroundColor: currentColors.inputBackground, color: currentColors.text, }]}
          onChangeText={onChangeEmail}
          value={email}
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Enter password:"
			 placeholderTextColor={currentColors.text}
            style={[styles.input, { borderColor: currentColors.border, backgroundColor: currentColors.inputBackground, color: currentColors.text, }]}
            onChangeText={onChangePassword}
            value={password}
            autoCapitalize="none"
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color={currentColors.text} />
          </TouchableOpacity>
        </View>

        {errorMessage ? (
          <Text style={[styles.errorText]}>{errorMessage}</Text>
        ) : null}

        <TouchableOpacity onPress={handleLogin} style={[styles.button, { backgroundColor: currentColors.accent }]}>
          {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
        </TouchableOpacity>

        <View style={styles.orContainer}>
          <View style={styles.line} />
          <Text style={[styles.orText, { color: currentColors.text }]}>or</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={[styles.button, { backgroundColor: currentColors.accent }]}>
          <Text style={styles.buttonText}>Signup</Text>
        </TouchableOpacity>
      </View>

      <Toast position="bottom" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    width: '100%',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  errorText: {
    marginBottom: 10,
    fontSize: 14,
    fontWeight: 'bold',
    padding: 5,
	color: 'red',
  },
  button: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginBottom: 20,
    width: '100%',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  orText: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
});

export default LoginScreen;
