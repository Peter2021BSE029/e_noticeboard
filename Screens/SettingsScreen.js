import React from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import * as Application from 'expo-application';
import { useTheme } from '../Tools/ThemeContext';

const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const { theme, toggleTheme } = useTheme();
  const darkModeEnabled = theme === 'dark';
  const navigation = useNavigation();

  const openPrivacyPolicy = () => {
    // You can link to an external URL or navigate to an in-app screen
    Linking.openURL('https://www.must.ac.ug/downloads/policies/MUST%20Intellectual%20Property%20Policy.pdf').catch(() =>
      Alert.alert('Error', 'Unable to open privacy policy')
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: darkModeEnabled ? '#000' : '#fff' }]}>
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Enable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={[styles.settingText, { color: darkModeEnabled ? '#fff' : '#000' }]}>
          Dark Mode
        </Text>
        <Switch value={darkModeEnabled} onValueChange={toggleTheme} />
      </View>

      <TouchableOpacity style={styles.linkItem} onPress={openPrivacyPolicy}>
        <Text style={styles.linkText}>Privacy Policy</Text>
      </TouchableOpacity>

<TouchableOpacity style={styles.linkItem} onPress={() => navigation.navigate('TermsOfService')}>
  <Text style={styles.linkText}>Terms of Service</Text>
</TouchableOpacity>

      <View style={styles.versionInfo}>
<Text style={{ color: '#777' }}>
  App Version:{' '}
  {Constants?.manifest?.version || Application.nativeApplicationVersion || 'N/A'}
</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingText: {
    fontSize: 18,
  },
  linkItem: {
    paddingVertical: 15,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  linkText: {
    fontSize: 16,
    color: '#007BFF',
  },
  versionInfo: {
    marginTop: 30,
    alignItems: 'center',
  },
});

export default SettingsScreen;
