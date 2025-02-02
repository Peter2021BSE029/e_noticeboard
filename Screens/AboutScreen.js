import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AboutScreen = ({ navigation }) => {
  return (
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome to Campus Guide!</Text>

        <View style={{padding: 10}}>
            <Text style={styles.descriptionText}>
                Are you tired of getting lost on campus? Do you want to stay up-to-date with the latest events and happenings on campus? Do you want to feel safer and more secure while on campus? If so, then Campus Guide is the perfect app for you!
            </Text>
        </View>

        <View style={{padding: 10}}>
            <Text style={styles.descriptionText}>
                Your one-stop solution for navigating and exploring MUST. Stay up-to-date with the latest events and happenings on campus.
            </Text>
        </View>

        <View style={{padding: 10}}>
            <Text style={styles.descriptionText}>
                Feel free to reach out to us on 
                Phone Number: 0760843099 / 0700991667
            </Text>
        </View>

      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default AboutScreen;
