import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  StyleSheet, SafeAreaView, TextInput, View, Text,
  TouchableOpacity, Modal, FlatList, Alert, Keyboard,
  KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Button, ActivityIndicator, ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import emailjs from '@emailjs/react-native';

import { AuthContext } from '../Tools/AuthContext';

import {
  auth, createUserWithEmailAndPassword,
  database, ref, set, get
} from '../Firebase/firebase';
import { useTheme } from '../Tools/ThemeContext';
import colors from '../Tools/theme';

// EmailJS configuration
const EMAILJS_SERVICE_ID = 'service_50cnx2e';
const EMAILJS_TEMPLATE_ID = 'template_ngy7cw9';
//const EMAILJS_USER_ID = 'OQsFY-pYhpdP_DMs8';

function SignupScreen(props) {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const c = colors[theme];
  
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);

  const [showFacultyModal, setShowFacultyModal] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [faculties, setFaculties] = useState([]);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('');
  const [faculty, setFaculty] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Verification code states
  const [verificationCode, setVerificationCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [verificationModalVisible, setVerificationModalVisible] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  const [userTypeModalVisible, setUserTypeModalVisible] = useState(false);
  
  // Reference to store user data temporarily before verification
  const pendingUserData = useRef(null);

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const snapshot = await get(ref(database, 'faculties'));
        const data = snapshot.val();
        if (data) {
          const facultyArray = Object.values(data);
          setFaculties(facultyArray);
        }
      } catch (error) {
        console.error('Error fetching faculties:', error);
        Alert.alert('Error', 'Failed to fetch faculties.');
      }
    };
    fetchFaculties();
  }, []);

  // Countdown timer for resend button
  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(prev => prev - 1), 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  // Generate a random 6-digit verification code
  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Send verification code to user's email
  const sendVerificationEmail = async () => {
    const newCode = generateVerificationCode();
    setVerificationCode(newCode);
    setIsCodeSent(true);
    setResendDisabled(true);
    setResendCountdown(60); // 60 seconds cooldown

    try {
      const templateParams = {
        email: email,
        name: `${firstName} ${lastName}`,
        passcode: newCode
      };

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        {publicKey: 'OQsFY-pYhpdP_DMs8'}
      );

      Toast.show({
        type: 'success',
        text1: 'Verification code sent!',
        text2: 'Please check your email',
        visibilityTime: 3000
      });
    } catch (error) {
      console.error('Error sending email:', error);
      Alert.alert('Error', 'Failed to send verification code. Please try again.');
      setIsCodeSent(false);
      setResendDisabled(false);
    }
  };

  const isValidEmailDomain = (email) => {
    const allowedDomains = ["@must.ac.ug", "@std.must.ac.ug"];
    return allowedDomains.some(domain => email.endsWith(domain));
  };

  // Validate inputs before initiating verification
  const validateInputs = () => {
    if (!firstName || !lastName) {
      Alert.alert("Missing Name", "Enter both first and last name.");
      return false;
    }
    if (!email) {
      Alert.alert("Missing Email", "Please enter your email address.");
      return false;
    }
    if (!isValidEmailDomain(email)) {
      Alert.alert("Invalid Email", "Please use a valid '@must.ac.ug' or '@std.must.ac.ug' email address.");
      return false;
    }
    if (!userType) {
      Alert.alert("Missing Info", "Please select user type.");
      return false;
    }
    if (!selectedFaculty) {
      Alert.alert("Missing Info", "Please select a faculty.");
      return false;
    }
    if (password !== passwordConfirm) {
      Alert.alert("Password Mismatch", "Passwords don't match.");
      return false;
    }
    if (password.length < 6) {
      Alert.alert("Weak Password", "Use at least 6 characters and mix letters and numbers.");
      return false;
    }
    return true;
  };

  // Initiate verification process
  const initiateVerification = () => {
    if (validateInputs()) {
      // Store user data temporarily
      pendingUserData.current = {
        firstName,
        lastName,
        email,
        userType,
        faculty: selectedFaculty.name,
        password
      };
      
      // Show verification modal and send code
      setVerificationModalVisible(true);
      sendVerificationEmail();
    }
  };

  // Verify the entered code
  const verifyCode = () => {
    if (enteredCode === verificationCode) {
      setVerificationModalVisible(false);
      handleSignup();
    } else {
      Alert.alert("Invalid Code", "The verification code you entered is incorrect. Please try again.");
    }
  };

  // Complete signup after verification
  const handleSignup = async () => {
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const userData = {
        firstName,
        lastName,
        email,
        role: 'user',
        userType,
        faculty: selectedFaculty.name,
        emailVerified: true
      };

      await set(ref(database, 'users/' + uid), userData);
      Keyboard.dismiss();
      Toast.show({ 
        type: 'success', 
        text1: 'Signup successful!', 
        text2: 'Your account has been created.',
        visibilityTime: 3000 
      });
      login(uid, `${firstName} ${lastName}`);

    } catch (error) {
      console.error(error);
      Alert.alert("Signup Error", error.message.includes('auth/network-request-failed') ?
        "Check your internet connection." : error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
		<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex: 1 }}>
            <View style={styles.headerContainer}>
              <Ionicons name="lock-open" size={32} color={c.accent} />
              <Text style={[styles.heading, { color: c.text }]}>Fill in the form to signup</Text>
            </View>

            <View style={styles.formContainer}>
              <TextInput placeholder="First Name" style={[styles.input, { borderColor: c.border, backgroundColor: c.inputBackground, color: c.text }]} onChangeText={setFirstName} value={firstName} placeholderTextColor={c.border} />
              <TextInput placeholder="Last Name" style={[styles.input, { borderColor: c.border, backgroundColor: c.inputBackground, color: c.text }]} onChangeText={setLastName} value={lastName} placeholderTextColor={c.border} />
              <TextInput placeholder="Email" style={[styles.input, { borderColor: c.border, backgroundColor: c.inputBackground, color: c.text }]} onChangeText={setEmail} value={email} keyboardType="email-address" autoCapitalize="none" placeholderTextColor={c.border} />

<TouchableOpacity onPress={() => setUserTypeModalVisible(true)} style={[styles.selectBox, { borderColor: c.border, backgroundColor: c.inputBackground, }]}>
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
    <Text style={{ color: userType ? c.text : c.border }}>{userType || 'Select User Type'}</Text>
    <Ionicons name="chevron-down" size={12} color={c.border} />
  </View>
</TouchableOpacity>

              <TouchableOpacity onPress={() => setShowFacultyModal(true)} style={[styles.selectBox, { borderColor: c.border, backgroundColor: c.inputBackground, }]}>
			  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Text style={{ color: selectedFaculty ? c.text : c.border }}>{selectedFaculty?.name || 'Select Faculty'}</Text>
				<Ionicons name="chevron-down" size={12} color={c.border} />
			  </View>
              </TouchableOpacity>

              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Password"
                  style={[styles.input, { flex: 1, borderColor: c.border, backgroundColor: c.inputBackground, color: c.text }]}
                  onChangeText={setPassword}
                  value={password}
                  autoCapitalize='none'
                  secureTextEntry={!showPassword}
                  placeholderTextColor={c.border}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye" : "eye-off"} size={24} color={c.accent} />
                </TouchableOpacity>
              </View>

              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Confirm Password"
                  style={[styles.input, { flex: 1, borderColor: c.border, backgroundColor: c.inputBackground, color: c.text }]}
                  onChangeText={setPasswordConfirm}
                  value={passwordConfirm}
                  autoCapitalize='none'
                  secureTextEntry={!showConfirmPassword}
                  placeholderTextColor={c.border}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons name={showConfirmPassword ? "eye" : "eye-off"} size={24} color={c.accent} />
                </TouchableOpacity>
              </View>

              <Text style={{ color: c.border, fontSize: 12, marginBottom: 10 }}>
                Use 6+ characters with a mix of letters and numbers.
              </Text>

              <TouchableOpacity 
                style={[styles.signupButton, { backgroundColor: c.accent }]} 
                onPress={initiateVerification}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Verify & Signup</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Faculty Modal */}
            <Modal visible={showFacultyModal} transparent animationType="slide">
              <TouchableOpacity
                activeOpacity={1}
                onPressOut={() => setShowFacultyModal(false)}
                style={styles.modalOverlay}
              >
                <View style={styles.modalContent}>
                  <FlatList
                    data={faculties}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedFaculty(item);
                          setShowFacultyModal(false);
                        }}
                        style={{ paddingVertical: 10 }}
                      >
                        <Text>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </TouchableOpacity>
            </Modal>

            {/* User Type Modal */}
            <Modal visible={userTypeModalVisible} transparent animationType="slide">
              <TouchableOpacity
                activeOpacity={1}
                onPressOut={() => setUserTypeModalVisible(false)}
                style={styles.modalOverlay}
              >
                <View style={styles.modalContent}>
                  {['student', 'staff'].map(type => (
                    <TouchableOpacity key={type} onPress={() => {
                      setUserType(type);
                      setUserTypeModalVisible(false);
                    }}>
                      <Text style={styles.modalItem}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableOpacity>
            </Modal>

            {/* Verification Code Modal */}
            <Modal visible={verificationModalVisible} transparent animationType="slide">
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalOverlay}>
                  <View style={styles.verificationModalContent}>
                    <Text style={styles.verificationTitle}>Email Verification</Text>
                    <Text style={styles.verificationText}>
                      We've sent a verification code to {email}. Please enter the code below.
                    </Text>
                    
                    <TextInput
                      style={[styles.verificationInput, { borderColor: c.accent, color: c.text }]}
                      placeholder="Enter verification code"
                      value={enteredCode}
                      onChangeText={setEnteredCode}
                      keyboardType="numeric"
                      maxLength={6}
                      placeholderTextColor={c.border}
                    />
                    
                    <TouchableOpacity
                      style={[styles.verifyButton, { backgroundColor: c.accent }]}
                      onPress={verifyCode}
                    >
                      <Text style={styles.buttonText}>Verify Code</Text>
                    </TouchableOpacity>
                    
                    <View style={styles.resendContainer}>
                      <TouchableOpacity
                        disabled={resendDisabled}
                        onPress={sendVerificationEmail}
                        style={{ opacity: resendDisabled ? 0.5 : 1 }}
                      >
                        <Text style={[styles.resendText, { color: c.accent }]}>
                          {resendDisabled 
                            ? `Resend code in ${resendCountdown}s` 
                            : 'Resend code'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setVerificationModalVisible(false)}
                    >
                      <Text style={{ color: c.text }}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </View>
		  </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <Toast position='bottom' />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  heading: { fontSize: 20, fontWeight: 'bold', marginLeft: 6 },
  formContainer: { flex: 1, justifyContent: 'center' },
  input: {
    height: 40, borderWidth: 1, borderRadius: 5, marginBottom: 16, paddingHorizontal: 10
  },
  selectBox: {
    borderWidth: 1, borderRadius: 5, padding: 10, marginBottom: 16
  },
  passwordContainer: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 16
  },
  modalOverlay: {
    flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)', padding: 20
  },
  modalContent: {
    backgroundColor: 'white', borderRadius: 10, padding: 15
  },
  modalItem: {
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#ccc'
  },
  signupButton: {
    padding: 12,
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginBottom: 20,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  verificationModalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center'
  },
  verificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15
  },
  verificationText: {
    textAlign: 'center',
    marginBottom: 20
  },
  verificationInput: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 18,
    textAlign: 'center'
  },
  verifyButton: {
    width: '100%',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15
  },
  resendContainer: {
    marginBottom: 20,
    padding: 10
  },
  resendText: {
    textDecorationLine: 'underline'
  },
  closeButton: {
    padding: 10
  }
});

export default SignupScreen;