import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { ApiContext } from '../../Provider'; // Import ApiContext

const DeviceList = ({ navigation }) => {
    const { fetchlistofdev , setdev, devicedelete } = useContext(ApiContext); // Access fetchlistofdev from context
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
            console.error("Error details:", error); // Log full error details
            alert(`Network Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };
    
    const handleDeleteDevice = async () => {
        try {
            await devicedelete();
            loadDevices(); // Refresh the list after deletion
        } catch (error) {
            Alert.alert('Error', 'Failed to delete device');
        }
    };

    useEffect(() => {
        loadDevices();
    }, []);

    const handleDevicePress = (device) => {
        // console.log('ajsdfk')
        setdev(device);
        navigation.navigate('Monitor Crop', { device });
        
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
                    'Confirm Deletion',
                    'Are you sure you want to delete all devices?',
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel'
                        },
                        {
                            text: 'Delete',
                            onPress: async () => {
                                console.log('Deleting all devices...');
                                await handleDeleteDevice();
                                loadDevices();
                            }
                        }
                    ]
                );
            }}
        >
            <Text style={styles.deleteAllButtonText}>Delete All Devices</Text>
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
