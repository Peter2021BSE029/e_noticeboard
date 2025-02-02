// Import the necessary modules and components
import { StyleSheet, SafeAreaView, ScrollView, RefreshControl, } from 'react-native';
import EventBox from '../Tools/EventBox';
import { useFocusEffect } from '@react-navigation/native';
import { database, onValue, ref } from '../Firebase/firebase';
import Menu from '../Tools/Menu';
import GeofenceOverlay from '../Tools/GeofenceOverlay'; // Import the GeofenceOverlay component
import MapScreen from '../Screens/MapScreen'; // Import the MapScreen component
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';

function NoticeScreen(props) {
	
	const [insideGeofence, setInsideGeofence] = useState(false);
	const [events, setEvents] = useState([]);  // initially, events will be an empty array
	const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
      // Retrieve insideGeofence state from AsyncStorage
      AsyncStorage.getItem('insideGeofence').then(value => {
        if (value === 'true') {
          setInsideGeofence(true);
          // If user is inside geofence, fetch events
          fetchEvents();
        } else {
          setInsideGeofence(false);
        }
      });
    }, []);
  
    // fetch events whenever the screen recieves focus
    useFocusEffect(
        React.useCallback(() => {   
            // Check geofence state before fetching events
            AsyncStorage.getItem('insideGeofence').then(value => {
                if (value === 'true') {
                    setInsideGeofence(true);
                    fetchEvents();
                } else {
                    setInsideGeofence(false);
                    // If user is outside geofence, clear events
                    setEvents([]);
                }
            });
        }, [])
    );

    const fetchEvents = async () => {
        try {
            const userRef = ref(database, 'events/' );
            const eventList = [];
            //use 'onValue' to read user data once
            onValue(userRef, (snapshot) => {
                snapshot.forEach((childSnapshot) => {
                    eventList.push({key: childSnapshot.key, ...childSnapshot.val()});
                });
                setEvents(eventList);
            });
        }
        catch (error) {
            Alert.alert('Error', error.message);
        }
    }

    const onRefresh = async () => {    
        setRefreshing(true);
        await fetchEvents();
        setTimeout( () => {
            setRefreshing(false);
        }, 2000 ); 
    }
  
    return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <SafeAreaView style={styles.view} >
        <Menu admin={'no'}/>
        {/* Render the GeofenceOverlay if the user is outside the geofence */}
        {!insideGeofence && <GeofenceOverlay style={{alignItems: 'center', justifyContent: 'center'}} />}
        {/* Render event boxes if the user is inside the geofence */}
        {insideGeofence && events.map((event, index) => (
          <EventBox
            key={index}
            event={event.event}
            date={event.date}
            time={event.time}
            venue={event.venue}
            status={event.status}
          />
        ))}
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
})

export default NoticeScreen;
