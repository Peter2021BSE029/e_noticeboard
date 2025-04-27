// ./Navigation/AppNavigator.js
import React, { useContext, useEffect, useState } from 'react'; 
import { Text, StatusBar } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { AuthContext } from '../Tools/AuthContext';
import { useTheme } from '../Tools/ThemeContext';
import colors from '../Tools/theme';

import SplashScreen from '../Screens/SplashScreen';
import NoticeScreen from '../Screens/NoticeScreen';
import CreateNoticeScreen from '../Screens/CreateNoticeScreen'; // ✅ Newly added
import MapScreen from '../Screens/MapScreen';
import ChatScreen from '../Screens/ChatScreen';
import LoginScreen from '../Screens/LoginScreen';
import SignupScreen from '../Screens/SignupScreen';
import ApplicationScreen from '../Screens/ApplicationScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import SettingsScreen from '../Screens/SettingsScreen';
import TermsOfServiceScreen from '../Screens/TermsOfServiceScreen';
import EmailVerificationPendingScreen from '../Screens/EmailVerificationPendingScreen';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();
const Stack = createStackNavigator();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: true }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
      <AuthStack.Screen name="EmailVerificationPending" component={EmailVerificationPendingScreen} />
    </AuthStack.Navigator>
  );
}

function SettingsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
    </Stack.Navigator>
  );
}

function CustomDrawerContent(props) {
  const { logout, user } = useContext(AuthContext);  // Get user context
  const { theme } = useTheme();
  const themeColor = colors[theme];
  const navigation = props.navigation;
  const state = props.state;

  const isRouteActive = (routeName) => {
    const focusedRoute = state.routeNames[state.index];
    return focusedRoute === routeName;
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="Home"
        labelStyle={{ color: themeColor.text }}
        icon={({ size }) => <Ionicons name="home-outline" size={size} color={themeColor.accent} />}
        onPress={() => navigation.navigate('Home')}
        style={{
          backgroundColor: isRouteActive('Home') ? themeColor.card : 'transparent',
          borderRadius: 10,
          marginHorizontal: 5,
        }}
      />
      <DrawerItem
        label="Profile"
        labelStyle={{ color: themeColor.text }}
        icon={({ size }) => <Ionicons name="person-outline" size={size} color={themeColor.accent} />}
        onPress={() => navigation.navigate('Profile')}
        style={{
          backgroundColor: isRouteActive('Profile') ? themeColor.card : 'transparent',
          borderRadius: 10,
          marginHorizontal: 5,
        }}
      />
      <DrawerItem
        label="Settings"
        labelStyle={{ color: themeColor.text }}
        icon={({ size }) => <Ionicons name="settings-outline" size={size} color={themeColor.accent} />}
        onPress={() => navigation.navigate('Settings')}
        style={{
          backgroundColor: isRouteActive('Settings') ? themeColor.card : 'transparent',
          borderRadius: 10,
          marginHorizontal: 5,
        }}
      />
      <DrawerItem
        label="Terms of Service"
        labelStyle={{ color: themeColor.text }}
        icon={({ size }) => <Ionicons name="document-text-outline" size={size} color={themeColor.accent} />}
        onPress={() => navigation.navigate('TermsOfService')}
        style={{
          backgroundColor: isRouteActive('TermsOfService') ? themeColor.card : 'transparent',
          borderRadius: 10,
          marginHorizontal: 5,
        }}
      />
      {user?.role === 'creator' ? (
        <DrawerItem
          label="Create Notice"
          labelStyle={{ color: themeColor.text }}
          icon={({ size }) => <Ionicons name="add-circle-outline" size={size} color={themeColor.accent} />}
          onPress={() => navigation.navigate('CreateNoticeScreen')}
          style={{
            backgroundColor: isRouteActive('CreateNoticeScreen') ? themeColor.card : 'transparent',
            borderRadius: 10,
            marginHorizontal: 5,
          }}
        />
      ) : (
        <DrawerItem
          label="Application"
          labelStyle={{ color: themeColor.text }}
          icon={({ size }) => <Ionicons name="create-outline" size={size} color={themeColor.accent} />}
          onPress={() => navigation.navigate('ApplicationScreen')}
          style={{
            backgroundColor: isRouteActive('ApplicationScreen') ? themeColor.card : 'transparent',
            borderRadius: 10,
            marginHorizontal: 5,
          }}
        />
      )}
      <DrawerItem
        label="Logout"
        labelStyle={{ color: 'red' }}
        icon={({ size }) => <Ionicons name="log-out-outline" size={size} color="red" />}
        onPress={logout}
        style={{
          marginHorizontal: 5,
        }}
      />
    </DrawerContentScrollView>
  );
}

function MainStack() {
  const { theme } = useTheme();
  const themeColor = colors[theme];

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarLabel: ({ focused }) => (
          <Text style={{ color: focused ? themeColor.accent : themeColor.tabInactive, fontSize: 12 }}>
            {route.name}
          </Text>
        ),
        tabBarIcon: ({ focused }) => {
          let iconName;
          if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Notices') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'ChatBot') {
            iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
          }
          return (
            <Ionicons
              name={iconName}
              size={focused ? 28 : 24}
              color={focused ? themeColor.accent : themeColor.tabInactive}
            />
          );
        },
        headerShown: false,
        tabBarStyle: {
          backgroundColor: themeColor.background,
        },
      })}
    >
      <Tab.Screen name="Notices" component={NoticeScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="ChatBot" component={ChatScreen} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { user } = useContext(AuthContext);  // Get user context
  const { theme } = useTheme();
  const themeColor = colors[theme];

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: themeColor.background,
        },
        headerTintColor: themeColor.text,
        drawerActiveTintColor: themeColor.secondary,
        drawerInactiveTintColor: themeColor.tabInactive,
        drawerStyle: {
          backgroundColor: themeColor.background,
          width: 240,
        },
      }}
    >
      <Drawer.Screen name="Home" component={MainStack} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Settings" component={SettingsStack} />
      <Drawer.Screen name="TermsOfService" component={TermsOfServiceScreen} />
      <Drawer.Screen name="ApplicationScreen" component={ApplicationScreen} />
      <Drawer.Screen name="CreateNoticeScreen" component={CreateNoticeScreen} />
    </Drawer.Navigator>
  );
}

function AppRootNavigator() {
  const { user, isLoading } = useContext(AuthContext);
  const { theme } = useTheme();

  if (isLoading) {
    return <SplashScreen />; // 🚀 Show Splash screen while loading
  }

  return (
    <>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <NavigationContainer theme={theme === 'dark' ? DarkTheme : DefaultTheme}>
        {user ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </>
  );
}

export default AppRootNavigator;
