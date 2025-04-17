import '../gesture-handler';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, SafeAreaView, TextInput, Alert, BackHandler, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { database, onValue, ref } from '../Firebase/firebase'; // Import Firebase modules


import MapScreen from './MapScreen';
import AdminBtmNav from '../Tools/AdminBtmNav';
import AboutUsScreen from './AboutScreen';

const Drawer = createDrawerNavigator();

// NoticeScreen Component
function NoticeScreen() {
  const [notices, setNotices] = useState([]);

  const [selectedNotice, setSelectedNotice] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch notices from Firebase Realtime Database
  const fetchNotices = () => {
    const noticesRef = ref(database, 'notices'); // Reference to the 'notices' node in Firebase
    onValue(noticesRef, (snapshot) => {
      const noticesData = snapshot.val(); // Get the data from the snapshot
      if (noticesData) {
        // Convert the object of notices into an array
        const noticesArray = Object.keys(noticesData).map((key) => ({
          id: key, // Use the Firebase key as the ID
          ...noticesData[key], // Spread the notice data
        }));
        setNotices(noticesArray); // Update the state with the fetched notices
      } else {
        setNotices([]); // If no data, set notices to an empty array
      }
    });
  };

  // Fetch notices when the component mounts
  useEffect(() => {
    fetchNotices();
  }, []);

  // Refresh notices
  const onRefresh = () => {
    setRefreshing(true);
    fetchNotices(); // Re-fetch notices
    setTimeout(() => setRefreshing(false), 1000); // Simulate a delay
  };

  const handlePressNotice = (notice) => setSelectedNotice(notice);
  const handleGoBack = () => setSelectedNotice(null);
  const handleSearchChange = (text) => setSearchQuery(text);

  if (selectedNotice) {
    return (
      <SafeAreaView style={styles.view}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Notice Details</Text>
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.noticeDetailBox}>
            <Text style={styles.title}>{selectedNotice.title}</Text>
            <Text style={styles.date}>{selectedNotice.datePosted}</Text>
            <Text style={styles.description}>{selectedNotice.description}</Text>
            <Text style={styles.description}>Date: {selectedNotice.date}</Text>
            <Text style={styles.description}>Time: {selectedNotice.time}</Text>
            <Text style={styles.description}>Venue: {selectedNotice.venue}</Text>
            <Text style={styles.postedBy}>Posted by: {selectedNotice.postedBy}</Text>
            {selectedNotice.image && (
              <Image source={{ uri: selectedNotice.image }} style={styles.detailImage} />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <SafeAreaView style={styles.view}>

        <TextInput
          style={styles.searchInput}
          placeholder="Search notices..."
          value={searchQuery}
          onChangeText={handleSearchChange}
        />
        {notices.map((notice) => (
          <TouchableOpacity key={notice.id} onPress={() => handlePressNotice(notice)} style={styles.noticeBox}>
            <Text style={styles.title}>{notice.title}</Text>
            <Text style={styles.date}>{notice.datePosted}</Text>
            <Text style={styles.description}>{notice.description.slice(0, 100)}...</Text>
            <Text style={styles.postedBy}>Posted by: {notice.postedBy}</Text>
          </TouchableOpacity>
        ))}
      </SafeAreaView>
    </ScrollView>
  );
}

export default NoticeScreen; // Export only the drawer which includes everything

// Styles
const styles = StyleSheet.create({
  view: { flex: 1, backgroundColor: '#d9d9d9', padding: 20 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  topBarTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  iconsContainer: { flexDirection: 'row', alignItems: 'center' },
  noticeBox: { marginBottom: 20, padding: 15, backgroundColor: '#f1f1f1', borderRadius: 8 },
  noticeDetailBox: { margin: 20, padding: 20, backgroundColor: '#ffffff', borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  date: { fontSize: 14, color: '#666' },
  description: { fontSize: 16, color: '#333' },
  postedBy: { fontSize: 12, fontStyle: 'italic', color: '#999' },
  searchInput: { height: 40, borderColor: '#ddd', borderWidth: 1, borderRadius: 8, marginVertical: 10, paddingLeft: 10 },
  screenContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  linkText: { color: '#1e90ff', marginTop: 20, fontSize: 16 },
  detailImage: { width: '100%', height: 200, borderRadius: 5, marginTop: 10 },
});
