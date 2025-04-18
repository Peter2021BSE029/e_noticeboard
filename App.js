import './gesture-handler';
//import { StatusBar } from 'expo-status-bar';
//import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
//import 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

//import SignupScreen from './Screens/SignupScreen';
import WelcomeScreen from './Screens/WelcomeScreen';
import AppBtmNav from './Tools/AppBtmNav';
import AdminBtmNav from './Tools/AdminBtmNav';
import AboutScreen from './Screens/AboutScreen'
import { NoticeBoardProvider } from './E-NoticeBoard';
import AppRootNavigator from './Navigation/AppNavigator';
import { ThemeProvider } from './Tools/ThemeContext';

import { AuthProvider } from './Tools/AuthContext';
import Toast from 'react-native-toast-message';

export default function App() {

  const Stack = createStackNavigator();

  return (
    <AuthProvider>
	  <ThemeProvider>
        <NoticeBoardProvider>
		  <AppRootNavigator />
          <Toast/>
        </NoticeBoardProvider>
	  </ThemeProvider>
    </AuthProvider>
  );
}
