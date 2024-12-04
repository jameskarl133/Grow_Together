import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button, Alert, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ApiContext } from '../../Provider';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const PlantedCrops = () => {
  const [crops, setCrops] = useState([]);
  const [soilMoisture, setSoilMoisture] = useState(null);
  const [waterLevel, setWaterLevel] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const { fetchCropsPlanted, updateCropToHarvest, updateCropLog, websocket, fetchCropLogs, wsmessage } = useContext(ApiContext);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [moistureLevel, setMoistureLevel] = useState('Loading...');
  const [isWatering, setIsWatering] = useState(false);
  const [plantedDays, setPlantedDays] = useState(0);
  const [canHarvest, setCanHarvest] = useState(false);

  // Listen for WebSocket messages and update the state
  const categorizeLevel = (value) => {
    if (value >= 3000) return 'Low';
    if (value >= 2000) return 'Mid';
    return 'High';
  };
  useEffect(() => {
    if (wsmessage && wsmessage.soil_moisture !== null) {
      const level = categorizeLevel(wsmessage.soil_moisture);
      setMoistureLevel(level);
    }


  //   return () => {
  //     // if (websocket) {
  //     //   websocket.onmessage = null; // Clean up the WebSocket listener
  //     // }
  //   };
  }, [wsmessage]);

  // const setupWebSocket = () => {
  //   const ws = new WebSocket(websocket_control);

  //   ws.onopen = () => {
  //     console.log('Connected to WebSocket');
  //     // setWebSocket(ws);  // Store WebSocket connection
  //   };
  
  //   ws.onmessage = (event) => {
  //     console.log(JSON.parse(event.data));
  //   };
  
  //   ws.onclose = (event) => {
  //     console.log('WebSocket disconnected', event.reason);
  //   };
  
  //   ws.onerror = (error) => {
  //     console.error('WebSocket Error:', error.message);
  //   };
  // };

  // const handleFetchData = () => {
  //   if (websocket && websocket.readyState === WebSocket.OPEN) {
  //     const message = JSON.stringify({
  //       command: 'FETCH_DATA',
  //     });

  //     websocket.send(message); // Request the data from ESP32
  //   } else {
  //     Alert.alert('Connection Error', 'WebSocket is not connected.');
  //   }
  // };

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
        const logs = await fetchCropLogs();
        const cropLog = logs.find(log => log.crop_name === selectedCrop.crop_name);
        
        // Get today's date
        const today = new Date().toISOString().split('T')[0];
        const estimatedDays = parseInt(selectedCrop.crop_estdate);
  
        // Use Calendar's selected date to track days
        const markedDates = {
          [today]: {
            selected: true,
            selectedColor: 'green',
          }
        };
        const daysGrown = Object.keys(markedDates).length;
  
        if (daysGrown < estimatedDays) {
          Alert.alert(
            "Cannot Harvest Yet", 
            `Current day: ${daysGrown}\nNeeds ${estimatedDays} days before harvesting.\nWait ${estimatedDays - daysGrown} more days.`
          );
          return;
        }
  
        await updateCropToHarvest(selectedCrop.crop_name);
        await updateCropLog(selectedCrop.crop_name);
  
        Alert.alert("Success", `Crop ${selectedCrop.crop_name} has been harvested.`);
        fetchCrops();
      } catch (error) {
        console.error('Error updating crop status:', error.message);
        Alert.alert("Error", `Failed to update crop status: ${error.message}`);
      }
    }
  };

  const loadLogs = async () => {
    try {
      const fetchedLogs = await fetchCropLogs();
      setLogs(fetchedLogs);
    } catch (error) {
      console.error('Error fetching crop logs:', error.message);
    } finally {
      setLoading(false);
    }
  };
  

const handleWateringToggle = () => {
  if (websocket && websocket.readyState === WebSocket.OPEN) {
    // Determine the message to send
    const command = isWatering ? 'WATER_OFF' : 'WATER_ON';
    
    const message = {
      message: command // This will be either 'WATER_ON' or 'WATER_OFF'
    };
    websocket.send(isWatering ? 'WATER_OFF' : 'WATER_ON');

    
    // Toggle the watering state
    setIsWatering(!isWatering);
    Alert.alert('Water Pump', `Water pump turned ${isWatering ? 'off' : 'on'}`);
  } else {
    Alert.alert('Connection Error', 'WebSocket is not connected.');
  }
};

  // value = wsmessage.soil_moisture
  // const categorizeLevel = (value) => {
  //   moisture_level = ''
  //   if (value <= 4095 || value >= 3000) 
  //     moisture_level ='Low';
  //   if (value <= 2999 || value >= 2000)
  //     moisture_level = 'Mid';
  //   else
  //     moisture_level = 'High'
  // };

  return (
    <LinearGradient colors={['#a8e6cf', '#f5f5f5']} style={styles.container}>
      <Text style={styles.header}>Monitor Crop</Text>

      {crops.length === 0 ? (
        <Text style={styles.noCropText}>There's no crop planted on this particular device</Text>
      ) : (
        <>
          {selectedCrop && (
            <View style={styles.cropContainer}>
              <View style={styles.headerRow}>
                <Icon name="sprout" size={50} color="#4CAF50" style={styles.icon} />
                <Text style={styles.crops}>{selectedCrop.crop_name}</Text>
              </View>
              <View style={styles.detailsColumn}>
                <Text style={styles.crops_input}>{selectedCrop.crop_soil}</Text>
                <Text style={styles.crops_input}>{selectedCrop.crop_moisture}</Text>
                <Text style={styles.crops_input}>{selectedCrop.crop_temp + "°C"}</Text>
                <Text style={styles.crops_input}>Date to harvest: {selectedCrop.crop_estdate}</Text>
              </View>
            </View>
          )}

          <Text style={styles.infoText}>Current Crop Status</Text>

          <View style={styles.statCard}>
            <Ionicons name="speedometer-outline" size={40} color="#3498db" />
            <View style={styles.statTextContainer}>
              <Text style={styles.statLabel}>Moisture Level</Text>
              <Text style={styles.statValue}>{moistureLevel}</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="water-outline" size={40} color="#1abc9c" />
            <View style={styles.statTextContainer}>
              <Text style={styles.statLabel}>Water Level</Text>
              <Text style={styles.statValue}>{wsmessage.water_level !== null ? wsmessage.water_level : 'Loading...'}</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="thermometer-outline" size={40} color="#e74c3c" />
            <View style={styles.statTextContainer}>
              <Text style={styles.statLabel}>Temperature</Text>
               <Text style={styles.statValue}>{wsmessage.temperature !== null ? wsmessage.temperature + '°C' : 'Loading...'}</Text>
            </View>
          </View>

          <Button title="Harvest" onPress={handleUpdateStatus} color="#FF7F50" />
        </>
      )}

      {/* Watering Can Icon Toggle, only show if crops are present */}
      {crops.length > 0 && (
        <Pressable
          style={[
            styles.wateringIconContainer,
            isWatering && styles.wateringIconActive
          ]}
          onLongPress={
            ()=>{
            console.log('Websocket state:', websocket?.readyState)
            websocket.send("WATER_ON")
            console.log('pressed')
            }
            }
          onPressOut={
            ()=>{
            websocket.send("WATER_OFF")
            console.log('unpressed')
            }
            }
        >
          <Ionicons name="water" size={24} color="#fff" />
        </Pressable>
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
  detailsColumn: {
    marginLeft: 66, // This aligns with the icon + its margin
  },
  icon: {
    marginRight: 16,
  },
  crops: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  crops_input: {
    fontSize: 16,
    color: '#666',
  },
  infoText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
    color: '#666',
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  statTextContainer: {
    marginLeft: 16,
  },
  statLabel: {
    fontSize: 16,
    color: '#333',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  wateringIconContainer: {
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
  wateringIconActive: {
    backgroundColor: '#388E3C',
  },
});

export default PlantedCrops;
