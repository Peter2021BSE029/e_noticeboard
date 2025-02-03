import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const AdminNoticeScreen = () => {
  const [title, setTitle] = useState('');
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [details, setDetails] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleCreateNotice = () => {
    // Here you would handle creating the notice (later connected to Firebase)
    console.log('Notice Created:', { title, expiryDate, details });
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setExpiryDate(selectedDate);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Create Notice</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter title"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Expiry Date</Text>
      <View style={styles.datePickerWrapper}>
        <Text style={styles.dateText}>{expiryDate.toLocaleDateString()}</Text>
        <Button title="Select Date" onPress={() => setShowDatePicker(true)} />
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={expiryDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <Text style={styles.label}>Details</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter notice details"
        value={details}
        onChangeText={setDetails}
        multiline
        numberOfLines={4}
      />

      <Button title="Create Notice" onPress={handleCreateNotice} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  datePickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateText: {
    fontSize: 16,
    marginRight: 10,
  },
});

export default AdminNoticeScreen;
