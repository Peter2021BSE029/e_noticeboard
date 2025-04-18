import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, TextInput, Button, Alert, View, Text, Keyboard} from 'react-native';
//import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { auth, createUserWithEmailAndPassword, database, ref, set, sendEmailVerification, onAuthStateChanged } from '../Firebase/firebase';

function SignupScreen(props) {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const onChangeName = (newText) => {
    setName(newText);
  };

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

  const [verificationSent, setVerificationSent] = useState(false);

  const isValidEmailDomain = (email) => {
    const allowedDomains = ["@must.ac.ug", "@std.must.ac.ug"];
    return allowedDomains.some(domain => email.endsWith(domain));
  };

  const handleSignup = async () => {
    if (name === '' || email === '' || password === '' || passwordConfirm === '') {
      alert("Please ensure that you've filled all fields!");
      return;
    }
    if (!isValidEmailDomain(email)) {
      Alert.alert("Invalid Email", "Please use a valid '@must.ac.ug' or '@std.must.ac.ug' email address.");
      return;
    }

    if (password === passwordConfirm) {
      try {
        Keyboard.dismiss();

        // Create user email-password firebase account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Send verification email
        await sendEmailVerification(user);
        setVerificationSent(true);
        Alert.alert("Check your email", "A verification link has been sent to your email address. Please click the link to verify your account.");
      }
      catch (error) {
        if (error.message === 'Firebase: Error (auth/network-request-failed).') {
          Alert.alert('Signup Error', "Please ensure you are connected to the internet");
        }
        else {
          Alert.alert('Signup Error', error.message);
        }
      }
    }
    else {
      Alert.alert("Notice", "The passwords you entered did not match!", [ { text: "Ok" } ]);
      setPassword("");
      setPasswordConfirm("");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && verificationSent && user.emailVerified) {
        const uid = user.uid;
        const userData = {
          name,
          email,
          role: "user"
        };
        set(ref(database, 'users/' + uid), userData);
        
        Alert.alert("Verified", "Sign up successful!");
        navigation.navigate('Home');
      }
      else if (user && verificationSent && !user.emailVerified) {
        Alert.alert("Verification Pending", "Please verify your email address by clicking the link sent to your inbox.");
      }
    });
    return () => unsubscribe();
  }, [navigation, name, email, verificationSent]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons name="lock-open" size={32} color="#5856D6" />
        <Text style={styles.heading}>Fill in the form below to signup</Text>
      </View>
      <View style={styles.formContainer}>
        <TextInput
          placeholder='Enter full name:'
          style={styles.input}
          onChangeText={onChangeName}
          value={name}
        />
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
        <TextInput
          placeholder='Enter password again:'
          style={styles.input}
          onChangeText={onChangePasswordConfirm}
          value={passwordConfirm}
          autoCapitalize='none'
          secureTextEntry
        />
        <Button title="Signup" onPress={handleSignup} color="#5856D6" />
        {verificationSent && (
          <Text style={styles.verificationInfo}>
            A verification link has been sent to {email}. Please check your inbox and click the link to complete your signup.
          </Text>
        )}
      </View>

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
  verificationInfo: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    color: 'green',
  },
});

export default SignupScreen;