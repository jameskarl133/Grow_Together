import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ApiContext } from '../../Provider';

const DeviceList = ({ navigation }) => {
    const { fetchlistofdev, setdev, devicedelete, harvestCrop, fetchCropsPlanted } = useContext(ApiContext);
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDevices();
    }, []);

    const loadDevices = async () => {
        try {
            const data = await fetchlistofdev();
            console.log("Devices fetched:", data);
            setDevices(data);
        } catch (error) {
            console.error("Error details:", error);
            alert(`Network Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteDevice = async () => {
        try {
            const plantedcrop = await fetchCropsPlanted();
            const cropplanted = plantedcrop.find(crop => crop.crop_status === 'planted');
            if (cropplanted) {
                Alert.alert(
                    'Cannot Delete',
                    'There are currently planted crops. Please harvest all crops before deleting devices.',
                    [{ text: 'OK' }]
                );
                return;
            }
            await devicedelete();
        } catch (error) {
            Alert.alert('Error', 'Failed to delete devices');
        }
    };
    

    const handleDevicePress = (device) => {
        setdev(device);
        navigation.navigate('MonitorCrop', { device });
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Device List</Text>
            <FlatList
                data={devices}
                key={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleDevicePress(item)} style={styles.deviceItem}>
                        <Text style={styles.deviceName}>{item.device_name}</Text>
                        <Text style={styles.deviceMac}>{item.mac_ad}</Text>
                    </TouchableOpacity>
                )}
            />
            <TouchableOpacity
                style={styles.deleteAllButton}
                onPress={() => {
                    Alert.alert(
                        'Confirm Disconnection',
                        'Are you sure you want to disconnect device?',
                        [
                            {
                                text: 'Cancel',
                                style: 'cancel'
                            },
                            {
                                text: 'Disconnect',
                                onPress: async () => {
                                    console.log('disconnecting all devices...');
                                    await handleDeleteDevice();
                                    // await devicedelete();
                                }
                            }
                        ]
                    );
                }}
            >
                <Text style={styles.deleteAllButtonText}>Disconnect Device</Text>
            </TouchableOpacity>
                  {/* Reload Button */}
      <TouchableOpacity style={styles.reloadButton} onPress={loadDevices}>
        <Ionicons name="reload" size={20} color="#fff" />
      </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    reloadButton: {
        position: 'absolute',
        bottom: 90,
        right: 30,
        backgroundColor: '#007bff',
        borderRadius: 50,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
      },
    deviceContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    deleteAllButton: {
        backgroundColor: '#ff4444',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    deleteAllButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    deviceItem: {
        padding: 15,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        marginBottom: 10,
        borderColor: '#ddd',
        borderWidth: 1,
    },
    deviceName: {
        fontSize: 18,
        fontWeight: '500',
    },
    deviceMac: {
        fontSize: 14,
        color: '#666',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default DeviceList;
