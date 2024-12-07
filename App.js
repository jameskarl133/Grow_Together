import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View, Button } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Login from './app/screens/Login'; // Adjust the path if necessary
import SignUp from './app/screens/SignUp'; // Adjust the path if necessary
import Dashboard from './app/screens/Dashboard';
import DrawerNav from './app/navigation/Drawer';
import NavBar from './app/navigation/NavBar';
import MyComponent from './Provider';
import AddDevice from './app/screens/AddDevice';
import ConnectDevice from './app/screens/ConnectDevice';
import ForgotPass from './app/screens/forgotpass';
import { registerRootComponent } from 'expo';

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.topWavy}>
        <Svg height="100%" width="100%" viewBox="0 0 1440 400" style={styles.invertedWave}>
          <Path fill="lightgreen" d="M0,64L30,74.7C60,85,120,107,180,101.3C240,96,300,64,360,85.3C420,107,480,181,540,213.3C600,245,660,235,720,208C780,181,840,139,900,138.7C960,139,1020,181,1080,192C1140,203,1200,181,1260,154.7C1320,128,1380,96,1410,80L1440,64L1440,400L1410,400C1380,400,1320,400,1260,400C1200,400,1140,400,1080,400C1020,400,960,400,900,400C840,400,780,400,720,400C660,400,600,400,540,400C480,400,420,400,360,400C300,400,240,400,180,400C120,400,60,400,30,400L0,400Z" />
        </Svg>
      </View>

      {/* Main content */}
      <Text style={styles.mainText}>Grow Together</Text>
      <Text style={styles.subText}>Welcome to the Grow Together app</Text>
      <Button
        title="Login Now"
        onPress={() => navigation.navigate('Login')}
        color="green"
      />

      <View style={styles.bottomWavy}>
        <Svg height="100%" width="100%" viewBox="0 0 1440 400" style={styles.bottomWave}>
          <Path fill="lightgreen" d="M0,256L30,250.7C60,245,120,235,180,224C240,213,300,203,360,186.7C420,171,480,149,540,138.7C600,128,660,128,720,160C780,192,840,256,900,261.3C960,267,1020,213,1080,192C1140,171,1200,181,1260,170.7C1320,160,1380,128,1410,112L1440,96L1440,400L1410,400C1380,400,1320,400,1260,400C1200,400,1140,400,1080,400C1020,400,960,400,900,400C840,400,780,400,720,400C660,400,600,400,540,400C480,400,420,400,360,400C300,400,240,400,180,400C120,400,60,400,30,400L0,400Z" />
        </Svg>
      </View>
    </View>
  );
}

export default function App() {
  return (
      <MyComponent>

    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown:false}}>
      
        {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ForgotPass" component={ForgotPass} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="DrawerNav" component={NavBar} />
        <Stack.Screen name="ConnectDevice" component={ConnectDevice}/>
        <Stack.Screen name="AddDevice" component={AddDevice}/>
        {/* <Stack.Screen name="Dashboard" component={Dashboard} /> */}
      </Stack.Navigator>

    </NavigationContainer>

      </MyComponent>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  mainText: {
    color: 'black',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subText: {
    color: 'gray',
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
  },
  topWavy: {
    position: 'absolute',
    top: -50, 
    width: '100%',
    height: 200,  
  },
  bottomWavy: {
    position: 'absolute',
    bottom: 0, 
    width: '100%',
    height: 100,  
  },
  invertedWave: {
    transform: [{ scaleY: -1 }], 
  },
  bottomWave: {
    marginBottom: -1, 
  },
});

registerRootComponent(App);