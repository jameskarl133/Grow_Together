import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const ViewProfile = () => {
  return (
    <View style={styles.container}>
      {/* Profile picture */}
      <View style={styles.profilePicContainer}>
        <Ionicons name="person-circle-outline" size={120} color="green" />
      </View>
      
      {/* Name */}
      <Text style={styles.name}>Yap, Christian Noel V.</Text>
      
      {/* Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Dob:</Text>
          <Text style={styles.detailValue}>December 7, 2002</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Address:</Text>
          <Text style={styles.detailValue}>Casuntingan, Mandaue City, Cebu</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Email:</Text>
          <Text style={styles.detailValue}>christiannoelyap621@gmail.com</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Phone Number:</Text>
          <Text style={styles.detailValue}>09226240769</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  profilePicContainer: {
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 20,
  },
  detailsContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    width: '40%',
  },
  detailValue: {
    fontSize: 16,
    color: 'gray',
    width: '60%',
  },
});

export default ViewProfile;
