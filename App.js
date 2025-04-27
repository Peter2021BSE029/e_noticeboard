import './gesture-handler';
import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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