import React, { useContext, useState } from 'react';
import { View, TextInput, StyleSheet, Text, FlatList, TouchableOpacity, Alert, Modal, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ApiContext } from '../../Provider';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SearchCrop = () => {
  const [cropName, setCropName] = useState('');
  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null); // State to hold the selected crop
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const { fetchCropsHarvested, handleSelectCrop } = useContext(ApiContext);

  useFocusEffect(
    React.useCallback(() => {
      fetchCrops();
    }, [])
  );

  const fetchCrops = async () => {
    try {
      const fetchedCrops = await fetchCropsHarvested();
      if (fetchedCrops) {
        setCrops(fetchedCrops);
      }
    } catch (error) {
      console.error('Error fetching crops:', error.message);
    }
  };

  const filteredCrops = crops.filter(crop =>
    crop.crop_name?.toLowerCase().includes(cropName.toLowerCase())
  );

  const handleSelect = async (cropName) => {
    try {
      await handleSelectCrop(cropName);
      await fetchCrops();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleView = (crop) => {
    setSelectedCrop(crop); // Set the selected crop
    setModalVisible(true); // Show the modal
  };

  const renderCrop = ({ item }) => (
    <View style={styles.row}>
      {/* Add the sprout icon on the left */}
      <Icon name="sprout" size={30} color="#4CAF50" style={styles.icon} />
      <View style={styles.cell}>
        <Text style={styles.cropName}>{item.crop_name || 'Unnamed Crop'}</Text>
      </View>
      <View style={styles.cell}>
        <TouchableOpacity style={styles.button} onPress={() => handleSelect(item.crop_name)}>
          <Text style={styles.buttonText}>Select</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cell}>
        <TouchableOpacity style={styles.button} onPress={() => handleView(item)}>
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

      <FlatList
        data={filteredCrops}
        keyExtractor={(item) => item._id?.toString() || Math.random().toString()}  // Unique key with fallback
        renderItem={renderCrop}
        ListEmptyComponent={<Text>No crops found</Text>}
      />

      {/* Modal for viewing crop details */}
      {selectedCrop && (
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)} // Close the modal when back button is pressed
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
  row: {
    flexDirection: 'row',
    alignItems: 'center', // Align items closer together
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
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    flexShrink: 1, // Allows the button to shrink if needed
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
    marginRight: 10,  // Space between the icon and the crop name
  },
});

export default SearchCrop;
