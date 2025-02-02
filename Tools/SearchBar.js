import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Alert, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import new_coordinates from "../MapAssets/new_coordinates.json";

const SearchBarWithDropdown = ( { onSearch } ) => {
  const [searchText, setSearchText] = useState('');
   const [suggestions, setSuggestions] = useState([]);

  const onChangeSearchText = (text) => {
    setSearchText(text);

    // Filter suggestions based on input text
    const filteredSuggestions = new_coordinates
      .filter(item => item.name.toLowerCase().startsWith(text.toLowerCase()))
      .map(item => item.name);

    // Sort suggestions alphabetically
    setSuggestions(filteredSuggestions.sort());
  };

  const handleSearchChange = (text) => {
    if (!text) {
      Alert.alert('Error', 'Please enter a location search');
      return;
    }
    Keyboard.dismiss();

    onSearch(text);

    // // Search for the input text within the names in the JSON data
    // const foundItem = new_coordinates.find(item => item.name.toLowerCase() === text.toLowerCase());

    // // Display an alert based on whether the input text is found or not
    // if (foundItem) {
    //   Alert.alert('Found', `Item "${foundItem.name}" found`);
    // } else {
    //   Alert.alert('Not Found', `Item with name "${text}" not found`);
    // };
  };

     const handleSuggestionPress = (suggestion) => {
       setSearchText(suggestion);
       setSuggestions([]);
     };

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={onChangeSearchText}
          placeholder="Search Location"
        />
      <TouchableOpacity onPress={() => handleSearchChange(searchText)} style={{ padding: 5 }}>
        <Ionicons name="search" size={24} color="black" />
      </TouchableOpacity>
      </View>
        {/* {suggestions.map((suggestion, index) => (
          <TouchableOpacity key={index} onPress={() => handleSuggestionPress(suggestion)}>
            <View style={{ padding: 10 }}>
              <Text>{suggestion}</Text>
            </View>
          </TouchableOpacity>
        ))} */}
        {searchText !== '' && suggestions.length !== 0 && (
          <TouchableOpacity onPress={() => handleSuggestionPress(suggestions[0])} style={{padding: 1}}>
            <Text style={{color: "dodgerblue"}}>{suggestions[0]}</Text>
          </TouchableOpacity>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //marginTop: 50, // Adjust this value to position the search bar at the top
  },
  searchBarContainer: {
    width: '70%',
    flexDirection: 'row',
    position: 'relative',
    padding: 5,
    alignContent: "flex-start",
  },
  searchInput: {
    height: 40,
    width: "110%",
    marginLeft: 25,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  dropdown: {
    position: 'absolute',
    top: 40, // Adjust this value to position the dropdown below the search bar
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
    zIndex: 1, // Ensure the dropdown appears above other components
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
});

export default SearchBarWithDropdown;