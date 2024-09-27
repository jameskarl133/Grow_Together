import React, { useContext, useState } from 'react';
import { View, TextInput, StyleSheet, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ApiContext } from '../../Provider';
import { useFocusEffect } from '@react-navigation/native';

const SearchCrop = () => {
  const [cropName, setCropName] = useState('');
  const [crops, setCrops] = useState([]);
  const { fetchCropsHarvested, handleSelectCrop } = useContext(ApiContext);

  useFocusEffect(
    React.useCallback(() => {
      fetchCrops();
    }, [])
  );

  const fetchCrops = async () => {
    try {
      const fetchedCrops = await fetchCropsHarvested();
      setCrops(fetchedCrops);
    } catch (error) {
      console.error('Error fetching crops:', error.message);
    }
  };

  const filteredCrops = crops.filter(crop =>
    crop.crop_name.toLowerCase().includes(cropName.toLowerCase())
  );

  const handleSelect = async (cropName) => {
    try {
      await handleSelectCrop(cropName);
      await fetchCrops();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const renderCrop = ({ item }) => (
    <View style={styles.row}>
      <View style={styles.cell}>
        <Text style={styles.cropName}>{item.crop_name}</Text>
      </View>
      <View style={styles.cell}>
        <TouchableOpacity style={styles.button} onPress={() => handleSelect(item.crop_name)}>
          <Text style={styles.buttonText}>Select</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cell}>
        <TouchableOpacity style={styles.button}>
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
      </View>

      {/* Header Row
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Crop Name</Text>
        <Text style={styles.headerText}>Select</Text>
        <Text style={styles.headerText}>View</Text>
      </View> */}

      <FlatList
        data={filteredCrops}
        key={(item) => item._id}  // Unique key
        renderItem={renderCrop}
        ListEmptyComponent={<Text>No crops found</Text>}
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
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 8,
    backgroundColor: '#e0f7fa',
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    width: '33%',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
  },
  cell: {
    width: '33%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cropName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SearchCrop;
