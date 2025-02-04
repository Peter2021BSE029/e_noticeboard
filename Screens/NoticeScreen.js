import '../gesture-handler';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, SafeAreaView, TextInput, Alert, BackHandler } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

// NoticeScreen Component
function NoticeScreen() {
  const [notices, setNotices] = useState([
    {
      id: 1,
      title: 'Notice Title 1',
      datePosted: '2025-02-02',
      description: 'This is the first notice...',
      postedBy: 'Admin',
    },
    {
      id: 2,
      title: 'Notice Title 2',
      datePosted: '2025-02-01',
      description: 'Second notice with more details...',
      postedBy: 'Staff Member',
    },
  ]);

  const [selectedNotice, setSelectedNotice] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
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
          <Text style={styles.title}>{selectedNotice.title}</Text>
          <Text style={styles.date}>{selectedNotice.datePosted}</Text>
          <Text style={styles.description}>{selectedNotice.description}</Text>
          <Text style={styles.postedBy}>Posted by: {selectedNotice.postedBy}</Text>
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
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="menu" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Notice Board</Text>
          <View style={styles.iconsContainer}>
            <TouchableOpacity onPress={() => handleSearchChange('')}>
              <Ionicons name="search" size={24} color="black" />
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

// Other Screens
function MapScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text>Map Screen</Text>
    </View>
  );
}

function AdminScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.screenContainer}>
      <Text>Admin Screen</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Go to Admin Login</Text>
      </TouchableOpacity>
    </View>
  );
}

function AboutUsScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text>About Us Screen</Text>
    </View>
  );
}

function LogoutScreen() {
  const navigation = useNavigation();
  const handleLogout = () => {
    Alert.alert('Confirmation', 'Are you sure you want to logout?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', onPress: () => navigation.navigate('Login') },
    ]);
  };
  return (
    <View style={styles.screenContainer}>
      <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.linkText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

function ExitScreen() {
  const handleExit = () => {
    Alert.alert('Confirmation', 'Are you sure you want to exit?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', onPress: () => BackHandler.exitApp() },
    ]);
  };
  return (
    <View style={styles.screenContainer}>
      <TouchableOpacity onPress={handleExit}>
        <Text style={styles.linkText}>Exit App</Text>
      </TouchableOpacity>
    </View>
  );
}

// Drawer Navigator
const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator initialRouteName="Notice Board">
        <Drawer.Screen name="Notice Board" component={NoticeScreen} />
        <Drawer.Screen name="Map" component={MapScreen} />
        <Drawer.Screen name="Admin" component={AdminScreen} />
        <Drawer.Screen name="About Us" component={AboutUsScreen} />
        <Drawer.Screen name="Log out" component={LogoutScreen} />
        <Drawer.Screen name="Exit" component={ExitScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default MyDrawer; // Export only the drawer which includes everything

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
  title: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  date: { fontSize: 14, color: '#666' },
  description: { fontSize: 16, color: '#333' },
  postedBy: { fontSize: 12, fontStyle: 'italic', color: '#999' },
  searchInput: { height: 40, borderColor: '#ddd', borderWidth: 1, borderRadius: 8, marginVertical: 10, paddingLeft: 10 },
  screenContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  linkText: { color: '#1e90ff', marginTop: 20, fontSize: 16 },
});
