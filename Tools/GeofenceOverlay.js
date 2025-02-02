import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const GeofenceOverlay = () => {
  return (
    <View style={styles.overlay}>
      <Text style={styles.message}>Notices are only visible within the geofence</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
	left: '10%', // Position the overlay 50% from the top
  },
  message: {
    fontSize: 16,
    color: 'white',
    alignContent: 'center',
    justifyContent: 'center',
  },
});

export default GeofenceOverlay;
