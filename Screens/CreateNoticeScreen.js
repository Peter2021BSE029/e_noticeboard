// ./Screens/CreateNoticeScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Keyboard,
  StyleSheet,
} from 'react-native';
import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker';
import { ref, push } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { database, storage } from '../Firebase/firebase';
import { useTheme } from '../Tools/ThemeContext';
import colors from '../Tools/theme';
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateNoticeScreen = () => {
  const { theme } = useTheme();
  const themeColors = colors[theme];

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [showExpiryDatePicker, setShowExpiryDatePicker] = useState(false);
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [venue, setVenue] = useState('');
  const [image, setImage] = useState(null);
  const [tags, setTags] = useState('');

  const handlePickImage = async () => {
    let result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    if (!title || !description || !expiryDate) {
      return Alert.alert('Missing Info', 'Please fill all required fields.');
    }

    try {
      const uid = await AsyncStorage.getItem('uid');
      const name = await AsyncStorage.getItem('name');

      let imageUrl = '';
      if (image) {
        const imageId = uuid.v4();
        const imageBlob = await fetch(image).then(res => res.blob());
        const imgRef = storageRef(storage, `notice-images/${imageId}.jpg`);
        await uploadBytes(imgRef, imageBlob);
        imageUrl = await getDownloadURL(imgRef);
      }

      const noticesRef = ref(database, 'notices');
      const newNotice = {
        title,
        description,
        expiryDate: format(expiryDate, 'yyyy-MM-dd'),
        datePosted: format(new Date(), 'yyyy-MM-dd'),
        postedBy: name || uid,
        image: imageUrl,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        eventDate: eventDate || null,
        eventTime: eventTime || null,
        venue: venue || null,
      };

      await push(noticesRef, newNotice);

      Alert.alert('Success', 'Notice created successfully.');
      // Reset form
      setTitle('');
      setDescription('');
      setExpiryDate(new Date());
      setEventDate('');
      setEventTime('');
      setVenue('');
      setImage(null);
      setTags('');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to create notice. Try again later.');
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: themeColors.background }}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.heading, { color: themeColors.text }]}>Create Notice</Text>

      {/* Title Input */}
      <TextInput
        placeholder="Title"
        placeholderTextColor={themeColors.placeholder}
        value={title}
        onChangeText={setTitle}
        style={[styles.input, { backgroundColor: themeColors.inputBackground, color: themeColors.text, borderColor: themeColors.border }]}
      />

      {/* Description Input */}
      <TextInput
        placeholder="Description"
        placeholderTextColor={themeColors.placeholder}
        value={description}
        onChangeText={setDescription}
        multiline
        style={[styles.textArea, { backgroundColor: themeColors.inputBackground, color: themeColors.text, borderColor: themeColors.border }]}
      />

      {/* Expiry Date Picker */}
      <TouchableOpacity onPress={() => setShowExpiryDatePicker(true)} style={styles.dateButton}>
        <Text style={{ color: themeColors.accent }}>
          Set Expiry Date: {format(expiryDate, 'yyyy-MM-dd')}
        </Text>
      </TouchableOpacity>

      {showExpiryDatePicker && (
        <DateTimePicker
          value={expiryDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowExpiryDatePicker(false);
            if (selectedDate) setExpiryDate(selectedDate);
          }}
        />
      )}

      {/* Optional Fields */}
      <TextInput
        placeholder="Event Date (optional)"
        placeholderTextColor={themeColors.placeholder}
        value={eventDate}
        onChangeText={setEventDate}
        style={[styles.input, { backgroundColor: themeColors.inputBackground, color: themeColors.text, borderColor: themeColors.border }]}
      />

      <TextInput
        placeholder="Event Time (optional)"
        placeholderTextColor={themeColors.placeholder}
        value={eventTime}
        onChangeText={setEventTime}
        style={[styles.input, { backgroundColor: themeColors.inputBackground, color: themeColors.text, borderColor: themeColors.border }]}
      />

      <TextInput
        placeholder="Venue (optional)"
        placeholderTextColor={themeColors.placeholder}
        value={venue}
        onChangeText={setVenue}
        style={[styles.input, { backgroundColor: themeColors.inputBackground, color: themeColors.text, borderColor: themeColors.border }]}
      />

      {/* Tags Input */}
      <TextInput
        placeholder="Tags (comma separated)"
        placeholderTextColor={themeColors.placeholder}
        value={tags}
        onChangeText={setTags}
        style={[styles.input, { backgroundColor: themeColors.inputBackground, color: themeColors.text, borderColor: themeColors.border }]}
      />

      {/* Image Picker */}
      {image && (
        <Image
          source={{ uri: image }}
          style={styles.imagePreview}
        />
      )}
      <TouchableOpacity onPress={handlePickImage} style={[styles.uploadButton, { backgroundColor: themeColors.secondary }]}>
        <Text style={{ color: themeColors.text }}>Pick Poster Image (Optional)</Text>
      </TouchableOpacity>

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        style={[styles.submitButton, { backgroundColor: themeColors.selected }]}
      >
        <Text style={styles.submitText}>Post Notice</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    height: 120,
    marginBottom: 12,
    textAlignVertical: 'top',
  },
  dateButton: {
    marginBottom: 12,
    paddingVertical: 8,
  },
  uploadButton: {
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  submitButton: {
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 12,
  },
});

export default CreateNoticeScreen;
