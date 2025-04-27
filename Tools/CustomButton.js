// components/CustomButton.js
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import colors from '../Tools/theme'; // your theme file

const CustomButton = ({ title, onPress, loading = false, disabled = false, theme = 'light', style }) => {
  const c = colors[theme];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled || loading}
      style={[
        styles.button,
        { backgroundColor: c.accent, opacity: disabled ? 0.6 : 1 },
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={[styles.text, { color: c.buttonText || '#fff' }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 20
  },
  text: {
    fontSize: 16,
    fontWeight: '600'
  }
});

export default CustomButton;
