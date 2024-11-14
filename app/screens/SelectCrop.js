import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, Modal, Button, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ApiContext } from '../../Provider';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';

const SearchCropBySoil = () => {
  const [selectedSoil, setSelectedSoil] = useState('');
  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { fetchCropsHarvested, handleSelectCrop } = useContext(ApiContext);

  // Use effect to fetch crops when the selected soil type changes
  useEffect(() => {
    if (selectedSoil) {
      fetchCropsBySoil(selectedSoil);
    } else {
      setCrops([]); // Clear crops if no soil type is selected
    }
  }, [selectedSoil]);

  const fetchCropsBySoil = async (soilType) => {
    try {
      const fetchedCrops = await fetchCropsHarvested();
      if (fetchedCrops) {
        // Filter crops by checking if selected soil type is included in crop_soil
        const filteredCrops = fetchedCrops.filter(crop =>
          crop.crop_soil?.toLowerCase().split(',').map(type => type.trim()).includes(soilType.toLowerCase())
        );
        setCrops(filteredCrops);
      }
    } catch (error) {
      console.error('Error fetching crops:', error.message);
    }
  };

  const handleView = (crop) => {
    setSelectedCrop(crop);
    setModalVisible(true);
  };

  const handleSelect = async (cropName) => {
    try {
      await handleSelectCrop(cropName); // Assuming this function handles the selection of the crop
      Alert.alert('Success', `${cropName} has been selected.`);
      await fetchCropsBySoil(selectedSoil); // Re-fetch crops to reflect any changes
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const renderCrop = ({ item }) => (
    <View style={styles.row}>
      <Icon name="sprout" size={30} color="#4CAF50" style={styles.icon} />
      <View style={styles.cell}>
        <Text style={styles.cropName}>{item.crop_name || 'Unnamed Crop'}</Text>
      </View>
      <View style={styles.cell}>
        <TouchableOpacity style={styles.selectButton} onPress={() => handleSelect(item.crop_name)}>
          <Text style={styles.buttonText}>Select</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cell}>
        <TouchableOpacity style={styles.viewButton} onPress={() => handleView(item)}>
          <Text style={styles.buttonText}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={['#a8e6cf', '#f5f5f5']} style={styles.container}>
      <View style={styles.searchContainer}>
        <Picker
          selectedValue={selectedSoil}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedSoil(itemValue)}
        >
          <Picker.Item label="Select soil type" value="" />
          <Picker.Item label="Sandy soil" value="Sandy soil" />
          <Picker.Item label="Silt soil" value="Silt soil" />
          <Picker.Item label="Loamy soil" value="Loamy soil" />
          <Picker.Item label="Clay soil" value="Clay soil" />
        </Picker>
      </View>

      <FlatList
        data={crops}
        keyExtractor={(item) => item._id?.toString() || Math.random().toString()}
        renderItem={renderCrop}
        ListEmptyComponent={<Text>No crops found</Text>}
      />

      {selectedCrop && (
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedCrop.crop_name}</Text>
              <Text style={styles.modalText}>Soil Type: {selectedCrop.crop_soil}</Text>
              <Text style={styles.modalText}>Moisture: {selectedCrop.crop_moisture}</Text>
              <Text style={styles.modalText}>Temperature: {selectedCrop.crop_temp + '°C'}</Text>
              <Button title="Close" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      )}
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
    marginBottom: 20,
  },
  picker: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cropName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    flexShrink: 1,
    marginRight: 10, // Space between Select and View buttons
  },
  viewButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    flexShrink: 1,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
});

export default SearchCropBySoil;
