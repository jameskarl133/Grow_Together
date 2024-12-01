import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ApiContext } from '../../Provider';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';

const SelectCrop = ({ navigation }) => {
  const { fetchCropsHarvested, handleSelectCrop } = useContext(ApiContext);
  const [selectedSoils, setSelectedSoils] = useState([]);
  const [allCrops, setAllCrops] = useState([]);
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const fetchedCrops = await fetchCropsHarvested();
          setAllCrops(fetchedCrops || []);
        } catch (error) {
          console.error('Error fetching crops:', error.message);
        }
      };
      fetchData();
    }, [])
  );

  useEffect(() => {
    if (selectedSoils.length > 0) {
      const cropsBySoil = allCrops.filter(crop => {
        const cropSoilTypes = crop.crop_soil?.toLowerCase().split(',').map(type => type.trim());
        return selectedSoils.every(soil => 
          cropSoilTypes.includes(soil.toLowerCase())
        );
      });
      setFilteredCrops(cropsBySoil);
    } else {
      setFilteredCrops(allCrops);
    }
  }, [selectedSoils, allCrops]);

  const handleSelect = (id, cropName) => {
    setSelectedCrop(cropName);
  };

  const handleConfirmCrop = async () => {
    if (!selectedCrop) {
      Alert.alert('Error', 'Please select a crop.');
      return;
    }
    try {
      await handleSelectCrop(selectedCrop);
      Alert.alert('Success', `${selectedCrop} has been selected.`);
      navigation.navigate('MonitorCrop');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const renderCrop = ({ item }) => (
    <View style={styles.row}>
      <Icon name="sprout" size={30} color="#4CAF50" style={styles.icon} />
      <Text style={styles.cropName}>{item.crop_name || 'Unnamed Crop'}</Text>
      <TouchableOpacity onPress={() => handleSelect(item.id, item.crop_name)} style={styles.radioButton}>
        <Icon name={selectedCrop === item.crop_name ? 'radiobox-marked' : 'radiobox-blank'} size={24} color="#4CAF50" />
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient colors={['#2c3e50', '#f5f5f5']} style={styles.container}>
      <Text style={styles.header}>Select Crop</Text>

      <View style={styles.filterContainer}>
        {['All', 'Sandy soil', 'Silt soil', 'Loamy soil', 'Clay soil'].map((soil) => (
          <TouchableOpacity
            key={soil}
            style={[
              styles.filterButton,
              selectedSoils.includes(soil) && styles.filterButtonActive
            ]}
            onPress={() => {
              if (soil === 'All') {
                setSelectedSoils([]);
              } else {
                setSelectedSoils(prev => 
                  prev.includes(soil) 
                    ? prev.filter(s => s !== soil)
                    : [...prev, soil]
                );
              }
            }}
          >
            <Text style={[
              styles.filterText,
              selectedSoils.includes(soil) && styles.filterTextActive
            ]}>
              {soil}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredCrops}
        keyExtractor={(item) => item._id?.toString() || Math.random().toString()}
        renderItem={renderCrop}
        ListEmptyComponent={<Text style={styles.noCropText}>No crops found for the selected soil type.</Text>}
      />

      <TouchableOpacity onPress={handleConfirmCrop} style={styles.confirmButton}>
        <Text style={styles.buttonText}>Confirm Selection</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  filterText: {
    color: '#2c3e50',
  },
  filterTextActive: {
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  cropName: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  radioButton: {
    padding: 5,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noCropText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 20,
  }
});


export default SelectCrop;
