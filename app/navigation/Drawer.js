//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Dashboard from '../screens/Dashboard';

const Drawer = createDrawerNavigator();


// create a component
const DrawerNav = (props) => {
    return (
        <Drawer.Navigator initialRouteName='Dashboard' screenOptions={{headerTitle:''}} >
            
            <Drawer.Screen name="Dashboard" component={Dashboard} />
            {/* <Drawer.Screen name="Home" component={HomeScren} /> */}
        </Drawer.Navigator>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default DrawerNav;
