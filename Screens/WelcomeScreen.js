import React from 'react';
import { StyleSheet, Text, SafeAreaView, Button, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function WelcomeScreen(props) {
  const navigation = useNavigation();

  const nextPage =  () => {
    navigation.navigate('BtmNav')
  }
  
  return (
    <ImageBackground source={require('../assets/images/compass.png')} style={styles.backgroundImage}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.welcomeText}>Campus Guide</Text>
        <Text style={styles.descriptionText}>
          Locate Places Easier...
        </Text>
        <Button
          title="Get Started"
          buttonStyle={styles.button}
          color="#5856D6"
          onPress={nextPage}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 70,
  },
  descriptionText: {
    fontSize: 24,
    color: 'black',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    //backgroundColor: '#4CAF50',
    width: 200,
    borderRadius: 10,
  },
});

export default WelcomeScreen;