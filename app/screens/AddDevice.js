import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, FlatList, NativeModules, NativeEventEmitter } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ApiContext } from '../../Provider';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { NavigationContainer } from '@react-navigation/native';
// import DrawerNav from './app/navigation/Drawer';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import BleManager from 'react-native-ble-manager';
import {Buffer} from 'buffer';

const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const AddDevice = ({ navigation, route }) => {
  const { fetchCropsHarvested, handleSelectCrop } = useContext(ApiContext);
  const [deviceName, setDeviceName] = useState('');
  const [selectedSoil, setSelectedSoil] = useState('');
  const [allCrops, setAllCrops] = useState([]);
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [selectedCropid, setSelectedCropid] = useState(null);
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
      setSelectedSoil(''); // Reset soil selection when the screen is focused
    }, [])
  );

  useEffect(() => {
    if (selectedSoil) {
      const cropsBySoil = allCrops.filter(crop =>
        crop.crop_soil?.toLowerCase().split(',').map(type => type.trim()).includes(selectedSoil.toLowerCase())
      );
      setFilteredCrops(cropsBySoil);
    } else {
      setFilteredCrops(allCrops);
    }
    BleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', ({value, peripheral, characteristic, service}) => {
        // Display notification message

        console.log(value);
        value = Buffer.from(value).toString('utf-8')
        console.log(value);

        var data = JSON.parse(value)

        // if (value == 'true') {
        //     disconnect();
        //     Alert.alert('Success!');
        // } else if (value == 'existed') {
        //     Alert.alert('Device name already existed.')
        // } else if (value == 'failed_request') {
        //     Alert.alert('Linking device into the server failed. Please try again.')
        // } else {
        //     Alert.alert('Please try again.')
        // }

        // setIsLinkingDone(true);
      });
  }, [selectedSoil, allCrops]);

  // Set selected crop without updating the status
  const handleSelect = (id, cropName) => {
    setSelectedCrop(cropName);setSelectedCropid(id);
  };

  // Confirm device and update selected crop to "planted"
  const handleConfirmDevice = async () => {
    if (!selectedCrop) {
      Alert.alert('Error', 'Please select a crop for the device.');
      return;
    }
    try {
      await handleSelectCrop(selectedCrop); // Update to "planted"
      Alert.alert('Success', `${selectedCrop} has been set to planted.`);
      navigation.navigate('AddDevice'); // Navigate back or to another screen as needed
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

  const connectDevice = async () => {

    // Validate
    if (deviceName.length > 16) {
        Alert.alert('The device name maximum characters is 16.');
        return;
    }

    BleManager.retrieveServices(route.params.device.id).then(
        (info) => {
            BleManager.startNotification(info.id, info.services[2].uuid, info.characteristics[3].characteristic)
                .then(() => {
                // Display confirmation message
                console.log(`Subscribed to ${info.id} - ${info.services[2].uuid} - ${info.characteristics[3].characteristic}`);
                })
                .catch((err) => {
                // Update error message
                    Alert.alert(err.message)
                });
                data = {
                    deviceName: deviceName,
                    crop_id:selectedCropid
                }
                writeData(info, JSON.stringify(data));
        }
        
    )
    

    const writeData = async (info, data) => {
        BleManager.write(info.id, info.services[2].uuid, info.characteristics[3].characteristic, Buffer.from(data).toJSON().data, 512)
            .then(() => {
                console.log("Write success");
            })
            .catch((error) => {
                console.log("Write failed", error);
            });
    }
    const readData = async (info) => {
        let res = null;
        BleManager.read(info.id, info.services[2].uuid, info.characteristics[3].characteristic)
            .then((data) => {
            console.log("message", data)
            })
            .catch((error) => {
                console.log("Read failed", error);
            });

    }
    const disconnect = async () => {
        BleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral');
        BleManagerEmitter.removeAllListeners('BleManagerStopScan');
        // BleManagerEmitter.removeAllListeners('BleManagerConnectPeripheral');
        // BleManagerEmitter.removeAllListeners('BleManagerDisconnectPeripheral');
        BleManagerEmitter.removeAllListeners('BleManagerDidUpdateValueForCharacteristic')
        BleManager.disconnect(props.route.params.item.id).then(
            () => {
                console.log('Disconnected.');
                props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'BottomTabMain' }]
                });
            },
            (e) => {
                console.log(e);
            }
        )
    }
    const wsSend = (message) => { 
        var data = JSON.stringify(message)
        if (websocket && websocket.readyState === WebSocket.OPEN) {
          websocket.send(data);
          console.log('Message sent:', data);
        } else {
          console.error('WebSocket is not open');
        }
      };
    
  }


  return (
    <LinearGradient colors={['#2c3e50', '#f5f5f5']} style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Device Name"
        placeholderTextColor="#95a5a6"
        value={deviceName}
        onChangeText={setDeviceName}
      />

      <Text style={styles.header}>Select Crop for Device</Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedSoil}
          style={styles.picker}
          onValueChange={setSelectedSoil}
        >
          <Picker.Item label="Select soil type" value="" />
          <Picker.Item label="Sandy soil" value="Sandy soil" />
          <Picker.Item label="Silt soil" value="Silt soil" />
          <Picker.Item label="Loamy soil" value="Loamy soil" />
          <Picker.Item label="Clay soil" value="Clay soil" />
        </Picker>
      </View>

      <FlatList
        data={filteredCrops}
        keyExtractor={(item) => item._id?.toString() || Math.random().toString()}
        renderItem={renderCrop}
        ListEmptyComponent={<Text style={styles.noCropText}>No crops found for the selected soil type.</Text>}
      />

      <TouchableOpacity onPress={()=>{
        connectDevice();

      }} style={styles.confirmButton}>
        <Text style={styles.buttonText}>Confirm Device</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-start',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#bdc3c7',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: 'white',
    backgroundColor: '#2c3e50',
  },
  header: {
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  pickerContainer: {
    marginBottom: 20,
  },
  picker: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
    marginBottom: 10,
  },
  cropName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  radioButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  icon: {
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noCropText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default AddDevice;
