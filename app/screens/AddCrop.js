import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { ApiContext } from '../../Provider';
import { CheckBox } from 'react-native-elements'; // Make sure to install this package

export default function AddCrop({ initialPlantName = '', initialSoilTypes = [], initialMoistureLevel = '', initialTemperature = '' }) {
  // const [image, setImage] = useState(null);
  const [plantName, setPlantName] = useState(initialPlantName);
  const [selectedSoilTypes, setSelectedSoilTypes] = useState(initialSoilTypes); // Array for selected soil types
  const [moistureLevel, setMoistureLevel] = useState(initialMoistureLevel);
  const [temperature, setTemperature] = useState(initialTemperature);
  const { postCropData } = useContext(ApiContext);

  const handleSoilTypeToggle = (soilType) => {
    setSelectedSoilTypes((prevSelected) =>
      prevSelected.includes(soilType)
        ? prevSelected.filter((item) => item !== soilType) // Remove from selection
        : [...prevSelected, soilType] // Add to selection
    );
  };

  const handleAddCrop = async () => {
    const cropData = {
      crop_name: plantName,
      // crop_image: crimg,
      crop_soil: selectedSoilTypes.join(', '), // Join array into a string
      // crop_soil_desc: soilDescription,
      crop_moisture: moistureLevel,
      crop_temp: temperature.toString(),
      crop_status: 'harvested', //default
      // crop_water_duration:,
      // crop_created_at: 
      // crop_updated_at:
    };
    try {
      const response = await postCropData(cropData);
      alert('Crop added successfully!');
    } catch (error) {
      alert('Crop not added');
    }
  };

  return (
    <LinearGradient colors={['#a8e6cf', '#f5f5f5']} style={styles.container}>
      <Text style={styles.textColor}>Add Crop</Text>
      {/* <TouchableOpacity onPress={chooseImage} style={styles.imagePicker}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.imagePlaceholder}>Add Crop Photo</Text>
        )}
      </TouchableOpacity> */}

      <TextInput
        placeholder="Plant Name"
        style={styles.input}
        value={plantName}
        onChangeText={setPlantName}
      />

      <Text style={styles.label}>Select Soil Type:</Text>
      <ScrollView style={styles.checkboxContainer}>
        {['Silt Soil', 'Loamy Soil', 'Clay Soil', 'Sandy Soil'].map((soilType) => (
          <CheckBox
            key={soilType}
            title={soilType}
            checked={selectedSoilTypes.includes(soilType)}
            onPress={() => handleSoilTypeToggle(soilType)}
          />
        ))}
      </ScrollView>

      {/* Moisture Level Picker */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={moistureLevel}
          style={styles.picker}
          onValueChange={(itemValue) => setMoistureLevel(itemValue)}
        >
          <Picker.Item label="Select Moisture Level:" value="" enabled={false} />
          <Picker.Item label="Low" value="Low" />
          <Picker.Item label="Mid" value="Mid" />
          <Picker.Item label="High" value="High" />
        </Picker>
      </View>

      <TextInput
        placeholder="Temperature (°C)"
        style={styles.input}
        value={temperature}
        onChangeText={setTemperature}
        keyboardType="numeric"
      />

      <Button title="Add Crop" onPress={handleAddCrop} color="green" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  textColor: {
    color: '#2c3e50',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '100%',
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  checkboxContainer: {
    maxHeight: 120,
    marginBottom: 20,
    width: '100%',
  },
  pickerContainer: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    width: '100%',
    borderRadius: 5,
    justifyContent: 'center',
  },
  picker: {
    color: 'gray',
    height: 40,
    width: '100%',
  },
});
