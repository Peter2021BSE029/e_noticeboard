import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Notice = ({ notice }) => {
  const handlePress = () => {
    // Handle navigation or showing full details
    console.log('Notice clicked:', notice.title);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.noticeContainer}>
      <Text style={styles.title}>{notice.title}</Text>
      <Text style={styles.date}>{notice.date}</Text>
      <Text style={styles.summary}>{notice.summary}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  noticeContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  date: {
    color: '#888',
    fontSize: 12,
  },
  summary: {
    fontSize: 14,
  },
});

export default Notice;
