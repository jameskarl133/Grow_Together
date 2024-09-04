import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View, Button } from 'react-native';
import Login from './app/screens/Login'; // Adjust the path if necessary
import SignUp from './app/screens/SignUp'; // Adjust the path if necessary
import Dashboard from './app/screens/Dashboard';

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.mainText}>Grow Together</Text>
      <Text style={styles.subText}>Welcome to the Grow Together app</Text>
      <Button
        title="Login Now"
        onPress={() => navigation.navigate('Login')}
        color="green"
      />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainText: {
    color: 'black',
    fontSize: 32,
    fontWeight: 'bold',
  },
  subText: {
    color: 'gray',
    fontSize: 18,
    marginVertical: 20,
  },
});