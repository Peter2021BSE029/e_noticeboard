import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../Screens/NoticeScreen';
import MapScreen from '../Screens/MapScreen';
import ChatScreen from '../Screens/ChatScreen';
import LoginScreen from '../Screens/LoginScreen';
import SignupScreen from '../Screens/SignupScreen';
import ApplicationScreen from '../Screens/ApplicationScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import SettingsScreen from '../Screens/SettingsScreen';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';


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
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="Home"
        onPress={() => props.navigation.navigate('Home')}
      />
      <DrawerItem
        label="Profile"
        onPress={() => props.navigation.navigate('Profile')}
      />
      <DrawerItem
        label="Settings"
        onPress={() => props.navigation.navigate('Settings')}
      />
      <DrawerItem
        label="Login"
        onPress={() => props.navigation.navigate('Authentication')}
      />
	  <DrawerItem
        label="Application"
        onPress={() => props.navigation.navigate('ApplicationScreen')}
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

				// Set different icon names for different tabs
				if (route.name === 'Map') {
					iconName = focused ? 'map' : 'map-outline';
				} else if (route.name === 'Home') {
					iconName = focused ? 'home' : 'home-outline';
				} else if (route.name === 'Chat') {
					iconName = focused ? 'chatbubble' : 'chatbubble-outline';
				}

				// Set different colors and sizes based on the tab's state
				const iconColor = focused ? 'blue' : 'gray';
				const iconSize = focused ? 30 : 25;

				return <Ionicons name={iconName} size={iconSize} color={iconColor} />;
			},
			headerShown: false, // Hides the header
		})}
	>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
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
      <Drawer.Screen name="Authentication" component={AuthNavigator} />
	  <Drawer.Screen name="ApplicationScreen" component={ApplicationScreen} />
    </Drawer.Navigator>
  );
}

export default AppNavigator;