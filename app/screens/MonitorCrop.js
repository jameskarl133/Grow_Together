import React, { useContext, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { ApiContext } from '../../Provider';
import { useFocusEffect } from '@react-navigation/native';

const PlantedCrops = () => {
  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState('');
  const { fetchCropsPlanted } = useContext(ApiContext);

  useFocusEffect(
    React.useCallback(() => {
      fetchCrops();
    }, [])
  );

  const fetchCrops = async () => {
    try {
      const fetchedCrops = await fetchCropsPlanted();
      setCrops(fetchedCrops);
    } catch (error) {
      console.error('Error fetching planted crops:', error.message);
    }
  };

  return (
    <LinearGradient colors={['#a8e6cf', '#f5f5f5']} style={styles.container}>
      {/* Header Text */}
      <Text style={styles.header}>Monitor Crop</Text>
      
      <Text style={styles.label}>Select a Crop:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedCrop}
          onValueChange={(itemValue) => setSelectedCrop(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select a crop..." value="" />
          {crops.map((crop) => (
            <Picker.Item key={crop._id} label={crop.crop_name} value={crop.crop_name} />
          ))}
        </Picker>
      </View>
      <View><Text>ang mga imonitor na diri kay gikan na sa hardware soooo ill leave it blank nalng sa for now guys</Text></View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-start',
  },
  // Styling for header (Monitor Crop)
  header: {
    fontSize: 30,  // Make text large
    fontWeight: 'bold',  // Bold font for emphasis
    textAlign: 'center',  // Center align
    marginBottom: 20,  // Add spacing below
    color: '#333',  // Optionally, change the color
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pickerContainer: {
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
  picker: {
    height: 50,
    width: '100%',
  },
  selectedText: {
    fontSize: 16,
    marginTop: 20,
    fontWeight: 'bold',
  },
});

export default PlantedCrops;
