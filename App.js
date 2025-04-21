import './gesture-handler';
//import { StatusBar } from 'expo-status-bar';
//import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
//import 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';

//import SignupScreen from './Screens/SignupScreen';
import WelcomeScreen from './Screens/WelcomeScreen';
import AboutScreen from './Screens/AboutScreen'
import AppRootNavigator from './Navigation/AppNavigator';
import { ThemeProvider } from './Tools/ThemeContext';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';

import { AuthProvider } from './Tools/AuthContext';
import Toast from 'react-native-toast-message';

export default function App() {

  const Stack = createStackNavigator();

  return (
  <SafeAreaProvider>
    <AuthProvider>
	  <ThemeProvider>
		<AppRootNavigator />
        <Toast/>
	  </ThemeProvider>
    </AuthProvider>
  </SafeAreaProvider>
  );
}


const MainNavigation = () => {
  const { theme } = useTheme();
  const navigationTheme = theme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={navigationTheme}>
      <Navigation />
    </NavigationContainer>
  );
};