import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
//import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

const EventBox = ({ event, date, time, venue, status }) => {

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

      </View>

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
});

export default EventBox;