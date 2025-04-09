import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, TextInput, Button, FlatList, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { GoogleGenerativeAI } from "@google/generative-ai"; // Import the AI API
import { database, ref, onValue } from '../Firebase/firebase'; // Import Firebase functions

const genAI = new GoogleGenerativeAI("AIzaSyAd5oMMQ0Wc08u3SOB_3OR4jLjyuO47TTQ"); // Replace with your API key

// Each chat bubble will either be a user message or a bot reply
const ChatScreen = () => {
  const [messages, setMessages] = useState([]); // Store messages
  const [inputText, setInputText] = useState(''); // Store current input
  const [loading, setLoading] = useState(false); // Loading state for API calls
  const [firebaseData, setFirebaseData] = useState(null); // Store data from Firebase

  // Reference to the Firebase Realtime Database node you want to query
  const dataRef = ref(database, 'notices'); // Replace 'your-data-node' with the actual path

  // Load data from Firebase when the component mounts
  useEffect(() => {
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setFirebaseData(data); // Store the fetched data in state
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // Handle sending the user message and adding the AI-generated bot reply
  const handleSendMessage = async () => {
    if (inputText.trim() === '') return; // Don't send empty messages

    // Add the user's message to the chat
    const userMessage = { id: messages.length, text: inputText, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Call the AI API to get the bot's response
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Include Firebase data in the prompt
      const prompt = `
        System: You are a helpful assistant for a Geofence E-Notice system called Campus Guide, that answers user questions based on the provided Firebase data (about notices). This here is the system prompt to guide you so your response should be towards the User Question, not this. If the question isn't connected to the notices, then it must be related to locating places around Mbarara University of Science and Technology, Uganda or something about the university. Do not talk about or answer questions regarding anything else.
        Firebase Data: ${JSON.stringify(firebaseData, null, 2)}
        User Question: ${inputText}
      `;

      const result = await model.generateContent(prompt); // Use the combined prompt

      // Extract the bot's response from the API result
      const botMessageText = String(result.response.text().trim() || "Default response");

      // Add the bot's response to the chat
      const botMessage = { id: messages.length + 1, text: botMessageText, sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage = { id: messages.length + 1, text: "Failed to get response, please check your internet connection and try again", sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }

    // Clear the input field
    setInputText('');
  };

  // Function to render each message as a chat bubble
  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.botBubble]}>
        <Text style={[styles.messageText, isUser ? styles.userText : styles.botText]}>{item.text}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.chatContainer}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
        />
        <Button title={loading ? "Loading..." : "Send"} onPress={handleSendMessage} disabled={loading} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Styles for chat bubbles and layout
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  chatContainer: {
    padding: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 20,
    marginVertical: 5,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0',
  },
  messageText: {
    fontSize: 16,
  },
  userText: {
    color: 'white',
  },
  botText: {
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  textInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    marginRight: 10,
  },
});

export default ChatScreen;