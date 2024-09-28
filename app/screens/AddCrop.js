import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { ApiContext } from '../../Provider';

export default function AddCrop() {
  // const [image, setImage] = useState(null);
  const [plantName, setPlantName] = useState('');
  const [soilType, setSoilType] = useState('');
  // const [soilDescription, setSoilDescription] = useState('');
  const [moistureLevel, setMoistureLevel] = useState('');
  const [temperature, setTemperature] = useState('');
  const { postCropData } = useContext(ApiContext);

  // const chooseImage = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     aspect: [2, 2],
  //     quality: 1,
  //   });

  //   if (!result.canceled) {
  //     setImage(result.assets[0].uri);
  //   }
  // };



  const handleAddCrop = async () => {
    const cropData ={
      crop_name: plantName,
      // crop_image: crimg,
      crop_soil: soilType,
      // crop_soil_desc: soilDescription,
      crop_moisture: moistureLevel,
      crop_temp: temperature.toString(),
      crop_status: 'harvested', //default
      // crop_water_duration:,
      // crop_created_at: 
      // crop_updated_at:
    };
    try{
      const response = await postCropData(cropData);
      alert('Crop added successfully!');
    }catch (error) {
      alert('Crop not added');
    }
  };

  return (
    <LinearGradient
      colors={['#a8e6cf', '#f5f5f5']}
      style={styles.container}
    >
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

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={soilType}
          style={styles.picker}
          onValueChange={(itemValue) => setSoilType(itemValue)}
        >
          <Picker.Item label="Select Soil Type:" value="" enabled={false}/>
          <Picker.Item label="Silt Soil" value="Silt Soil" />
          <Picker.Item label="Loamy Soil" value="Loamy Soil" />
          <Picker.Item label="Clay Soil" value="Clay Soil" />
          <Picker.Item label="Sandy Soil" value="Sandy Soil" />
        </Picker>
      </View>

      {/* <TextInput
        placeholder="Soil Description"
        style={[styles.input, styles.textArea]}
        value={soilDescription}
        onChangeText={setSoilDescription}
        multiline={true}
        numberOfLines={4}
      /> */}

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
    color: 'gray',
    height: 40,
    width: '100%',
  },
});
