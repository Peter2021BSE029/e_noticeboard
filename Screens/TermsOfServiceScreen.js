import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../Tools/ThemeContext';
import colors from '../Tools/theme'; // 🌈 Import your theme color definitions

const TermsOfServiceScreen = () => {
  const { theme } = useTheme(); // 'dark' or 'light'
  const styles = getStyles(colors[theme]); // Use theme-aware styles

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Terms of Service</Text>
      <Text style={styles.text}>
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

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      padding: 20,
      flexGrow: 1,
      backgroundColor: theme.background,
    },
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 15,
    },
    text: {
      fontSize: 16,
      lineHeight: 24,
      color: theme.textSecondary || theme.text,
    },
  });

export default TermsOfServiceScreen;
