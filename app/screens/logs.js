import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ApiContext } from '../../Provider';
import { useFocusEffect } from '@react-navigation/native';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchCropLogs, deleteLogsExceptUnharvested } = useContext(ApiContext);

  useFocusEffect(
    React.useCallback(() => {
      loadLogs();
    }, [])
  );

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

  const handleDeleteAll = async () => {
    try {
      const response = await deleteLogsExceptUnharvested();
      Alert.alert('Success', response.message);
      // Reload logs after deletion
      await loadLogs();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const renderLogItem = ({ item }) => (
    <View style={styles.logItem}>
      <Text style={styles.detail}>Crop: {item.crop_name}</Text>
      <Text style={styles.detail}>Planted Date: {item.crop_date_planted}</Text>
      <Text style={styles.detail}>
        Harvested Date: {item.crop_date_harvested ? item.crop_date_harvested : 'Not harvested yet'}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#a8e6cf', '#f5f5f5']} style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>Crop Logs</Text>
        <FlatList
          data={logs}
          renderItem={renderLogItem}
          key={(item) => item._id}
          ListEmptyComponent={<Text>No crop logs found</Text>}
        />
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAll}>
          <Text style={styles.deleteButtonText}>Delete All</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Logs;
