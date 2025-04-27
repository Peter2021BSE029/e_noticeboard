// ./Screens/EmailVerificationPendingScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, Alert } from 'react-native';
import { getAuth, sendEmailVerification } from 'firebase/auth';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../Tools/ThemeContext';
import colors from '../Tools/theme';

const EmailVerificationPendingScreen = () => {
  const { email } = useRoute().params;
  const navigation = useNavigation();
  const { theme } = useTheme();
  const c = colors[theme];

  const [loading, setLoading] = useState(false);

  const resendEmail = async () => {
    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user && !user.emailVerified) {
        await sendEmailVerification(user);
        Alert.alert("Verification Email Sent", "Please check your email inbox.");
      } else {
        Alert.alert("Error", "No unverified user found.");
      }
    } catch (err) {
      console.error("Error sending verification email:", err);
      Alert.alert("Error", "Failed to send verification email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <Text style={[styles.title, { color: c.text }]}>Verify Your Email</Text>
      <Text style={[styles.message, { color: c.text }]}>
        We've sent a verification email to:
      </Text>
      <Text style={[styles.email, { color: c.accent }]}>{email}</Text>
      <Text style={[styles.message, { color: c.text }]}>
        Please verify your email to continue.
      </Text>

      {loading ? (
        <ActivityIndicator color={c.accent} style={{ marginVertical: 20 }} />
      ) : (
        <Button title="Resend Email" color={c.primary} onPress={resendEmail} />
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="Back to Login" onPress={() => navigation.navigate('Login')} color={c.border} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  message: { fontSize: 16, textAlign: 'center', marginVertical: 5 },
  email: { fontSize: 16, textAlign: 'center', fontWeight: '600', marginBottom: 15 },
});

export default EmailVerificationPendingScreen;
