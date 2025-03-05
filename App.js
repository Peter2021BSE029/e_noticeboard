import './gesture-handler';
//import { StatusBar } from 'expo-status-bar';
//import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
//import 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from './Screens/LoginScreen';
import SignupScreen from './Screens/SignupScreen';
import WelcomeScreen from './Screens/WelcomeScreen';
import AppBtmNav from './Tools/AppBtmNav';
import AdminBtmNav from './Tools/AdminBtmNav';
import AboutScreen from './Screens/AboutScreen'
import { NoticeBoardProvider } from './E-NoticeBoard';
import AppNavigator from './Navigation/AppNavigator';

export default function App() {

  const Stack = createStackNavigator();

  return (
	<NoticeBoardProvider>
		<NavigationContainer>
		    <AppNavigator />
		</NavigationContainer>
	</NoticeBoardProvider>
  );
}
