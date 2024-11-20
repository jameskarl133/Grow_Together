import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Ionicons from '@expo/vector-icons/Ionicons';
import Dashboard from '../screens/Dashboard';
import MonitorCrop from '../screens/MonitorCrop';
import ConnectDevice from '../screens/ConnectDevice';
import SearchCrop from '../screens/SearchCrop';
import Listofdev from '../screens/listofdev';
import SelectCrop from '../screens/SelectCrop';
import ViewProfile from '../screens/ViewProfile';
import Logs from '../screens/logs';
import Notification from '../screens/Notification';
import { ApiContext } from '../../Provider'; // Adjust according to your Provider path
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddCrop from '../screens/AddCrop';

const Drawer = createDrawerNavigator();

// Custom header component for notification icon
const HeaderWithNotification = ({ navigation }) => (
  <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
    <Ionicons name="notifications-outline" size={30} color="black" style={{ marginRight: 15 }} />
  </TouchableOpacity>
);

// Custom drawer content component with logout button
function CustomDrawerContent(props) {
  const { viewFarmerProfile } = useContext(ApiContext);
  const [farmerName, setFarmerName] = useState('Loading...');

  useEffect(() => {
    const fetchFarmerName = async () => {
      try {
        const farmerId = await AsyncStorage.getItem('farmerId');
        if (farmerId) {
          const profileData = await viewFarmerProfile(farmerId);
          setFarmerName(profileData.fname || 'Unknown Farmer');
        } else {
          setFarmerName('No Farmer ID Found');
        }
      } catch (error) {
        console.error('Error fetching farmer name:', error.message);
        setFarmerName('Error loading farmer');
      }
    };

    fetchFarmerName();
  }, [viewFarmerProfile]);

  // Handle logout action
  const handleLogout = async () => {
    try {
      // Clear AsyncStorage
      await AsyncStorage.removeItem('farmerId');
      // Navigate to Login screen
      props.navigation.navigate('Login');
    } catch (error) {
      console.error('Error during logout:', error.message);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerContainer}>
        <View style={styles.profileSection}>
          <Ionicons name="person-circle-outline" size={50} color="black" />
          <Text style={styles.farmerName}>{farmerName}</Text>
        </View>
        <View style={styles.line} />
        <DrawerItem
          label="Home"
          onPress={() => props.navigation.navigate('Dashboard')}
          icon={({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          )}
        />
          <DrawerItem
          label="Search Crop"
          onPress={() => props.navigation.navigate('SearchCrop')}
          icon={({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          )}
        />
        {/* <DrawerItem
          label="Add Crop"
          onPress={() => props.navigation.navigate('Add Crop')}
          icon={({ color, size }) => (
            <Ionicons name="add-outline" size={size} color={color} />
          )}
        /> */}
        {/* <DrawerItem
          label="Select Crop"
          onPress={() => props.navigation.navigate('SelectCrop')}
          icon={({ color, size }) => (
            <Ionicons name="add-outline" size={size} color={color} />
          )}
        /> */}
        <DrawerItem
          label="Connect To Device"
          onPress={() => props.navigation.navigate('ConnectDevice')}
          icon={({ color, size }) => (
            <Ionicons name="bluetooth-outline" size={size} color={color} />
          )}
        />
        <DrawerItem
          label="List of Devices"
          onPress={() => props.navigation.navigate('Listofdev')}
          icon={({ color, size }) => (
            <Ionicons name="wifi" size={size} color={color} />
          )}
        />
        {/* <DrawerItem
          label="Monitor Crop"
          onPress={() => props.navigation.navigate('MonitorCrop')}
          icon={({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          )}
        /> */}
        <DrawerItem
          label="View Profile"
          onPress={() => props.navigation.navigate('ViewProfile')}
          icon={({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          )}
        />
        <DrawerItem
          label="Logs"
          onPress={() => props.navigation.navigate('Logs')}
          icon={({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          )}
        />
        <View style={styles.line} />
        {/* Logout button at the bottom */}
        <DrawerItem
          label="Logout"
          onPress={handleLogout}
          icon={({ color, size }) => (
            <Ionicons name="log-out-outline" size={size} color={color} />
          )}
          style={styles.logoutButton}
        />
      </View>
    </DrawerContentScrollView>
  );
}

const NavBar = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        headerRight: () => <HeaderWithNotification navigation={navigation} />,
        headerTitle: '', // Optionally remove title
      })}
    >
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      {/* <Drawer.Screen name="Add Crop" component={AddCrop} /> */}
      <Drawer.Screen name="SearchCrop" component={SearchCrop} />
      <Drawer.Screen name ="Listofdev" component={Listofdev}/>
      {/* <Drawer.Screen name="SelectCrop" component={SelectCrop} /> */}
      <Drawer.Screen name="ConnectDevice" component={ConnectDevice} />
      <Drawer.Screen name="Monitor Crop" component={MonitorCrop} />
      <Drawer.Screen name="ViewProfile" component={ViewProfile} />
      <Drawer.Screen name="Logs" component={Logs} />
      <Drawer.Screen name="Notification" component={Notification} />
    </Drawer.Navigator>
  );
};

// Define styles for the drawer and profile section
const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  farmerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 10,
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: 'gray',
    marginVertical: 10,
  },
  logoutButton: {
    marginTop: 'auto', // Push to the bottom
  },
});

export default NavBar;
