import React from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import * as Application from 'expo-application';
import { useTheme } from '../Tools/ThemeContext';
import colors from '../Tools/theme'; // <- make sure this path is correct

const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const { theme, toggleTheme } = useTheme();
  const navigation = useNavigation();
  const themeColor = colors[theme];

  const openPrivacyPolicy = () => {
    Linking.openURL(
      'https://www.must.ac.ug/downloads/policies/MUST%20Intellectual%20Property%20Policy.pdf'
    ).catch(() =>
      Alert.alert('Error', 'Unable to open privacy policy')
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColor.background }]}>
      <View style={styles.settingItem}>
        <Text style={[styles.settingText, { color: themeColor.text }]}>
          Enable Notifications
        </Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          thumbColor={theme === 'dark' ? themeColor.yellow : themeColor.primary}
          trackColor={{ false: '#ccc', true: themeColor.primary }}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={[styles.settingText, { color: themeColor.text }]}>
          Dark Mode
        </Text>
        <Switch
          value={theme === 'dark'}
          onValueChange={toggleTheme}
          thumbColor={theme === 'dark' ? themeColor.yellow : themeColor.primary}
          trackColor={{ false: '#ccc', true: themeColor.primary }}
        />
      </View>

      <TouchableOpacity
        style={[styles.linkItem, { borderBottomColor: themeColor.border }]}
        onPress={openPrivacyPolicy}
      >
        <Text style={[styles.linkText, { color: themeColor.text }]}>
          Privacy Policy
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.linkItem, { borderBottomColor: themeColor.border }]}
        onPress={() => navigation.navigate('TermsOfService')}
      >
        <Text style={[styles.linkText, { color: themeColor.text }]}>
          Terms of Service
        </Text>
      </TouchableOpacity>

      <View style={styles.versionInfo}>
        <Text style={{ color: themeColor.text }}>
          App Version:{' '}
          {Constants?.manifest?.version ||
            Application.nativeApplicationVersion ||
            'N/A'}
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
    borderBottomWidth: 1,
  },
  linkText: {
    fontSize: 16,
  },
  versionInfo: {
    marginTop: 30,
    alignItems: 'center',
  },
});

export default SettingsScreen;
