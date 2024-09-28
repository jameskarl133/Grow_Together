import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { ApiContext } from '../../Provider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';


const ViewProfile = ({ navigation }) => {
  const { viewFarmerProfile } = useContext(ApiContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
        try {
            const farmerId = await AsyncStorage.getItem('farmerId'); 
            if (farmerId) {
                const profileData = await viewFarmerProfile(farmerId);
                console.log('Profile Data:', profileData);
                setProfile(profileData); 
            } else {
                console.error('Farmer ID not found in AsyncStorage');
            }
        } catch (error) {
            console.error('Error fetching profile:', error.message);
        } finally {
            setLoading(false); 
        }
    };

    fetchProfile(); 
  }, [viewFarmerProfile]);


  const handleUpdateProfile = () => {
    // Navigate to the update profile screen or open a modal
    navigation.navigate('UpdateProfile'); // Assuming you have an UpdateProfile screen
  };

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
        {/* Profile picture and name row */}
        <View style={styles.profileRow}>
          {/* Profile picture */}
          <View style={styles.profilePicContainer}>
            <Ionicons name="person-circle-outline" size={120} color="green" />
          </View>

          {/* Name */}
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{profile?.fname || 'Name not available'}</Text>
          </View>
        </View>

        {/* Update profile icon */}
        <TouchableOpacity style={styles.updateIconContainer} onPress={handleUpdateProfile}>
          <Ionicons name="create-outline" size={30} color="gray" />
        </TouchableOpacity>

        {/* Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Dob:</Text>
            <Text style={styles.detailValue}>{profile?.dob || 'Date of birth not available'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Address:</Text>
            <Text style={styles.detailValue}>{profile?.address || 'Address not available'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email:</Text>
            <Text style={styles.detailValue}>{profile?.email || 'Email not available'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phone Number:</Text>
            <Text style={styles.detailValue}>{profile?.phno || 'Phone number not available'}</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  profileRow: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 50,
  },
  profilePicContainer: {
    marginRight: 20,
  },
  updateIconContainer: {
    position: 'absolute',
    top: 30,
    right: 20,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'green',
  },
  detailsContainer: {
    marginTop: 30,
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
