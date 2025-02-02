import React, { useState } from 'react';
import { TextInput, Button, Modal, Alert, View, TouchableOpacity, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { database, ref, remove, set } from '../Firebase/firebase';

function EventModal({ event, date, time, venue, status, onClose, refresh }) {
  const [editedEvent, setEditedEvent] = useState(event);
  const onChangeEditedEvent = (newText) => {
    setEditedEvent(newText);
  };
  const [editedDate, setEditedDate] = useState(date);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = () => {
    setDatePickerVisibility(!isDatePickerVisible);
  };
  const [editedTime, setEditedTime] = useState(time);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const showTimePicker = () => {
    setTimePickerVisibility(!isTimePickerVisible);
  };
  const [editedVenue, setEditedVenue] = useState(venue);
  const onChangeEditedVenue = (newText) => {
    setEditedVenue(newText);
  };
  const [editedStatus, setEditedStatus] = useState(status);
  const onChangeEditedStatus = (newText) => {
    setEditedStatus(newText);
  };

  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Event details successfully edited!',
      visibilityTime: 3000,
      autoHide: true,
    });
  };

  const handleSubmit = async () => {
    // Handle submit action with the edited values
    try {
      const edit = {
        event: editedEvent,
        date: editedDate,
        time: editedTime,
        venue: editedVenue,
        status: editedStatus
        //dateAndTime,
      };
      await remove(ref(database, 'events/' + event + ' ' + date + ' ' + time + '/'));
      await set(ref(database, 'events/' + editedEvent + ' ' + editedDate + ' ' + editedTime + '/'), edit);
      refresh();
      showToast();
    }
    catch (error) {
      if (error.message === 'Firebase: Error (auth/network-request-failed).') {
        Alert.alert('Network Error', "Please ensure you are connected to the internet");
      }
      else {
        Alert.alert('Error', error.message);
      }
    }
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View style={{ backgroundColor: 'white', padding: 25, borderRadius: 10, width: '80%' }}>
          <TextInput
            placeholder={event}
            value={editedEvent}
            onChangeText={onChangeEditedEvent}
            style={{ marginBottom: 10, borderWidth: 1, padding: 10, borderRadius: 5, height: 43, }}
          />
          <TouchableOpacity onPress={showDatePicker} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: 'gray', borderRadius: 5, padding: 10, marginBottom: 20, }}>
            <Text>{editedDate === date ? date : editedDate}</Text>
            <Ionicons name="calendar-number" size={20} color="#5856D6" />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={(date) => {
              setEditedDate(date.getDate() + "th " + date.toString().split(' ')[1] + " " + date.getFullYear());
              setDatePickerVisibility(false);
            }}
            onCancel={() => setDatePickerVisibility(false)}
          />

          <TouchableOpacity onPress={showTimePicker} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: 'gray', borderRadius: 5, padding: 10, marginBottom: 20, }}>
            <Text>{editedTime === time ? time : editedTime}</Text>
            <Ionicons name="time" size={20} color="#5856D6" />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            onConfirm={(time) => {
              setEditedTime(time.toString().split(' ')[4].substring(0, 5));
              setTimePickerVisibility(false);
            }}
            onCancel={() => setTimePickerVisibility(false)}
          />

          <TextInput
            placeholder={venue}
            value={editedVenue}
            onChangeText={onChangeEditedVenue}
            style={{ marginBottom: 10, borderWidth: 1, padding: 10, borderRadius: 5, height: 43, }}
          />
          <Picker
            selectedValue={editedStatus}
            onValueChange={onChangeEditedStatus}
            style={{ borderWidth: 1, borderColor: 'black', borderRadius: 5, marginBottom: 10, padding: 10 }}
          >
            <Picker.Item label="Pending" value="Pending" />
            <Picker.Item label="Finished" value="Finished" />
            <Picker.Item label="Canceled" value="Canceled" />
          </Picker>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 5 }}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Button title="Cancel" onPress={onClose} color="#5856D6" />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Button title="Submit" onPress={() => handleSubmit()} color="#5856D6" />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default EventModal;