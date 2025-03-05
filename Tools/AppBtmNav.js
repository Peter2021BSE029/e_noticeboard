import React, { useState, useEffect } from 'react';
import { BackHandler, SafeAreaView } from 'react-native';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo, otherwise use appropriate icon library
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import NoticeScreen from '../Screens/NoticeScreen';
import MapScreen from '../Screens/MapScreen';
import ChatScreen from '../Screens/ChatScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function AppBtmNav(props) {
    const navigation = useNavigation();
    const [backPressedOnce, setBackPressedOnce] = useState(false);

    useEffect(() => {
        // Hide the entire header
        navigation.setOptions({
          headerShown: false, // This hides the default header (the one showing the tab name)
        });
        
        // Handle back button press
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
          if (!backPressedOnce) {
            showToast();
  
            setBackPressedOnce(true);
            setTimeout(() => setBackPressedOnce(false), 2000); // Reset back press after 2 seconds
            return true; // Prevent default behavior (closing the app)
          } 
          else {
            // Close the app
            BackHandler.exitApp();
            return true;
          }
        });
  
        return () => backHandler.remove(); // Cleanup event listener
    }, [navigation, backPressedOnce]);

    const showToast = () => {
      Toast.show({
        type: 'info',
        text1: 'Press back again to exit',
        visibilityTime: 2000,
        autoHide: true,
      });
    };

    const showLoginToast = () => {
      Toast.show({
        type: 'success',
        text1: 'Welcome to MUST!',
        text2: 'Feel free to check out our events',
        visibilityTime: 5000,
        autoHide: true,
      });
    }

    const [loginToastShown, setLoginToastShown] = useState(false);
    useEffect(() => {
      if (!loginToastShown) {
        showLoginToast();
        setLoginToastShown(true);
      }
    }, [loginToastShown]);

    return (
        <SafeAreaView style={{flex: 1}}>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused }) => {
                        let iconName;
  
                        // Set different icon names for different tabs
                        if (route.name === 'Map') {
                            iconName = focused ? 'map' : 'map-outline';
                        } else if (route.name === 'Notice') {
                            iconName = focused ? 'notifications' : 'notifications-outline';
                        } else if (route.name === 'Chat') {
                            iconName = focused ? 'home' : 'home-outline';
                        }
  
                        // Set different colors and sizes based on the tab's state
                        const iconColor = focused ? 'blue' : 'gray';
                        const iconSize = focused ? 30 : 25;
  
                        return <Ionicons name={iconName} size={iconSize} color={iconColor} />;
                    },
                    headerShown: false, // Hides the header
                })}
            >
                <Tab.Screen name="Notice" component={NoticeScreen} />
                <Tab.Screen name="Map" component={MapScreen} />
                <Tab.Screen name="Chat" component={ChatScreen} />
            </Tab.Navigator>
            <Toast position="bottom" />
        </SafeAreaView>
    );
}

export default AppBtmNav;
