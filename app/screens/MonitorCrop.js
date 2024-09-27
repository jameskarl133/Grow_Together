import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, Button, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ApiContext } from '../../Provider';
import { useFocusEffect } from '@react-navigation/native';

const PlantedCrops = () => {
  const [crops, setCrops] = useState([]);
  const { fetchCropsPlanted, updateCropToHarvest } = useContext(ApiContext);
  const [selectedCrop, setSelectedCrop] = useState(null);

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
        
        // Show success alert
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

  return (
    <LinearGradient colors={['#a8e6cf', '#f5f5f5']} style={styles.container}>
      <Text style={styles.header}>Monitor Crop</Text>

      {crops.length === 0 ? (
        <Text style={styles.noCropText}>There's no crop planted on this particular device</Text>
      ) : (
        <>
          {selectedCrop && (
            <View style={styles.cropContainer}>
              {/* Example Image */}
              <Image
                source={{ uri: 'https://via.placeholder.com/50' }}
                style={styles.image}
              />
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
  image: {
    width: 50,
    height: 50,
    marginRight: 16,
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
});

export default PlantedCrops;
