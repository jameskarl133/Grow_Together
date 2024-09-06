import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const logsData = [
  { id: '1', cropId: 'C001', cropName: 'Tomato', plantedDate: '2024-09-01', harvestedDate: '2024-10-01' },
  { id: '2', cropId: 'C002', cropName: 'Corn', plantedDate: '2024-08-15', harvestedDate: '2024-09-15' }
];

const Logs = () => {
  const renderLogItem = ({ item }) => (
    <View style={styles.logItem}>
      <Text style={styles.detail}>Log ID: {item.id}</Text>
      <Text style={styles.detail}>Crop ID: {item.cropId}</Text>
      <Text style={styles.detail}>Crop: {item.cropName}</Text>
      <Text style={styles.detail}>Planted Date: {item.plantedDate}</Text>
      <Text style={styles.detail}>Harvested Date: {item.harvestedDate}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crop Logs</Text>
      <FlatList
        data={logsData}
        renderItem={renderLogItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 20,
    textAlign: 'center',
  },
  logItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detail: {
    fontSize: 16,
    color: 'black',
    marginBottom: 5,
  },
});

export default Logs;
