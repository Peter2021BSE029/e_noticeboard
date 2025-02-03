import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, SafeAreaView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';  // Make sure to import the icons
import { useNavigation } from '@react-navigation/native'; 

function NoticeScreen() {
  const [notices, setNotices] = useState([
    {
      id: 1,
      title: 'Notice Title 1',
      datePosted: '2025-02-02',
      description: 'This is the first notice. It provides important details regarding upcoming events and activities. Make sure to read it carefully.',
      postedBy: 'Admin',
    },
    {
      id: 2,
      title: 'Notice Title 2',
      datePosted: '2025-02-01',
      description: 'Second notice with more details. Please pay attention to the upcoming deadlines. This is a longer description...',
      postedBy: 'Staff Member',
    },
  ]);
  
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a refresh (In the future, this would fetch from Firebase)
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const handlePressNotice = (notice) => {
    setSelectedNotice(notice); // Show the detailed view when a notice is clicked
  };

  const handleGoBack = () => {
    setSelectedNotice(null); // Go back to the list view
  };

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    // Logic to filter notices by the search query will go here
  };

  const handleSort = (sortBy) => {
    // Logic for sorting notices will go here (by date, title, etc.)
  };

  const handleFilter = () => {
    // Logic for filtering notices by department, time, etc., will go here
  };

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
          <Text style={styles.title}>{selectedNotice.title}</Text>
          <Text style={styles.date}>{selectedNotice.datePosted}</Text>
          <Text style={styles.description}>{selectedNotice.description}</Text>
          <Text style={styles.postedBy}>Posted by: {selectedNotice.postedBy}</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <SafeAreaView style={styles.view}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Notice Board</Text>
          <View style={styles.iconsContainer}>
            <TouchableOpacity onPress={() => handleSearchChange('')}>
              <Ionicons name="search" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleFilter}>
              <Ionicons name="filter" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
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

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
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
  topBarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noticeBox: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  description: {
    fontSize: 16,
    color: '#333',
  },
  postedBy: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#999',
  },
  backButton: {
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    marginBottom: 20,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    paddingLeft: 10,
  },
});

export default NoticeScreen;
