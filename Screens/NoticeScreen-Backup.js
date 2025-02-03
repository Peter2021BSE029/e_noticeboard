// Import the necessary modules and components
import { StyleSheet, SafeAreaView, ScrollView, RefreshControl } from 'react-native';
import EventBox from '../Tools/EventBox';
import { useFocusEffect } from '@react-navigation/native';
import { database, onValue, ref } from '../Firebase/firebase';
import Menu from '../Tools/Menu';
import React, { useEffect, useState } from 'react';

function NoticeScreen(props) {
    const [events, setEvents] = useState([]);  // initially, events will be an empty array
    const [refreshing, setRefreshing] = useState(false);

    // Fetch events when the component mounts
    useEffect(() => {
        fetchEvents();
    }, []);

    // Fetch events whenever the screen receives focus
    useFocusEffect(
        React.useCallback(() => {   
            fetchEvents();
        }, [])
    );

    const fetchEvents = async () => {
        try {
            const userRef = ref(database, 'events/');
            const eventList = [];
            // Use 'onValue' to read event data
            onValue(userRef, (snapshot) => {
                snapshot.forEach((childSnapshot) => {
                    eventList.push({ key: childSnapshot.key, ...childSnapshot.val() });
                });
                setEvents(eventList);
            });
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const onRefresh = async () => {    
        setRefreshing(true);
        await fetchEvents();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000); 
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            <SafeAreaView style={styles.view}>
                <Menu admin={'no'} />
                {/* Render event boxes for all events */}
                {events.map((event, index) => (
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
    view: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default NoticeScreen;

