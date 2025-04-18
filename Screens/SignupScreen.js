import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet, SafeAreaView, TextInput, View, Text,
  TouchableOpacity, Modal, FlatList, Alert, Keyboard,
  KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Button
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';

import { AuthContext } from '../Tools/AuthContext';

import {
  auth, createUserWithEmailAndPassword, sendEmailVerification,
  database, ref, set, get
} from '../Firebase/firebase';
import colors from '../Tools/theme';

function SignupScreen({ theme = 'light' }) {
  const navigation = useNavigation();
  const c = colors[theme];
  
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

  const [userTypeModalVisible, setUserTypeModalVisible] = useState(false);

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

  const handleSignup = async () => {
    if (!firstName || !lastName) return Alert.alert("Missing Name", "Enter both first and last name.");
    //if (!email.match(/@(must\.ac\.ug|std\.must\.ac\.ug)$/)) return Alert.alert("Invalid Email", "Use @must.ac.ug or @std.must.ac.ug email.");
    if (!userType) return Alert.alert("Missing Info", "Please select user type.");
    if (!selectedFaculty) return Alert.alert("Missing Info", "Please select a faculty.");
    if (password !== passwordConfirm) return Alert.alert("Password Mismatch", "Passwords don't match.");
    if (password.length < 6) return Alert.alert("Weak Password", "Use at least 6 characters and mix letters and numbers.");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      //await sendEmailVerification(userCredential.user);

      const userData = {
        firstName,
        lastName,
        email,
        role: 'user',
        userType,
        faculty: selectedFaculty.name,
      };

      await set(ref(database, 'users/' + uid), userData);
      Keyboard.dismiss();
      Toast.show({ type: 'success', text1: 'Signup successful! Check your email to verify.', visibilityTime: 3000 });
      login(uid, `${firstName} ${lastName}`);

    } catch (error) {
      console.error(error);
      Alert.alert("Signup Error", error.message.includes('auth/network-request-failed') ?
        "Check your internet connection." : error.message);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <View style={styles.headerContainer}>
              <Ionicons name="lock-open" size={32} color={c.accent} />
              <Text style={[styles.heading, { color: c.text }]}>Fill in the form to signup</Text>
            </View>

            <View style={styles.formContainer}>
              <TextInput placeholder="First Name" style={[styles.input, { borderColor: c.accent, color: c.text }]} onChangeText={setFirstName} value={firstName} placeholderTextColor={c.border} />
              <TextInput placeholder="Last Name" style={[styles.input, { borderColor: c.accent, color: c.text }]} onChangeText={setLastName} value={lastName} placeholderTextColor={c.border} />
              <TextInput placeholder="Email" style={[styles.input, { borderColor: c.accent, color: c.text }]} onChangeText={setEmail} value={email} keyboardType="email-address" autoCapitalize="none" placeholderTextColor={c.border} />

              <TouchableOpacity onPress={() => setUserTypeModalVisible(true)} style={[styles.selectBox, { borderColor: c.accent }]}>
                <Text style={{ color: userType ? c.text : c.border }}>{userType || 'Select User Type'}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setShowFacultyModal(true)} style={[styles.selectBox, { borderColor: c.accent }]}>
                <Text style={{ color: selectedFaculty ? c.text : c.border }}>{selectedFaculty?.name || 'Select Faculty'}</Text>
              </TouchableOpacity>

              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Password"
                  style={[styles.input, { flex: 1, borderColor: c.accent, color: c.text }]}
                  onChangeText={setPassword}
                  value={password}
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
                  style={[styles.input, { flex: 1, borderColor: c.accent, color: c.text }]}
                  onChangeText={setPasswordConfirm}
                  value={passwordConfirm}
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

              <Button title="Signup" onPress={handleSignup} color={c.accent} />
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
          </View>
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
});

export default SignupScreen;
