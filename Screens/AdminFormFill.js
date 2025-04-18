import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, TextInput, Button, Alert, Keyboard, View, Text, TouchableOpacity, Image } from 'react-native';
import Toast from 'react-native-toast-message';
//import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { database, ref, set, storage, storageRef, uploadBytes, getDownloadURL } from '../Firebase/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

function AdminFormFill(props) {
    //const navigation = useNavigation();

    const showToast = () => {
        Toast.show({
          type: 'success',
          text1: 'Event successfully added!',
          visibilityTime: 3000,
          autoHide: true,
        });
        setEvent('');
        setDescription('');
        setDate('');
        setTime('');
        setVenue('');
    };

  const [event, setEvent] = useState('');
    const onChangeEvent = (event1) => {
        setEvent(event1);
    };

    const [description, setDescription] = useState('');
    const onChangeDescription = (description1) => {
        setDescription(description1);
    };

    const [date, setDate] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    //const [date, setDate] = useState(selectedDate.toISOString().slice(0, 10));
    const showDatePicker = () => {
      setDatePickerVisibility(!isDatePickerVisible);
    }

    const [time, setTime] = useState('');
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
    //const [date, setDate] = useState(selectedDate.toISOString().slice(0, 10));
    const showTimePicker = () => {
      setTimePickerVisibility(!isTimePickerVisible);
    }

    const [venue, setVenue] = useState('');
    const onChangeVenue = (venue) => {
        setVenue(venue);
    };

    const [image, setImage] = useState(null);

    // Handle image picking
    const pickImage = async () => {
      Keyboard.dismiss();
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
          Alert.alert('Permission required', 'Please grant camera roll permissions to upload an image.');
          return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          //aspect: [4, 3],
          quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
          setImage(result.assets[0].uri); // In newer Expo versions, images are in the assets array
      }
      else if (!result.canceled && result.uri) {
          setImage(result.uri); // Fallback for older versions
      }
  };

    const submitEvent = async () => {
        if (event ==='' || description ==='' || date === '' || time === '' || venue === '') {
            alert("Please ensure that you've filled all fields!");
            return;
        }

        Keyboard.dismiss();
        try{    
            const name = await AsyncStorage.getItem('name');
            if (!name) {
              alert("You need to login in order to post");
              navigation.navigate('Login');
              return;
            }

            const datePosted = new Date();

            if (image) {
              const imageReference = storageRef(storage, `post_images/${uid}`); // Create a reference
              const response = await fetch(image); // Convert the image URI to a blob
              const blob = await response.blob();
              await uploadBytes(imageReference, blob); // Upload the blob
              const imageUrl = await getDownloadURL(imageReference); // Get the download URL


              const eventPost = {
                  title: event,
                  datePosted,
                  description,
                  postedBy: name,
                  date,
                  time,
                  venue,
                  image: imageUrl,
                  //status: 'Pending',
              };
              await set( ref(database, `events/${event} ${date} ${time}/` ), eventPost );
            }
            else {
              const eventPost = {
                title: event,
                datePosted,
                description,
                postedBy: name,
                date,
                time,
                venue,
                //status: 'Pending',
            };
            await set( ref(database, `events/${event} ${date} ${time}/` ), eventPost );
            }
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


    return (
        <SafeAreaView style={styles.container}>
          <View style={styles.headerContainer}>
            <Ionicons name="calendar" size={32} color="#5856D6" />
            <Text style={styles.heading}>Fill in the form below to add a new event</Text>
          </View>
          <View style={styles.formContainer}>
            <TextInput
              placeholder='Event name:'
              onChangeText={onChangeEvent}
              value={event}
              style={styles.input}
            />
            <TextInput
              placeholder='Description:'
              onChangeText={onChangeDescription}
              value={description}
              style={styles.input}
            />
            <TouchableOpacity onPress={showDatePicker} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: 'gray', borderRadius: 5, padding: 10, marginBottom: 20, }}>
              <Text>{date === "" ? 'Select Date' : date}</Text>
              <Ionicons name="calendar-number" size={20} color="#5856D6" />
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={(date) => {
                setDate(date.getDate() + "th " + date.toString().split(' ')[1] + " " + date.getFullYear());
                setDatePickerVisibility(false);
                // alert(date.getDate() + "th " + date.toString().split(' ')[1] + " " + date.getFullYear());
              }}
              onCancel={() => setDatePickerVisibility(false)}
            />
            {/* <TextInput
              placeholder='Event time:'
              onChangeText={onChangeTime}
              value={time}
              style={styles.input}
            /> */}
            <TouchableOpacity onPress={showTimePicker} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: 'gray', borderRadius: 5, padding: 10, marginBottom: 20, }}>
              <Text>{time === "" ? 'Select Time' : time}</Text>
              <Ionicons name="time" size={20} color="#5856D6" />
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isTimePickerVisible}
              mode="time"
              onConfirm={(time) => {
                setTime(time.toString().split(' ')[4].substring(0, 5));
                setTimePickerVisibility(false);
              }}
              onCancel={() => setTimePickerVisibility(false)}
            />
            <TextInput
              placeholder='Event venue:'
              onChangeText={onChangeVenue}
              value={venue}
              style={styles.input}
            />
            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
              <Text>{image ? 'Image Selected' : 'Upload Image (optional)'}</Text>
              <Ionicons name="image" size={20} color="#5856D6" />
            </TouchableOpacity>
            {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
            <Button title="Submit" onPress={submitEvent} color="#5856D6" />
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
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 10,
        color: '#333',
      },
      imagePicker: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    imagePreview: {
        width: 100,
        height: 100,
        marginBottom: 20,
        borderRadius: 5,
    },
    });

export default AdminFormFill;

