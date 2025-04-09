import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { auth, signInWithEmailAndPassword, ref, set, database, onValue } from '../Firebase/firebase'; // Import Firebase modules

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [cpassword, setPassword] = useState('');

  const handleLogin = () => {
    // Authenticate user with Firebase
    signInWithEmailAndPassword(auth, email, cpassword)
      .then((userCredential) => {
        const user = userCredential.user;
        Alert.alert('Login Successful', 'Welcome back!');

        // Fetch user role from the database
        const userRef = ref(database, `users/${user.uid}`);
        onValue(userRef, (snapshot) => {
          const userData = snapshot.val();
          if (userData && userData.role === 'admin') {
            navigation.navigate('Home'); // Navigate to Home screen for admin
          } else {
            Alert.alert('Access Denied', 'You do not have permission to add notices.');
          }
        });
      })
      .catch((error) => {
        Alert.alert('Login Failed', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={cpassword}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});

export default LoginScreen;