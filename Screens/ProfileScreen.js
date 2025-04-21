import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { get, ref, update } from 'firebase/database';
import { database } from '../Firebase/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../Tools/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../Tools/ThemeContext';
import colors from '../Tools/theme';

const ProfileScreen = () => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const { theme } = useTheme();
  const themeStyles = getStyles(colors[theme]);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [updatedFields, setUpdatedFields] = useState({});

  const uid = user?.uid;

  useEffect(() => {
    if (uid) {
      const fetchUserData = async () => {
        const userRef = ref(database, `users/${uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setProfile(snapshot.val());
        } else {
          Alert.alert('Error', 'User data not found.');
        }
        setLoading(false);
      };
      fetchUserData();
    }
  }, [uid]);

  const handleChange = (field, value) => {
    setUpdatedFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const updates = { ...updatedFields };
      await update(ref(database, `users/${uid}`), updates);
      setProfile((prev) => ({ ...prev, ...updates }));
      setEditing(false);
      setUpdatedFields({});
      Alert.alert('Success', 'Profile updated.');
    } catch (err) {
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  if (loading) {
    return (
      <View style={themeStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors[theme].primary} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={themeStyles.container}>
      <Text style={themeStyles.heading}>My Profile</Text>

      <Text style={themeStyles.label}>Email</Text>
      <Text style={themeStyles.text}>{profile?.email}</Text>

      <Text style={themeStyles.label}>First Name</Text>
      <TextInput
        style={themeStyles.input}
        editable={editing}
        value={editing ? updatedFields.firstName ?? profile.firstName : profile.firstName}
        onChangeText={(text) => handleChange('firstName', text)}
      />

      <Text style={themeStyles.label}>Last Name</Text>
      <TextInput
        style={themeStyles.input}
        editable={editing}
        value={editing ? updatedFields.lastName ?? profile.lastName : profile.lastName}
        onChangeText={(text) => handleChange('lastName', text)}
      />

      <Text style={themeStyles.label}>Faculty</Text>
      <Text style={themeStyles.text}>{profile?.faculty}</Text>

      <Text style={themeStyles.label}>User Type</Text>
      <Text style={themeStyles.text}>{profile?.userType}</Text>

      <Text style={themeStyles.label}>Role</Text>
      <Text style={themeStyles.text}>{profile?.role}</Text>

      <View style={themeStyles.buttonGroup}>
        {!editing ? (
          <Button title="Edit Profile" color={colors[theme].accent} onPress={() => setEditing(true)} />
        ) : (
          <>
            <Button title="Save Changes" color={colors[theme].success || 'green'} onPress={handleSave} />
            <View style={{ height: 10 }} />
            <Button title="Cancel" color={colors[theme].error || 'red'} onPress={() => setEditing(false)} />
          </>
        )}
      </View>

      <View style={themeStyles.divider} />

      <TouchableOpacity
        style={themeStyles.creatorButton}
        onPress={() => navigation.navigate('ApplicationScreen')}
      >
        <Text style={themeStyles.creatorButtonText}>🚀 Apply to Become a Notice Creator</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: theme.background,
      flexGrow: 1,
    },
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: theme.text,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      marginTop: 10,
      color: theme.text,
    },
    text: {
      fontSize: 16,
      marginBottom: 10,
      color: theme.textSecondary || theme.text,
    },
    input: {
      height: 40,
      borderColor: theme.border || '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 10,
      color: theme.text,
      backgroundColor: theme.inputBackground || theme.card,
    },
    buttonGroup: {
      marginTop: 20,
      marginBottom: 10,
    },
    creatorButton: {
      backgroundColor: theme.primary,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 20,
    },
    creatorButtonText: {
      color: theme.buttonText || '#fff',
      fontWeight: '600',
      fontSize: 16,
    },
    divider: {
      height: 1,
      backgroundColor: theme.border || '#ccc',
      marginVertical: 30,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
    },
  });

export default ProfileScreen;
