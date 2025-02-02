import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
//import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { database, ref, remove } from '../Firebase/firebase';
import EventModal from './EventModal';

const AdminBox = ({ event, date, time, venue, status, refresh }) => {

  const [modalVisible, setModalVisible] = useState(false);

  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Event successfully deleted!',
      visibilityTime: 3000,
      autoHide: true,
    });
  };

  const handleDelete = async () => {
    try {
      await remove(ref(database, 'events/' + event + ' ' + date + ' ' + time + '/' ));
      refresh();
      showToast();
    }
    catch (error) {
        if (error.message === 'Firebase: Error (auth/network-request-failed).') {
            Alert.alert('Network Error', "Please ensure you are connected to the internet");
        }
        else{
            Alert.alert('Error', error.message);
        }
    }
  }

  const handleConfirmation = () => {
    Alert.alert(
    'Confirmation',
    'Are you sure you want to delete this event?',
    [
        {text: 'No', style: 'cancel'},
        {text: 'Yes', onPress: () => handleDelete() },
    ],
    { cancelable: false }
    );
};

return (
    <SafeAreaView style={styles.container}>
      <View style={styles.detailsContainer}>
        <Text style={styles.event}>{event}</Text>
        <Text style={styles.date}>{date}</Text>
        <Text style={styles.time}>{time}</Text>
        <Text style={styles.venue}>{venue}</Text>
      </View>

      <View style={styles.iconContainer}>
        {status === 'Pending' && (
          <>
            <FontAwesome name="hourglass-2" size={20} color="gray" />
            <Text style={{marginTop: 5, fontSize: 12, color: 'gray'}}>{status}</Text>
          </>
        )}
        {status === 'Finished' && (
          <>
            <FontAwesome name="check-circle" size={24} color="green" />
            <Text style={{marginTop: 5, fontSize: 12, color: 'green'}}>{status}</Text>
          </>
        )}
        {status === 'Canceled' && (
          <>
            <FontAwesome name="times-circle" size={24} color="red" />
            <Text style={{marginTop: 5, fontSize: 12, color: 'red'}}>{status}</Text>
          </>
        )}

          <View style={styles.editDelete}>
              <TouchableOpacity style={{padding: 5}} onPress={() => setModalVisible(true)}>
                <Ionicons name="create" size={25} color="blue" />
              </TouchableOpacity>
              <TouchableOpacity style={{padding: 5}} onPress={handleConfirmation}>
                <Ionicons name="trash" size={25} color="red" />
              </TouchableOpacity>
            </View>

      </View>
      {modalVisible && (
        <EventModal event={event} date={date} time={time} venue={venue} status={status} onClose={ () => setModalVisible(false) } refresh={ refresh }/> 
      )}

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 5, // Shadow on Android
    shadowColor: '#000', // Shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: 6,
    marginBottom: 6,
  },
  // statusText: {
  //   marginTop: 5,
  //   fontSize: 12,
  //   color: 'green',
  // },
  detailsContainer: {
    flex: 1,
  },
  date: {
    fontSize: 14,
    color: '#888',
  },
  event: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 14,
    color: '#888',
  },
  venue: {
    fontSize: 14,
    color: '#888',
  },
  editDelete: {
    flexDirection: 'row',
    marginTop: 15,
    alignItems: 'center',
    // adjust the following values to fit your specific use case
    width: 70,
    height: 50,
    paddingHorizontal: 5,
  },
});

export default AdminBox;