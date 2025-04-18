import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import NoticeScreen from '../Screens/NoticeScreen';
import MapScreen from '../Screens/MapScreen';
import ChatScreen from '../Screens/ChatScreen';
import LoginScreen from '../Screens/LoginScreen';
import SignupScreen from '../Screens/SignupScreen';
import ApplicationScreen from '../Screens/ApplicationScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import SettingsScreen from '../Screens/SettingsScreen';
import TermsOfServiceScreen from '../Screens/TermsOfServiceScreen';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from '../Tools/AuthContext';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: true }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
}

function CustomDrawerContent(props) {
  const { logout } = useContext(AuthContext);
  const navigation = props.navigation;

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="Home"
        icon={({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />}
        onPress={() => navigation.navigate('Notices')}
      />
      <DrawerItem
        label="Profile"
        icon={({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />}
        onPress={() => navigation.navigate('Profile')}
      />
      <DrawerItem
        label="Settings"
        icon={({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />}
        onPress={() => navigation.navigate('Settings')}
      />
      <DrawerItem
        label="Terms of Service"
        icon={({ color, size }) => <Ionicons name="document-text-outline" size={size} color={color} />}
        onPress={() => navigation.navigate('TermsOfService')}
      />
      <DrawerItem
        label="Application"
        icon={({ color, size }) => <Ionicons name="create-outline" size={size} color={color} />}
        onPress={() => navigation.navigate('ApplicationScreen')}
      />

      {/* Logout Button */}
      <DrawerItem
        label="Logout"
        icon={({ color, size }) => <Ionicons name="log-out-outline" size={size} color={color} />}
        onPress={() => logout()}
      />
    </DrawerContentScrollView>
  );
}

// Tab Navigator for main screens
function MainStack() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName;

          if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Notices') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'ChatBot') {
            iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
          }

          const iconColor = focused ? 'blue' : 'gray';
          const iconSize = focused ? 30 : 25;

          return <Ionicons name={iconName} size={iconSize} color={iconColor} />;
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Notices" component={NoticeScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="ChatBot" component={ChatScreen} />
    </Tab.Navigator>
  );
}

// Drawer Navigator
function AppNavigator() {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Campus Connect" component={MainStack} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="TermsOfService" component={TermsOfServiceScreen} />
      <Drawer.Screen name="ApplicationScreen" component={ApplicationScreen} />
      <Drawer.Screen name="Authentication" component={AuthNavigator} />
    </Drawer.Navigator>
  );
}

function AppRootNavigator() {
  const { user } = useContext(AuthContext);
  
  console.log('User in RootNavigator:', user);

  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}


export default AppRootNavigator;
