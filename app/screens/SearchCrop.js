import React, { useContext, useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ApiContext } from '../../Provider';
import { useFocusEffect } from '@react-navigation/native';

const SearchCrop = () => {
  const [cropName, setCropName] = useState('');
  const [crops, setCrops] = useState([]);
  const { fetchCropsOnDb } = useContext(ApiContext);

  // Fetch crops when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchCrops();
    }, [])
  );

  const fetchCrops = async () => {
    try {
      const fetchedCrops = await fetchCropsOnDb();
      setCrops(fetchedCrops);
    } catch (error) {
      console.error('Error fetching crops:', error.message);
    }
  };

  const handleSearch = () => {
    if (cropName.trim()) {
      alert(`Searching for: ${cropName}`);
    } else {
      alert('Please enter a crop name to search');
    }
  };

  const renderCrop = ({ item }) => (
    <View style={styles.cropContainer} key={item._id}>
      <Text style={styles.cropName}>{item.crop_name}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          {/* Wrap button text inside <Text> component */}
          <Text style={styles.buttonText}>Select</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          {/* Wrap button text inside <Text> component */}
          <Text style={styles.buttonText}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={['#a8e6cf', '#f5f5f5']} style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type crop name"
          value={cropName}
          onChangeText={setCropName}
        />
        <Button title="Search" onPress={handleSearch} color="green" />
      </View>
      <FlatList
        data={crops}
        keyExtractor={(item) => item._id}
        renderItem={renderCrop}
        ListEmptyComponent={
          // Empty list message wrapped inside <Text>
          <Text>No crops found</Text>
        }
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-start',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
  cropContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  cropName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: 'green',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SearchCrop;