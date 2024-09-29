import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { ApiContext } from '../../Provider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ViewProfile = () => {
  const { viewFarmerProfile, updateFarmerProfile } = useContext(ApiContext);
  const [profile, setProfile] = useState({
    fname: '',
    dob: '',
    address: '',
    email: '',
    phno: ''
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const farmerId = await AsyncStorage.getItem('farmerId');
        if (farmerId) {
          const profileData = await viewFarmerProfile(farmerId);
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

  const handleUpdate = async () => {
    try {
      const farmerId = await AsyncStorage.getItem('farmerId');
      if (farmerId) {
        await updateFarmerProfile(farmerId, profile);
        Alert.alert('Success', 'Profile updated successfully!');
        setModalVisible(false); 
      } else {
        Alert.alert('Error', 'Failed to find farmer ID.');
      }
    } catch (error) {
      console.error('Error updating profile:', error.message);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleUpdateProfileIcon = () => {
    setModalVisible(true); 
  };

  return (
    <LinearGradient colors={['#a8e6cf', '#f5f5f5']} style={styles.container}>
      <View style={styles.profileContainer}>
        <Ionicons name="person-circle-outline" size={120} color="green" />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{profile.fname}</Text>
          <Text style={styles.detail}>DOB: {profile.dob}</Text>
          <Text style={styles.detail}>Address: {profile.address}</Text>
          <Text style={styles.detail}>Email: {profile.email}</Text>
          <Text style={styles.detail}>Phone: {profile.phno}</Text>
        </View>
        {/* Update Profile Icon */}
        <TouchableOpacity onPress={handleUpdateProfileIcon} style={styles.editIcon}>
          <Ionicons name="create-outline" size={30} color="green" />
        </TouchableOpacity>
      </View>

      {/* Update Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Profile</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name:</Text>
              <TextInput
                style={styles.input}
                value={profile.fname}
                onChangeText={(text) => setProfile({ ...profile, fname: text })}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Date of Birth:</Text>
              <TextInput
                style={styles.input}
                value={profile.dob}
                onChangeText={(text) => setProfile({ ...profile, dob: text })}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Address:</Text>
              <TextInput
                style={styles.input}
                value={profile.address}
                onChangeText={(text) => setProfile({ ...profile, address: text })}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email:</Text>
              <TextInput
                style={styles.input}
                value={profile.email}
                onChangeText={(text) => setProfile({ ...profile, email: text })}
                keyboardType="email-address"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number:</Text>
              <TextInput
                style={styles.input}
                value={profile.phno}
                onChangeText={(text) => setProfile({ ...profile, phno: text })}
                keyboardType="phone-pad"
              />
            </View>

            <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
              <Text style={styles.buttonText}>Update Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 50,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'green',
  },
  detail: {
    fontSize: 16,
    color: 'black',
    marginVertical: 5,
  },
  editIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginTop: 10,
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    width: '100%',
  },
  updateButton: {
    marginTop: 20,
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ViewProfile;
