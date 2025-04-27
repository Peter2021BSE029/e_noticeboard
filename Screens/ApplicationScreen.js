import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Linking,
  Image,
} from 'react-native';
import { useTheme } from '../Tools/ThemeContext';
import colors from '../Tools/theme';
import { AuthContext } from '../Tools/AuthContext';
import { ref, set, onValue } from 'firebase/database';
import { database } from '../Firebase/firebase';
import Checkbox from 'expo-checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import uuid from 'react-native-uuid';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const ApplicationScreen = () => {
  const { theme } = useTheme();
  const { user } = useContext(AuthContext);
  const colorScheme = colors[theme];
  
  const navigation = useNavigation();
  
  const [userEmail, setUserEmail] = useState('');
  const [reason, setReason] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  const [dob, setDob] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [phone, setPhone] = useState('');
  const [socialLink, setSocialLink] = useState('');
  const [contentTypes, setContentTypes] = useState([]);
  const [idPicture, setIdPicture] = useState(null); // state to store the ID picture

  const contentOptions = ['News', 'Events', 'Tutorials', 'Campus Vibes', 'Lost & Found'];

  useEffect(() => {
    if (user?.uid) {
      const userRef = ref(database, `users/${user.uid}`);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setUserEmail(data.email);
        }
      });

      const applicationRef = ref(database, `applications/${user.uid}`);
      onValue(applicationRef, (snapshot) => {
        if (snapshot.exists()) {
          setAlreadyApplied(true);
          const data = snapshot.val();
          setReason(data.reason || '');
          setDob(data.dob || '');
          setPhone(data.phone || '');
          setSocialLink(data.socialLink || '');
          setContentTypes(data.contentTypes || []);
        }
      });
    }
  }, [user?.uid]);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDob(selectedDate.toISOString().split('T')[0]);
    }
  };

  const toggleOption = (option) => {
    if (contentTypes.includes(option)) {
      setContentTypes(contentTypes.filter(item => item !== option));
    } else {
      setContentTypes([...contentTypes, option]);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setIdPicture(result.uri); // Set the image URI to the state
    }
  };
  
  const handleImagePick = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.granted) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: true,
      });

      if (!result.canceled) {
        const { uri } = result.assets[0];
        setIdPicture(uri);
      }
    } else {
      Alert.alert('Permission denied', 'You need to grant access to your photos to upload an ID picture.');
    }
  };
  
  const uploadImage = async () => {
    if (!idPicture) return null;

    const imageId = uuid.v4(); // Generate a unique ID for the image
    const response = await fetch(idPicture);
    const blob = await response.blob();
    const storage = getStorage();
    const storagePath = storageRef(storage, `id-images/${imageId}.jpg`);

    try {
      const uploadResult = await uploadBytes(storagePath, blob);
      const downloadUrl = await getDownloadURL(uploadResult.ref);
      return downloadUrl;
    } catch (error) {
      console.error('Image upload failed', error);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!reason.trim()) {
      Alert.alert('Error', 'Please provide a reason for applying.');
      return;
    }

    if (!acceptedTerms) {
      return;
    }
	
    if (!idPicture) {
      Alert.alert('Error', 'Please upload your ID picture.');
      return;
    }

    try {
      let uploadedImageUrl = await uploadImage();

      const applicationData = {
        name: user?.name || '',
        email: userEmail,
        uid: user?.uid || '',
        reason,
        dob,
        phone,
        socialLink,
        contentTypes,
        status: 'pending',
        createdAt: Date.now(),
        idPicture: uploadedImageUrl || null,
      };

      await set(ref(database, `applications/${user?.uid}`), applicationData);
      Alert.alert('Submitted', 'Your application has been submitted successfully!');
    } catch (error) {
      console.error('Application Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colorScheme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={[styles.heading, { color: colorScheme.text }]}>Creator Application</Text>

        {alreadyApplied && (
          <Text style={{ color: colorScheme.accent, marginBottom: 10 }}>
            You have already submitted an application. You can edit it below.
          </Text>
        )}

        <TextInput
          placeholder="Why do you want to become a creator?"
          placeholderTextColor={colorScheme.placeholder}
          value={reason}
          onChangeText={setReason}
          style={[styles.input, {
            backgroundColor: colorScheme.inputBackground,
            color: colorScheme.text,
            borderColor: colorScheme.border
          }]}
          multiline
        />

        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={[styles.input, {
            backgroundColor: colorScheme.inputBackground,
            borderColor: colorScheme.border
          }]}
        >
          <Text style={{ color: dob ? colorScheme.text : colorScheme.placeholder }}>
            {dob || 'Select Date of Birth (optional)'}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={dob ? new Date(dob) : new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        <TextInput
          placeholder="Phone Number (optional)"
          placeholderTextColor={colorScheme.placeholder}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          style={[styles.input, {
            backgroundColor: colorScheme.inputBackground,
            color: colorScheme.text,
            borderColor: colorScheme.border
          }]}
        />

        <TextInput
          placeholder="Social Media (optional)"
          placeholderTextColor={colorScheme.placeholder}
          value={socialLink}
          onChangeText={setSocialLink}
          style={[styles.input, {
            backgroundColor: colorScheme.inputBackground,
            color: colorScheme.text,
            borderColor: colorScheme.border
          }]}
        />

        <Text style={[styles.label, { color: colorScheme.text }]}>What type of content will you post?</Text>
        {contentOptions.map(option => (
          <TouchableOpacity
            key={option}
            onPress={() => toggleOption(option)}
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}
          >
            <Checkbox
              value={contentTypes.includes(option)}
              onValueChange={() => toggleOption(option)}
              color={contentTypes.includes(option) ? colorScheme.accent : undefined}
            />
            <Text style={{ marginLeft: 8, color: colorScheme.text }}>{option}</Text>
          </TouchableOpacity>
        ))}

        {/* Image Picker Button */}
        <TouchableOpacity
          onPress={handleImagePick} // Image picker button
          style={[styles.input, {
            backgroundColor: colorScheme.inputBackground,
            borderColor: colorScheme.border
          }]}
        >
          <Text style={{ color: idPicture ? colorScheme.text : colorScheme.placeholder }}>
            {idPicture ? 'ID Picture Selected' : 'Upload ID Picture (Required)'}
          </Text>
        </TouchableOpacity>

        <View style={styles.checkboxContainer}>
          <Checkbox
            value={acceptedTerms}
            onValueChange={setAcceptedTerms}
            color={acceptedTerms ? colorScheme.accent : undefined}
          />
          <Text style={[styles.checkboxText, { color: colorScheme.text }]}>
            I agree to the{' '}
            <Text
              style={{ color: colorScheme.accent, textDecorationLine: 'underline' }}
              onPress={() => navigation.navigate("TermsOfService")}
            >
              Terms of Service
            </Text>
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: acceptedTerms ? colorScheme.accent : 'gray' }]}
          onPress={handleSubmit}
          disabled={!acceptedTerms}
        >
          <Text style={styles.submitText}>Submit Application</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ApplicationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  label: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  checkboxText: {
    marginLeft: 10,
    fontSize: 15,
    flexShrink: 1,
  },
  submitButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  imagePickerContainer: {
    marginBottom: 15,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});