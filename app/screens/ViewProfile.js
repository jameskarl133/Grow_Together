import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Modal, ScrollView } from 'react-native';
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
    phno: '',
    username: ''
  });
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

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
        const currentProfileData = await viewFarmerProfile(farmerId);

        if (
          currentProfileData.fname === profile.fname &&
          currentProfileData.dob === profile.dob &&
          currentProfileData.address === profile.address &&
          currentProfileData.email === profile.email &&
          currentProfileData.phno === profile.phno &&
          currentProfileData.username === profile.username &&
          !newPassword // Ensure the new password is not provided
        ) {
          Alert.alert('No changes', 'You didn’t change your profile.');
          setModalVisible(false);
          return;
        }

        // Password validation and update
        if (newPassword || confirmNewPassword) {
          if (oldPassword !== currentProfileData.password) {
            Alert.alert('Error', 'Old password does not match.');
            return;
          }

          if (newPassword !== confirmNewPassword) {
            Alert.alert('Error', 'New passwords do not match.');
            return;
          }

          // Update the profile with the new password
          await updateFarmerProfile(farmerId, { ...profile, password: newPassword });
        } else {
          // Update profile without changing password if not provided
          await updateFarmerProfile(farmerId, profile);
        }

        Alert.alert('Success', 'Profile updated successfully!');
        setModalVisible(false);
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
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

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <LinearGradient colors={['#a8e6cf', '#f5f5f5']} style={styles.container}>
      <View style={styles.whiteContainer}>
        <View style={styles.profileContainer}>
          <Ionicons name="person-circle-outline" size={120} color="green" />
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{profile.fname}</Text>
            <Text style={styles.detail}>Birthdate: {profile.dob}</Text>
            <Text style={styles.detail}>Address: {profile.address}</Text>
            <Text style={styles.detail}>Email: {profile.email}</Text>
            <Text style={styles.detail}>Phone: {profile.phno}</Text>
          </View>
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
              <ScrollView contentContainerStyle={styles.scrollContent}>
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
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Username:</Text>
                  <TextInput
                    style={styles.input}
                    value={profile.username}
                    onChangeText={(text) => setProfile({ ...profile, username: text })}
                  />
                </View>

                {/* Password Inputs */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Old Password (Optional):</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.input}
                      value={oldPassword}
                      onChangeText={setOldPassword}
                      secureTextEntry={!showOldPassword}
                    />
                    <TouchableOpacity onPress={() => setShowOldPassword(!showOldPassword)} style={styles.eyeIcon}>
                      <Ionicons
                        name={showOldPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={24}
                        color="gray"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>New Password (Optional):</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.input}
                      value={newPassword}
                      onChangeText={setNewPassword}
                      secureTextEntry={!showNewPassword}
                    />
                    <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={styles.eyeIcon}>
                      <Ionicons
                        name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={24}
                        color="gray"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Confirm New Password (Optional):</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.input}
                      value={confirmNewPassword}
                      onChangeText={setConfirmNewPassword}
                      secureTextEntry={!!showConfirmNewPassword}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmNewPassword(!showConfirmNewPassword)} style={styles.eyeIcon}>
                      <Ionicons
                        name={showConfirmNewPassword  ? 'eye-off-outline' : 'eye-outline'}
                        size={24}
                        color="gray"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
                  <Text style={styles.buttonText}>Update Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </LinearGradient>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  whiteContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 5,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 50,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIcon: {
    marginLeft: -30,
    marginRight: 10,
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
  scrollContent: {
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIcon: {
    marginLeft: -30,
    marginRight: 10,
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
