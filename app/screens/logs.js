import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const logsData = [
  { id: '1', message: 'Tomato farm watered', timestamp: '2024-10-02 2:00 PM' },
  { id: '2', message: 'Corn farm watered', timestamp: '2024-10-02 3:00 PM' }
];

const Logs = () => {
  const renderLogItem = ({ item }) => (
    <View style={styles.logItem}>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
      <Text style={styles.message}>{item.message}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Farm Log</Text>
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
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 20,
  },
  logItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
  },
  timestamp: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 5,
  },
  message: {
    fontSize: 16,
    color: 'black',
  },
});

export default Logs;
