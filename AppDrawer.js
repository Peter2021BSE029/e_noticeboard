// AppDrawer.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import MapScreen from './Screens/MapScreen';
import AdminBtmNav from './Tools/AdminBtmNav';
import AboutUsScreen from './Screens/AboutScreen';
import LoginScreen from './Screens/LoginScreen';
import NoticeScreen from './Screens/NoticeScreen';

const Drawer = createDrawerNavigator();

export default function AppDrawer() {
  return (
    <Drawer.Navigator initialRouteName="Notice Board">
      <Drawer.Screen name="Notice Board" component={NoticeScreen} />
      <Drawer.Screen name="Map" component={MapScreen} />
      <Drawer.Screen name="Admin" component={AdminBtmNav} />
      <Drawer.Screen name="About Us" component={AboutUsScreen} />
      <Drawer.Screen name="Log out" component={LoginScreen} />
    </Drawer.Navigator>
  );
}
