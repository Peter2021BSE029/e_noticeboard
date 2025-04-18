//import './gesture-handler';
//import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
//import { createStackNavigator } from '@react-navigation/stack';
//import 'react-native-gesture-handler';

import AppNavigator from './Navigation/AppNavigator';

export default function App() {
  //const Stack = createStackNavigator();

  return (
	<NavigationContainer>
		<AppNavigator/>
	</NavigationContainer>
  );
}
