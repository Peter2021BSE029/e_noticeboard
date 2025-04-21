import React, { useEffect, useState, useCallback, useRef } from 'react';
import { StyleSheet, SafeAreaView, View, Alert, Text } from 'react-native';
import MapView, { Geojson, Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import new_coordinates from "../MapAssets/new_coordinates.json";
import must_grounds from "../MapAssets/must_grounds.json";
import SearchBarWithDropdown from '../Tools/SearchBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../Tools/ThemeContext';
import colors from '../Tools/theme';

function MapScreen() {
  const { theme } = useTheme();
  const themeColors = colors[theme];

  const [userLocation, setUserLocation] = useState(null);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [insideGeofence, setInsideGeofence] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);

  const mapViewRef = useRef(null);

  const center = { latitude: -0.616202, longitude: 30.656905 };
  const radius = 240;
  const circleOptions = { center, radius };

  useEffect(() => {
    AsyncStorage.setItem('insideGeofence', insideGeofence ? 'true' : 'false');
  }, [insideGeofence]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'You need to grant location permission to use this app.');
        return;
      }

      const isLocationEnabled = await Location.hasServicesEnabledAsync();
      if (!isLocationEnabled) {
        Alert.alert('Location services disabled', 'Please enable location services to use this app.');
        return;
      }

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000,
        },
        (location) => {
          const { latitude, longitude } = location.coords;
          setUserLocation({ latitude, longitude });

          const distanceToCenter = calculateDistance(
            latitude,
            longitude,
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

  useEffect(() => {
    if (userLocation) {
      const distanceToCenter = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        circleOptions.center.latitude,
        circleOptions.center.longitude
      );

      if (distanceToCenter <= circleOptions.radius) {
        setShowWelcomeMessage(true);
        setTimeout(() => setShowWelcomeMessage(false), 5000);
      }
    }
  }, [userLocation]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // meters
  };

  const deg2rad = (deg) => deg * (Math.PI / 180);

  const handleSearch = (text) => {
    const foundItem = new_coordinates.find(item =>
      item.name.toLowerCase() === text.toLowerCase()
    );

    if (foundItem) {
      const { lattitude, longitude, fid } = foundItem;
      const coords = {
        latitude: parseFloat(lattitude),
        longitude: parseFloat(longitude),
        fid
      };
      setSelectedItem(coords);
      setSearchLocation(coords);
    } else {
      Alert.alert('Not Found', `Location "${text}" not found.`);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchLocationName = async () => {
        const locationName = await AsyncStorage.getItem("locationName");
        if (locationName) {
          handleSearch(locationName);
          await AsyncStorage.removeItem("locationName");
        }
      };
      fetchLocationName();
    }, [])
  );

  useEffect(() => {
    if (searchLocation && mapViewRef.current) {
      mapViewRef.current.animateToRegion({
        ...searchLocation,
        latitudeDelta: 0.0009,
        longitudeDelta: 0.0009,
      });
    }
  }, [searchLocation]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={[styles.searchBar, { backgroundColor: themeColors.secondary }]}>
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
        <Geojson geojson={must_grounds} />
        <Circle
          center={circleOptions.center}
          radius={circleOptions.radius}
          strokeColor="rgba(0, 0, 255, 0.5)"
          fillColor="rgba(0, 0, 255, 0.1)"
        />
        {userLocation && (
          <Marker
            coordinate={userLocation}
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
            pinColor="dodgerblue"
            opacity={selectedItem ? (selectedItem.fid === item.fid ? 1 : 0) : 0}
          />
        ))}
      </MapView>
      {showWelcomeMessage && (
        <View style={[styles.welcomeMessageContainer, { backgroundColor: themeColors.accent }]}>
          <Text style={[styles.welcomeMessageText, { color: themeColors.text }]}>
            Welcome to the geofence area!
          </Text>
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
  searchBar: {
    flex: 1,
    alignItems: "flex-start",
    flexDirection: "column",
    padding: 20,
  },
  welcomeMessageContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    padding: 10,
    borderRadius: 5,
  },
  welcomeMessageText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MapScreen;
