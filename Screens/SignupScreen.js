import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, TextInput, Button, Alert, View, Text, Keyboard} from 'react-native';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { auth, createUserWithEmailAndPassword, database, ref, set } from '../Firebase/firebase';

function SignupScreen(props) {
  const navigation = useNavigation();
  
  const [email, setEmail] = useState('');
  const onChangeEmail = (newText) => {
      setEmail(newText);
  };

  const [password, setPassword] = useState('');
  const onChangePassword = (newText) => {
      setPassword(newText);
  };

  const [passwordConfirm, setPasswordConfirm] = useState('');
  const onChangePasswordConfirm = (newText) => {
      setPasswordConfirm(newText);
  };

  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Signup successful!',
      visibilityTime: 2000,
      autoHide: true,
    });
  };

  const handleSignup = async () => {
    if (password === passwordConfirm) {
      try {
          // Create user email-password firebase account
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const uid = userCredential.user.uid;

          // Add user to realtime firebase database
          const userData = {
              email,
              role: "creator"
              //userId: uid,
          };

          // Set user data to a new node under "users" with a uid as the key
          set( ref(database, 'users/' + uid), userData );

          Keyboard.dismiss();
          showToast();
          setTimeout(() => navigation.navigate('Notice'), 2500);
          //navigation.navigate('Login')
      }
      catch (error) {
        if (error.message === 'Firebase: Error (auth/network-request-failed).') {
          Alert.alert('Login Error', "Please ensure you are connected to the internet");
        }
        else{
          Alert.alert('Error', error.message);
        }
      }
    }
    else {
        Alert.alert("Notice", "The passwords you entered did not match!", [ {text: "Ok"} ]);
        setPassword("");
        setPasswordConfirm("");
    }
  }

  return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <Ionicons name="lock-open" size={32} color="#5856D6" />
          <Text style={styles.heading}>Fill in the form below to signup</Text>
        </View>
        <View style={styles.formContainer}>
          <TextInput
            placeholder='Enter email:'
            style={styles.input}
            onChangeText={onChangeEmail}
            value={email}
            autoCapitalize='none'
          />
          <TextInput
            placeholder='Enter password:'
            style={styles.input}
            onChangeText={onChangePassword}
            value={password}
            autoCapitalize='none'
            secureTextEntry
          />
          <TextInput
            placeholder='Enter password again:'
            style={styles.input}
            onChangeText={onChangePasswordConfirm}
            value={passwordConfirm}
            autoCapitalize='none'
            secureTextEntry
          />
          <Button title="Signup" onPress={handleSignup} color="#5856D6" />
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
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 4,
    color: '#333',
  },
});

export default SignupScreen;