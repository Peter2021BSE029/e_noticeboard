import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../Tools/ThemeContext';

const TermsOfServiceScreen = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <Text style={[styles.heading, { color: isDark ? '#fff' : '#000' }]}>Terms of Service</Text>
      <Text style={[styles.text, { color: isDark ? '#ccc' : '#333' }]}>
        Welcome to MUST E-Noticeboard. By using this app, you agree to the following terms...
        {'\n\n'}
        1. You shall not post offensive or unauthorized content.
        {'\n'}
        2. Notices expire after their stated expiry date.
        {'\n'}
        3. Your data is handled according to our Privacy Policy.
        {'\n\n'}
        For any concerns, contact ICT Department at MUST.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default TermsOfServiceScreen;
