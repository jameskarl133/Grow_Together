// Import libraries
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Ionicons from '@expo/vector-icons/Ionicons';
import Dashboard from '../screens/Dashboard';
import ViewProfile from '../screens/ViewProfile';
<<<<<<< HEAD
import AddCrop from '../screens/AddCrop';

=======
import Logs from '../screens/logs';
>>>>>>> 28d7a6ed7da169eaf9cc73a088ded2b92a92fa40

const Drawer = createDrawerNavigator();

// Custom drawer content component
function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerContainer}>
        {/* Farmer Profile Section */}
        <View style={styles.profileSection}>
          <Ionicons name="person-circle-outline" size={50} color="black" />
          <Text style={styles.farmerName}>Yap</Text>
        </View>

        <DrawerItem
          label="Home"
          onPress={() => props.navigation.navigate('Dashboard')}
          icon={({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          )}
        />

        <DrawerItem
          label="Add Crop"
          onPress={() => props.navigation.navigate('AddCrop')}
          icon={({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          )}
        />
        <DrawerItem
          label="Manage Crop"
          onPress={() => props.navigation.navigate('ManageCrop')}
          icon={({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          )}
        />
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
      </View>
    </DrawerContentScrollView>
  );
}

const DrawerNav = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      drawerContent={(props) => <CustomDrawerContent {...props} />} // Correctly passes custom drawer content
      screenOptions={{ headerTitle: '' }}
    >
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      <Drawer.Screen name="ViewProfile" component={ViewProfile} />
<<<<<<< HEAD
      <Drawer.Screen name="AddCrop" component={AddCrop} />
=======
      <Drawer.Screen name="Logs" component={Logs} />
      {/* <Drawer.Screen name="AddCrop" component={AddCrop} /> */}
>>>>>>> 28d7a6ed7da169eaf9cc73a088ded2b92a92fa40
      {/* <Drawer.Screen name="ManageCrop" component={ManageCrop} /> */}
    </Drawer.Navigator>
  );
};

// Define styles
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
});

export default DrawerNav;