import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, TextInput, Button, FlatList, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { GoogleGenerativeAI } from "@google/generative-ai"; // Import the AI API

const genAI = new GoogleGenerativeAI("AIzaSyAd5oMMQ0Wc08u3SOB_3OR4jLjyuO47TTQ"); // Replace with your API key

// Each chat bubble will either be a user message or a bot reply
const ChatScreen = () => {
  const [messages, setMessages] = useState([]); // Store messages
  const [inputText, setInputText] = useState(''); // Store current input
  const [loading, setLoading] = useState(false); // Loading state for API calls

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
      const result = await model.generateContent(inputText); // Use the user's input as the prompt

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
