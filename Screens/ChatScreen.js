import React, { useState, useEffect } from 'react';
import {
  SafeAreaView, StyleSheet, View, TextInput, FlatList,
  Text, KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator, Image
} from 'react-native';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { database, ref, onValue } from '../Firebase/firebase';
import { useNavigation } from '@react-navigation/native';
import new_coordinates from "../MapAssets/new_coordinates.json";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../Tools/ThemeContext';
import themeColors from '../Tools/theme';

const genAI = new GoogleGenerativeAI("AIzaSyAd5oMMQ0Wc08u3SOB_3OR4jLjyuO47TTQ");

const ChatScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [firebaseData, setFirebaseData] = useState(null);

  const dataRef = ref(database, 'notices');

  useEffect(() => {
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setFirebaseData(data);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    saveChatHistory();
  }, [messages]);

  const loadChatHistory = async () => {
    const saved = await AsyncStorage.getItem('chatHistory');
    if (saved) setMessages(JSON.parse(saved));
  };

  const saveChatHistory = async () => {
    await AsyncStorage.setItem('chatHistory', JSON.stringify(messages));
  };

  const findLocation = (query) => {
    const lowercaseQuery = query.toLowerCase();
    const foundLocation = new_coordinates.find(item =>
      lowercaseQuery.includes(item.name.toLowerCase())
    );
    return foundLocation ? foundLocation.name : null;
  };

  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;

    const timestamp = new Date().toISOString();
    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp,
    };
    setMessages(prev => [...prev, userMessage]);

    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const foundLocation = findLocation(inputText);

      const prompt = `
        System: You are a friendly helpful assistant for a Geofence E-Notice system called Campus Guide, that answers user questions based on the provided Firebase data (about notices). This here is the system prompt to guide you so your response should be towards the User Question, not this. If the user question isn't connected to the notices, then it must be related to locating places around Mbarara University of Science and Technology, Uganda or something about the university. If the Location field does not say null, and the context of the User Question is about finding a place, then simply tell the user to 'click the link provided below to view the location on the map'. Do not talk about or answer questions regarding anything else.
        Firebase Data: ${JSON.stringify(firebaseData, null, 2)}
        Location: ${foundLocation}
        User Question: ${inputText}
      `;

      const result = await model.generateContent(prompt);
      const botText = String(result.response.text().trim() || "Default response");

      const botMessage = {
        id: Date.now() + 1,
        text: botText,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        location: foundLocation,
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: "Failed to get response, please check your internet connection and try again",
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setInputText('');
    }
  };

  const formatTime = (iso) => {
    const date = new Date(iso);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.messageRow, isUser ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }]}>
        {!isUser && <Image source={require('../assets/bot.png')} style={styles.avatar} />}
        <View style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.botBubble,
          { backgroundColor: isUser ? colors.primary : colors.chat }
        ]}>
          <Text style={[styles.messageText, { color: isUser ? '#fff' : colors.text }]}>
            {item.text}
          </Text>
          <Text style={[styles.timestamp, { color: colors.timestamp }]}>{formatTime(item.timestamp)}</Text>

          {item.location && (
            <TouchableOpacity
              onPress={() => {
                AsyncStorage.setItem("locationName", item.location);
                navigation.navigate('Map');
              }}>
              <Text style={[styles.linkText, { color: colors.linkColor }]}>
                View {item.location}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.chatContainer}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.inputContainer, { backgroundColor: colors.card, borderTopColor: colors.border }]}
      >
        <TextInput
          style={[styles.textInput, {
            backgroundColor: colors.inputBackground,
            color: colors.text,
            borderColor: colors.border,
          }]}
          placeholder="Type your message..."
          placeholderTextColor={colors.placeholder}
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: loading ? colors.border : colors.accent }]}
          onPress={handleSendMessage}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.sendButtonText}>Send</Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatContainer: {
    padding: 10,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 20,
  },
  userBubble: {
    marginLeft: 50,
  },
  botBubble: {
    marginRight: 50,
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 5,
  },
  linkText: {
    marginTop: 5,
    textDecorationLine: 'underline',
  },
});

export default ChatScreen;
