// ./Screens/SplashScreen.js
import React from 'react';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../Tools/ThemeContext';
import colors from '../Tools/theme';

export default function SplashScreen() {
  const { theme } = useTheme();
  const themeColor = colors[theme];

  return (
    <View style={[styles.container, { backgroundColor: themeColor.background }]}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color={themeColor.accent} style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 250,
    height: 250,
  },
  spinner: {
    marginTop: 30,
  },
});
