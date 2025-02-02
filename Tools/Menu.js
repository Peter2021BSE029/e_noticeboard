import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, BackHandler, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

function Menu({ admin }) {
  const navigation = useNavigation();
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to logout?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => navigation.navigate('BtmNav') },
      ],
      { cancelable: false }
    );
  };

  const handleConfirmation = () => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to exit?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => BackHandler.exitApp() },
      ],
      { cancelable: false }
    );
  };

  return (
    <View>
      {showMenu && (
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Map')}>
            <Ionicons name="map" size={24} color="#333" style={styles.menuIcon} />
            <Text style={styles.menuText}>Map</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.menuItem} onPress={toggleMenu}>
            <Ionicons name="notifications" size={24} color="#333" style={styles.menuIcon} />
            <Text style={styles.menuText}>Notices</Text>
          </TouchableOpacity> */}
          {admin === 'no' && (
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Login')}>
              <Ionicons name="person" size={24} color="#333" style={styles.menuIcon} />
              <Text style={styles.menuText}>Admin</Text>
            </TouchableOpacity>
          )}
          {admin === 'yes' && (
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Ionicons name="remove-circle" size={24} color="#333" style={styles.menuIcon} />
              <Text style={styles.menuText}>Logout</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('About')}>
            <Ionicons name="information-circle" size={24} color="#333" style={styles.menuIcon} />
            <Text style={styles.menuText}>About Us</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleConfirmation}>
            <Ionicons name="exit" size={24} color="#333" style={styles.menuIcon} />
            <Text style={styles.menuText}>Exit</Text>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity style={styles.menuIcon} onPress={toggleMenu}>
        <Ionicons name={showMenu ? 'close' : 'menu'} size={40} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    padding: 10,
    position: 'absolute',
    top: 40,
    left: 0,
    zIndex: 2,
    flexDirection: 'column',
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: 158,
    height: 210,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 2,
    backgroundColor: 'white',
    width: '100%',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 10,
  },
  menuIcon: {
    marginRight: 10,
  },
});

export default Menu;
