import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient'; 
const MonitorCrop = () => {
  const [cropData, setCropData] = useState({
    moistureLevel: 30,
    waterLevel: 70,
    temperature: 25,
  });

  useEffect(() => {
    const fetchData = () => {
      setCropData({
        moistureLevel: 40,
        waterLevel: 10,
        temperature: 26,
      });
    };

    fetchData();
  }, []);

  const categorizeLevel = (value) => {
    if (value <= 30) return 'Low';
    if (value <= 70) return 'Mid';
    return 'High';
  };

  return (
    <LinearGradient
      // Add LinearGradient for background
      colors={['#a8e6cf', '#f5f5f5']} // Light green to light gray
      style={styles.container}
    >
      <Text style={styles.header}>Monitor Crop</Text>

      <View style={styles.statCard}>
        <Ionicons name="speedometer-outline" size={40} color="#3498db" />
        <View style={styles.statTextContainer}>
          <Text style={styles.statLabel}>Moisture Level</Text>
          <Text style={styles.statValue}>{categorizeLevel(cropData.moistureLevel)}</Text>
        </View>
      </View>

      <View style={styles.statCard}>
        <Ionicons name="water-outline" size={40} color="#1abc9c" />
        <View style={styles.statTextContainer}>
          <Text style={styles.statLabel}>Water Level</Text>
          <Text style={styles.statValue}>{categorizeLevel(cropData.waterLevel)}</Text>
        </View>
      </View>

      <View style={styles.statCard}>
        <Ionicons name="thermometer-outline" size={40} color="#e74c3c" />
        <View style={styles.statTextContainer}>
          <Text style={styles.statLabel}>Temperature</Text>
          <Text style={styles.statValue}>{cropData.temperature}°C</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: 30,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4, 
  },
  statTextContainer: {
    marginLeft: 15,
  },
  statLabel: {
    fontSize: 18,
    color: '#34495e',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
});

export default MonitorCrop;
