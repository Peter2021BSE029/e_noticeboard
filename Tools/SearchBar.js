import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Alert, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import new_coordinates from "../MapAssets/new_coordinates.json";
import { useTheme } from '../Tools/ThemeContext';
import colors from '../Tools/theme';

const SearchBarWithDropdown = ({ onSearch }) => {
  const { theme } = useTheme();
  const themeColors = colors[theme];

  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const onChangeSearchText = (text) => {
    setSearchText(text);
    const filteredSuggestions = new_coordinates
      .filter(item => item.name.toLowerCase().startsWith(text.toLowerCase()))
      .map(item => item.name);

    setSuggestions(filteredSuggestions.sort());
  };

  const handleSearchChange = (text) => {
    if (!text) {
      Alert.alert('Error', 'Please enter a location search');
      return;
    }
    Keyboard.dismiss();
    onSearch(text);
  };

  const handleSuggestionPress = (suggestion) => {
    setSearchText(suggestion);
    setSuggestions([]);
  };

  return (
    <View style={[styles.container]}>
      <View style={[styles.searchBarContainer]}>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: themeColors.card,
              color: themeColors.text,
              borderColor: themeColors.border
            },
          ]}
          value={searchText}
          onChangeText={onChangeSearchText}
          placeholder="Search Location"
          placeholderTextColor={themeColors.placeholder}
        />
        <TouchableOpacity onPress={() => handleSearchChange(searchText)} style={{ padding: 5 }}>
          <Ionicons name="search" size={24} color={themeColors.text} />
        </TouchableOpacity>
      </View>

      {searchText !== '' && suggestions.length !== 0 && (
        <TouchableOpacity onPress={() => handleSuggestionPress(suggestions[0])} style={{ padding: 5 }}>
          <Text style={{ color: themeColors.accent }}>{suggestions[0]}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  searchBarContainer: {
    width: '70%',
    flexDirection: 'row',
    padding: 5,
  },
  searchInput: {
    height: 40,
    width: "110%",
    marginLeft: 25,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
});

export default SearchBarWithDropdown;
