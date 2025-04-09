import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, TextInput, Button, Alert, Keyboard, View, Text, TouchableOpacity, Image } from 'react-native';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { database, ref, set, get, storage, storageRef, uploadBytes, getDownloadURL } from '../Firebase/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker'; // For image picking

const ApplicationScreen = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [position, setPosition] = useState("");
    const [image, setImage] = useState(null); // State for the selected image
    const [applicationPresent, setApplicationPresent] = useState(false); // State to track if application exists
    const navigation = useNavigation();

    // Check if the user already has an application
    useEffect(() => {
        const checkApplication = async () => {
            const uid = await AsyncStorage.getItem('uid');
            if (uid) {
                const applicationRef = ref(database, `applications/${uid}`);
                const snapshot = await get(applicationRef);
                if (snapshot.exists()) {
                    setApplicationPresent(true); // Application exists
                }
            }
        };

        checkApplication();
    }, []);

    // Show toast notification
    const showToast = () => {
        Toast.show({
            type: 'success',
            text1: 'Application successfully sent!',
            visibilityTime: 2000,
            autoHide: true,
        });
    };

    // Handle image picking
    const pickImage = async () => {
        Keyboard.dismiss();
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'Please grant camera roll permissions to upload an image.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImage(result.assets[0].uri); // In newer Expo versions, images are in the assets array
        }
        else if (!result.canceled && result.uri) {
            setImage(result.uri); // Fallback for older versions
        }
    };

    const submitApplication = async () => {
        const uid = await AsyncStorage.getItem('uid');
        if (!uid) {
            alert("You need to login in order to send an application");
            navigation.navigate('Login');
            return;
        }
        if (name === '' || email === '' || position === '') {
            alert("Please ensure that you've filled all fields!");
            return;
        }
        if (!image) {
            alert("Please upload an image of your student or staff ID.");
            return;
        }
    
        Keyboard.dismiss();
    
        try {
            // Upload the image to Firebase Storage
            const imageReference = storageRef(storage, `id_images/${uid}`); // Create a reference
            const response = await fetch(image); // Convert the image URI to a blob
            const blob = await response.blob();
            await uploadBytes(imageReference, blob); // Upload the blob
            const imageUrl = await getDownloadURL(imageReference); // Get the download URL
    
            // Save the application data to Firebase
            const applicationRef = ref(database, `applications/${uid}`);
            const application = {
                name,
                email,
                position,
                status: 'Pending',
                id: imageUrl, // Store the image URL
            };
            await set(applicationRef, application);
    
            showToast();
            setTimeout(() => navigation.navigate('Apply'), 2500);

        } catch (error) {
            if (error.message === 'Firebase: Error (auth/network-request-failed).') {
                Alert.alert('Network Error', "Please ensure you are connected to the internet");
            } else {
                Alert.alert('Error', error.message);
                //console.log(error.message);
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {applicationPresent && (
                <View style={styles.overlay}>
                    <Text style={styles.message}>You already have an application submitted, please wait for confirmation</Text>
                </View>
            )}
            <View style={styles.headerContainer}>
                <Ionicons name="document-text-outline" size={32} color="#5856D6" />
                <Text style={styles.heading}>Fill in the form to apply for posting events</Text>
            </View>
            <View style={styles.formContainer}>
                <TextInput
                    placeholder="Enter Name:"
                    onChangeText={setName}
                    value={name}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Enter Email (student or staff email):"
                    onChangeText={setEmail}
                    value={email}
                    style={styles.input}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoCorrect={false}
                />
                <TextInput
                    placeholder="Enter position (e.g guild president, student...):"
                    onChangeText={setPosition}
                    value={position}
                    style={styles.input}
                />
                <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                    <Text>{image ? 'Image Selected' : 'Upload student or staff ID Image'}</Text>
                    <Ionicons name="image" size={20} color="#5856D6" />
                </TouchableOpacity>
                {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
                <Button title="Submit" onPress={submitApplication} color="#5856D6" />
            </View>
            <Toast position='bottom' />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    input: {
        height: 45,
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 10,
        color: '#333',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        left: '10%',
    },
    message: {
        fontSize: 16,
        color: 'white',
        alignContent: 'center',
        justifyContent: 'center',
    },
    imagePicker: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    imagePreview: {
        width: 100,
        height: 75,
        marginBottom: 20,
        borderRadius: 5,
    },
});

export default ApplicationScreen;