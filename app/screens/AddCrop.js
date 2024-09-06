import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

export default function AddCrop() {
  const [image, setImage] = useState(null);
  const [plantName, setPlantName] = useState('');
  const [soilType, setSoilType] = useState('');
  const [soilDescription, setSoilDescription] = useState('');
  const [moistureLevel, setMoistureLevel] = useState('');
  const [temperature, setTemperature] = useState('');

  const chooseImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [2, 2],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAddCrop = () => {
    // Add logic to handle adding the crop
    alert('Crop added successfully!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textColor}>Add Crop</Text>
      
      <TouchableOpacity onPress={chooseImage} style={styles.imagePicker}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.imagePlaceholder}>Add Crop Photo</Text>
        )}
      </TouchableOpacity>
      
      <TextInput
        placeholder="Plant Name"
        style={styles.input}
        value={plantName}
        onChangeText={setPlantName}
      />

      {/* Soil Type Picker */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={soilType}
          style={styles.picker}
          onValueChange={(itemValue) => setSoilType(itemValue)}
        >
          <Picker.Item label="Select Soil Type:" value="" enabled={false}/>
          <Picker.Item label="Silt Soil" value="silt_soil" />
          <Picker.Item label="Loamy Soil" value="loamy_soil" />
          <Picker.Item label="Clay Soil" value="clay_soil" />
          <Picker.Item label="Sandy Soil" value="sandy_soil" />
        </Picker>
      </View>

      <TextInput
        placeholder="Soil Description"
        style={[styles.input, styles.textArea]}
        value={soilDescription}
        onChangeText={setSoilDescription}
        multiline={true}
        numberOfLines={4}
      />

      {/* Moisture Level Picker */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={moistureLevel}
          style={styles.picker}
          onValueChange={(itemValue) => setMoistureLevel(itemValue)}
        >
          <Picker.Item label="Select Moisture Level:" value="" enabled={false}/>
          <Picker.Item label="Low" value="Low" />
          <Picker.Item label="Mid" value="Mid" />
          <Picker.Item label="High" value="High" />
        </Picker>
      </View>

      <TextInput
        placeholder="Temperature (Â°C)"
        style={styles.input}
        value={temperature}
        onChangeText={setTemperature}
        keyboardType="numeric"
      />

      <Button title="Add Crop" onPress={handleAddCrop} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f7e9',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  textColor: {
    color: 'black',
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imagePicker: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  imagePlaceholder: {
    color: 'gray',
    textAlign: 'center',
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
    height: 40,
    width: '100%',
  },
});