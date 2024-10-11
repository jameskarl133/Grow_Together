import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Expo LinearGradient alternative

const AddDevice = () => {
  const [deviceId, setDeviceId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    if (!deviceId.trim()) {
      Alert.alert('Error', 'Please enter a valid Device ID.');
      return;
    }

    setIsConnecting(true);

    try {
      // Replace with the actual endpoint to connect to the device
      const response = await axios.post('http://192.168.1.4:8000/device/connect', { deviceId });

      if (response.data.success) {
        Alert.alert('Success', 'Connected to device successfully!');
      } else {
        Alert.alert('Error', 'Failed to connect to device.');
      }
    } catch (error) {
      Alert.alert('Error', `Failed to connect: ${error.message}`);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.backgroundGradient} />
      
      <View style={styles.content}>
        <Text style={styles.title}>Add Device</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter Device ID"
          value={deviceId}
          onChangeText={setDeviceId}
          editable={!isConnecting}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: isConnecting ? 'gray' : 'green' }]}
          onPress={handleConnect}
          disabled={isConnecting}
        >
          <Text style={styles.buttonText}>
            {isConnecting ? 'Connecting...' : 'Connect'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,  // Fills the entire container
    backgroundColor: '#a8e6cf',
    opacity: 0.5,
  },
  content: {
    width: '90%',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  button: {
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddDevice;
