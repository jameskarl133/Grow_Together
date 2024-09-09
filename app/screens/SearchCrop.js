import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const SearchCrop = () => {
  const [cropName, setCropName] = useState('');

  const handleSearch = () => {
    if (cropName.trim()) {
      alert(`Searching for: ${cropName}`);
    } else {
      alert('Please enter a crop name to search');
    }
  };

  return (
    <LinearGradient
      // Add LinearGradient for background
      colors={['#a8e6cf', '#f5f5f5']} // Light green to light gray
      style={styles.container}
    >
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type crop name"
          value={cropName}
          onChangeText={setCropName}
        />
        <Button title="Search" onPress={handleSearch} />
      </View>
    </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-start',  
    marginTop: 0,  
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
});

export default SearchCrop;
