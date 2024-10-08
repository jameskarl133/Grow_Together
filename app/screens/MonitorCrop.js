import React, { useContext, useState } from 'react';
import { View, StyleSheet, Text, Button, Alert, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ApiContext } from '../../Provider';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';  // Importing the icon library

const PlantedCrops = () => {
  const [crops, setCrops] = useState([]);
  const { fetchCropsPlanted, updateCropToHarvest, updateCropLog } = useContext(ApiContext);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [buttonPressed, setButtonPressed] = useState(false); // To track button press state

  useFocusEffect(
    React.useCallback(() => {
      fetchCrops();
    }, [])
  );

  const fetchCrops = async () => {
    try {
      const fetchedCrops = await fetchCropsPlanted();
      setCrops(fetchedCrops);

      if (fetchedCrops.length > 0) {
        setSelectedCrop(fetchedCrops[0]);
      } else {
        setSelectedCrop(null);
      }
    } catch (error) {
      console.error('Error fetching planted crops:', error.message);
    }
  };

  const handleUpdateStatus = async () => {
    if (selectedCrop) {
      try {
        await updateCropToHarvest(selectedCrop.crop_name);
        console.log(`Crop ${selectedCrop.crop_name} status updated to harvested`);

        await updateCropLog(selectedCrop.crop_name);
        console.log(`Crop log for ${selectedCrop.crop_name} updated with harvest date`);

        Alert.alert(
          "Success",
          `Crop ${selectedCrop.crop_name} has been harvested.`
        );

        fetchCrops();

      } catch (error) {
        console.error('Error updating crop status:', error.message);
        Alert.alert(
          "Error",
          `Failed to update crop status: ${error.message}`
        );
      }
    }
  };

  const handleWatering = () => {
    Alert.alert("Watering", "You watered the crops!");
  };

  return (
    <LinearGradient colors={['#a8e6cf', '#f5f5f5']} style={styles.container}>
      <Text style={styles.header}>Monitor Crop</Text>

      {crops.length === 0 ? (
        <Text style={styles.noCropText}>There's no crop planted on this particular device</Text>
      ) : (
        <>
          {selectedCrop && (
            <View style={styles.cropContainer}>
              <Icon name="sprout" size={50} color="#4CAF50" style={styles.icon} />
              <Text style={styles.crops}>{selectedCrop.crop_name}</Text>
            </View>
          )}

          <Text style={styles.infoText}>standby</Text>
          <Button
            title="Harvest"
            onPress={handleUpdateStatus}
            color="#FF7F50"
          />
        </>
      )}

      {/* Floating Watering Can Button */}
      <Pressable
        style={[
          styles.floatingButton,
          buttonPressed && styles.floatingButtonPressed
        ]}
        onPressIn={() => setButtonPressed(true)} 
        onPressOut={() => setButtonPressed(false)}
        onPress={handleWatering} 
      >
        <Icon name="watering-can" size={24} color="#fff" />
      </Pressable>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-start',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  cropContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  icon: {
    marginRight: 16,  // Space between the icon and the crop name
  },
  crops: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  infoText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
    color: '#666',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#4CAF50',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  floatingButtonPressed: {
    backgroundColor: '#388E3C',
  },
});

export default PlantedCrops;
