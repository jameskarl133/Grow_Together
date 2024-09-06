// Import libraries
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Ionicons from '@expo/vector-icons/Ionicons'; // Ensure you have this import for icons
import Dashboard from '../screens/Dashboard'; // Adjust the path as necessary
// Import your other screens if they exist (AddCrop, ManageCrop, ViewProfile)

const Drawer = createDrawerNavigator();

// Custom drawer content component
function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerContainer}>
        {/* Farmer Profile Section */}
        <View style={styles.profileSection}>
          <Ionicons name="person-circle-outline" size={50} color="black" />
        </View>
        
        <Text style={styles.farmerName}>Farmer Field</Text>
        
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
      </View>
    </DrawerContentScrollView>
  );
}

// Main Drawer Navigator component
const DrawerNav = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerTitle: '' }}
    >
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      {/* Uncomment and add components for AddCrop, ManageCrop, and ViewProfile */}
      {/* <Drawer.Screen name="AddCrop" component={AddCrop} />
      <Drawer.Screen name="ManageCrop" component={ManageCrop} />
      <Drawer.Screen name="ViewProfile" component={ViewProfile} /> */}
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
  },
  farmerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

// Make this component available to the app
export default DrawerNav;