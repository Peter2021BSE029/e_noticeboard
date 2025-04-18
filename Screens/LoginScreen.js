import React, { useState, useContext } from 'react';
import { StyleSheet, SafeAreaView, TextInput, Button, Alert, Text, View, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, signInWithEmailAndPassword, get, ref, database, sendEmailVerification } from '../Firebase/firebase';
//import { AuthContext } from '../Tools/AuthContext';

function LoginScreen(props) {
  const navigation = useNavigation();
  //const { login } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const onChangeEmail = (emailText) => {
    setEmail(emailText);
  };

  const [password, setPassword] = useState('');
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
    if (email === '' || password === '') {
      alert("Please ensure that you've filled all fields!");
      return;
    }
    try {
      Keyboard.dismiss();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        Alert.alert(
          "Email Not Verified",
          "Please verify your email address before logging in. Check your inbox for the verification link.",
          [
            {
              text: "Resend Email",
              onPress: async () => {
                try {
                  //await user.sendEmailVerification();
                  await sendEmailVerification(user);
                  Alert.alert("Verification Email Sent", "A new verification link has been sent to your email address.");
                } catch (error) {
                  Alert.alert("Error Resending Email", error.message);
                }
              },
            },
            {
              text: "OK",
              style: "cancel",
            },
          ]
        );
        await auth.signOut(); // Sign out the unverified user
        return; // Stop the login process
      }

      const uid = user.uid;
      const usersRef = ref(database, `users/${uid}`);
      const snapshot = await get(usersRef);
      //const name = snapshot.val()?.name; // Use optional chaining in case name is not immediately available
      const name = snapshot.val().name;

      await AsyncStorage.setItem('uid', uid);   //used in applying for posting
      //await AsyncStorage.setItem('name', name || ''); // Store name, default to empty string if null
      await AsyncStorage.setItem('name', name);

      showToast();
      setTimeout(() => navigation.navigate('Home'), 2500);
      //login(uid); // Assuming your AuthContext's login function handles setting authentication state
    }
    catch (error) {
      if (error.message === 'Firebase: Error (auth/invalid-credential).') {
        Alert.alert('Login Error', "Invalid Login credentials, try again or sign up if you haven't yet.");
      } else if (error.message === 'Firebase: Error (auth/network-request-failed).') {
        Alert.alert('Login Error', "Please ensure you are connected to the internet");
      } else {
        Alert.alert('Error', error.message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons name="lock-closed" size={32} color="#5856D6" />
        <Text style={styles.heading}>Fill in the form below to login</Text>
      </View>
      <View style={styles.formContainer}>
        <TextInput
          placeholder='Enter email:'
          style={styles.input}
          onChangeText={onChangeEmail}
          value={email}
          autoCapitalize='none'
          keyboardType="email-address"
          autoCorrect={false}
        />
        <TextInput
          placeholder='Enter password:'
          style={styles.input}
          onChangeText={onChangePassword}
          value={password}
          autoCapitalize='none'
          secureTextEntry
        />
        <Button title="Login" onPress={handleLogin} color="#5856D6" />
        <View style={styles.orContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.line} />
        </View>
        <Button title="Signup" onPress={() => navigation.navigate("Signup")} color="#5856D6" />
      </View>
      <Toast position='bottom' />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  orText: {
    fontSize: 16,
    color: '#333',
    marginHorizontal: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
});

export default LoginScreen;