import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ApiContext } from '../../Provider';
import { useFocusEffect } from '@react-navigation/native';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true); // To manage loading state
  const { fetchCropLogs } = useContext(ApiContext);

  // UseFocusEffect ensures the data is re-fetched when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
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
      loadLogs();
    }, [])
  );

  const renderLogItem = ({ item }) => (
    <View style={styles.logItem}>
      <Text style={styles.detail}>Crop: {item.crop_name}</Text>
      <Text style={styles.detail}>Planted Date: {item.crop_date_planted}</Text>
      <Text style={styles.detail}>Harvested Date: {item.crop_date_harvested ? item.crop_date_harvested : 'Not harvested yet'}</Text>
    </View>
  );

  // If data is still loading, show the loading indicator
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#a8e6cf', '#f5f5f5']}
      style={styles.container}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Crop Logs</Text>
        <FlatList
          data={logs}
          renderItem={renderLogItem}
          key={(item, index) => item._id ? item._id.toString() : index.toString()} // Fallback to index if _id is missing
          ListEmptyComponent={<Text>No crop logs found</Text>}
        />
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
});

export default Logs;
