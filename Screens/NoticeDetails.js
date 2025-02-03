import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';

function NoticeDetails({ route }) {
  const { notice } = route.params;

  return (
    <SafeAreaView style={styles.view}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={styles.title}>{notice.title}</Text>
        <Text style={styles.date}>{notice.datePosted}</Text>
        <Text style={styles.description}>{notice.description}</Text>
        <Text style={styles.postedBy}>Posted by: {notice.postedBy}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  postedBy: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#999',
  },
});

export default NoticeDetails;
