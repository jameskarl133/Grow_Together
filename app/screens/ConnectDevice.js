import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, NativeEventEmitter, PermissionsAndroid, NativeModules, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import BleManager from "react-native-ble-manager";

const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const ConnectDevice = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [deviceList, setDeviceList] = useState([]);
  const [isListened, setIsListened] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    requestFineLocation();

    if (!isListened) {
      BleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);
      BleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
      setIsListened(true);
      console.log('Listener activated.');
    }
  }, [isListened]);

  const handleStopScan = () => {
    setIsScanning(false);
    console.log('Scan is stopped');
  };

  const handleDiscoverPeripheral = (peripheral) => {
    setDeviceList(prevList => {
      const exists = prevList.some(device => device.id === peripheral.id);
      return exists ? prevList : [...prevList, peripheral];
    });
  };

  const requestFineLocation = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);

      if (granted['android.permission.ACCESS_FINE_LOCATION'] === 'granted'
        && granted['android.permission.ACCESS_COARSE_LOCATION'] === 'granted'
        && granted['android.permission.BLUETOOTH_SCAN'] === 'granted'
        && granted['android.permission.BLUETOOTH_ADVERTISE'] === 'granted'
        && granted['android.permission.BLUETOOTH_CONNECT'] === 'granted') {
        BleManager.enableBluetooth()
          .then(() => {
            console.log('Bluetooth is enabled');
            runScan();
          })
          .catch(() => {
            setIsScanning(false);
            Alert.alert('Please turn on Bluetooth.');
          });
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const runScan = async () => {
    setDeviceList([]);
    setIsScanning(true);
    BleManager.start({ showAlert: false })
      .then(() => {
        BleManager.scan([], 10)
          .then(() => {
            console.log('Scanning...');
          });
      });
  };

  const connect = async (item) => {
    // console.log(item.advertising.serviceUUIDs[0]);
    BleManager.connect(item.id)
      .then(() => {
        BleManager.requestMTU(item.id, 400)
        .then((mtu) => {
          console.log('MTU size changed to '+ mtu + 'bytes');
      }).catch((e) => {
        console.log('maxbytes', e);
      })
        console.log("Connected");
        navigation.navigate('AddDevice', { device: item });

      })
      .catch((error) => {
        Alert.alert(error);
      });
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#a8e6cf', '#dcedc1']} style={styles.backgroundGradient} />
      
      <View style={styles.content}>
        <Text style={styles.title}>Available Devices</Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: isScanning ? '#cccccc' : '#4caf50' }]}
          onPress={runScan}
          disabled={isScanning}
        >
          <Text style={styles.buttonText}>
            {isScanning ? 'Scanning...' : 'Scan for Devices'}
          </Text>
        </TouchableOpacity>

        <FlatList
          data={deviceList}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.deviceItem} 
              // onPress={() => navigation.navigate('AddDevice', { deviceId: item.id })}
              onPress={()=> {connect(item)}}
            >
              <Text style={styles.deviceName}>{item.name || "Unnamed"}</Text>
              <Text style={styles.deviceId}>{item.id}</Text>
            </TouchableOpacity>
          )}
          style={styles.deviceList}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f4c3',
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    width: '90%',
    padding: 25,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  button: {
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 15,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '500',
  },
  deviceList: {
    width: '100%',
    marginTop: 20,
  },
  deviceItem: {
    padding: 15,
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
    marginBottom: 10,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1565c0',
  },
  deviceId: {
    fontSize: 14,
    color: '#555',
  },
});

export default ConnectDevice;
