// Import useState and useEffect from React
import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Alert, Text } from 'react-native';
import MapView, { Geojson, Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import new_coordinates from "../MapAssets/new_coordinates.json";
import must_grounds from "../MapAssets/must_grounds.json";
import SearchBarWithDropdown from '../Tools/SearchBar';
import AsyncStorage from '@react-native-async-storage/async-storage';

function MapScreen(props) {
  
    const [userLocation, setUserLocation] = useState(null);
    const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
    const [insideGeofence, setInsideGeofence] = useState(false);

	  useEffect(() => {
		// Update AsyncStorage with insideGeofence state
		AsyncStorage.setItem('insideGeofence', insideGeofence ? 'true' : 'false');
	  }, [insideGeofence]);

    useEffect(() => {
      // Request permission to access location
      (async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          Alert.alert('Permission denied', 'You need to grant location permission to use this app.');
          return;
        }
  
        const isLocationEnabled = await Location.hasServicesEnabledAsync();
        if (!isLocationEnabled) {
          Alert.alert(
            'Location services disabled',
            'Please enable location services to use this app.',
            [{ text: 'Go to Settings', onPress: Location.enableNetworkProviderAsync }]
          );
          return;
        }
  
        const subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 10000,
          },
          (location) => {
            setUserLocation(location.coords);
            
			// Check if user is inside the geofence
            const distanceToCenter = calculateDistance(
              location.coords.latitude, 
              location.coords.longitude, 
              circleOptions.center.latitude, 
              circleOptions.center.longitude
            );
            setInsideGeofence(distanceToCenter <= circleOptions.radius);
          }
        );
  
        return () => {
          subscription.remove();
        };
      })();

    }, []);

    //latitude: -0.6140359632086333, longitude: 30.655099108059943       latitude: -0.616202, longitude: 30.656905
    // Calculate circle boundary
    const center = { latitude: -0.616202, longitude: 30.656905 };
    const radius = 240; // in meters
    const circleOptions = {
      center,
      radius,
    };
	
	const [selectedItem, setSelectedItem] = useState(null);
    const [searchLocation, setSearchLocation] = useState(null);
    const handleSearch = (text) => {
      const foundItem = new_coordinates.find(item => item.name.toLowerCase() === text.toLowerCase());

      if (foundItem) {
        const { lattitude, longitude, fid } = foundItem;
        const centerCoordinates = {
          latitude: parseFloat(lattitude),
          longitude: parseFloat(longitude),
          fid: fid,
        };
        setSelectedItem(centerCoordinates);
        setSearchLocation(centerCoordinates);
      } else {
        Alert.alert('Not Found', `Location with name "${text}" not found`);
      }
    };

    useEffect(() => {
      if (searchLocation) {
        mapViewRef.current.animateToRegion({
          ...searchLocation,
          latitudeDelta: 0.0009,
          longitudeDelta: 0.0009,
        });
      }
    }, [searchLocation]);
  
    const mapViewRef = React.useRef(null);

    // Function to calculate distance between two coordinates using Haversine formula
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Radius of the earth in km
      const dLat = deg2rad(lat2 - lat1);
      const dLon = deg2rad(lon2 - lon1);
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      const d = R * c; // Distance in km
      return d * 1000; // Convert to meters
    }

    // Function to convert degrees to radians
    const deg2rad = (deg) => {
      return deg * (Math.PI/180)
    }
	
	// Check if user is inside the geofence circle
    useEffect(() => {
      if (userLocation) {
        const distanceToCenter = calculateDistance(
          userLocation.latitude, 
          userLocation.longitude, 
          circleOptions.center.latitude, 
          circleOptions.center.longitude
        );
        if (distanceToCenter <= circleOptions.radius) {
          // User is inside the geofence circle
            setShowWelcomeMessage(true);
		  setTimeout(() => {
            setShowWelcomeMessage(false);
          }, 5000); // Hide welcome message after 5 seconds
        }
      }
    }, [userLocation]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchBar}>
                <SearchBarWithDropdown onSearch={handleSearch} />
            </View>
            <MapView
			    provider={PROVIDER_GOOGLE}
                style={styles.map}
                ref={mapViewRef}
                initialRegion={{
                    latitude: -0.616022,
                    longitude: 30.657005,
                    latitudeDelta: 0.004,
                    longitudeDelta: 0.004,
                }}
            >  
                <Geojson geojson={must_grounds}/>
                <Circle
                    center={circleOptions.center}
                    radius={circleOptions.radius}
                    strokeColor="rgba(0, 0, 255, 0.5)"
                    fillColor="rgba(0, 0, 255, 0.1)"
                />
                {userLocation && (
                  <Marker
                    coordinate={{
                      latitude: userLocation.latitude,
                      longitude: userLocation.longitude,
                    }}
                    title="Your Location"
                    description="This is your current location"
                  />
                )}
                {new_coordinates.map(item => (
                  <Marker
                    key={item.fid}
                    coordinate={{
                      latitude: parseFloat(item.lattitude),
                      longitude: parseFloat(item.longitude),
                    }}
                    title={item.name}
                    description={item.name}
                    onPress={() => setSelectedItem(item)}
                    pinColor='dodgerblue'
                    opacity={selectedItem ? (selectedItem.fid === item.fid  ? 1 : 0) : 0}
                  />
                ))}
            </MapView>
			{showWelcomeMessage && (
              <View style={styles.welcomeMessageContainer}>
                <Text style={styles.welcomeMessageText}>Welcome to the geofence area!</Text>
              </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 8,
    },
    searchBar:{
      flex: 1,
      alignItems: "flex-start",
      backgroundColor: "white",
      flexDirection: "column",
      padding: 20,
    },
    welcomeMessageContainer: {
      position: 'absolute',
      bottom: 20,
      alignSelf: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      padding: 10,
      borderRadius: 5,
    },
    welcomeMessageText: {
      fontSize: 16,
      fontWeight: 'bold',
    }
	
})

export default MapScreen;