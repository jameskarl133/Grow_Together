import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Svg, { Path } from 'react-native-svg'; 

export default function Dashboard({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.circle1}></View>
      <View style={styles.circle2}></View>
      <View style={styles.circle3}></View>

      <Text style={styles.title}>Welcome to Grow Together!</Text>
      <Text style={styles.subtitle}>We're excited to help you grow.</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Add Crop"
          onPress={() => navigation.navigate('AddCrop')}
          color="green"
        />
      </View>

      <View style={styles.footer}>
        <Svg
          height="100%"
          width="100%"
          viewBox="0 0 1440 320"
          style={styles.wave}
        >
          <Path
            fill="#4CAF50" 
            d="M0,224L30,202.7C60,181,120,139,180,117.3C240,96,300,96,360,101.3C420,107,480,117,540,112C600,107,660,85,720,74.7C780,64,840,64,900,80C960,96,1020,128,1080,128C1140,128,1200,96,1260,96C1320,96,1380,128,1410,144L1440,160L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
          />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
    width: '80%',
  },
  circle1: {
    position: 'absolute',
    top: -120,
    left: -120,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'darkgreen',
    zIndex: -1,
  },
  circle2: {
    position: 'absolute',
    top: -80,
    left: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'green',
    zIndex: -1,
  },
  circle3: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'lightgreen',
    zIndex: -1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '200%',
    height: 140, 
  },
  wave: {
    position: 'absolute',
    bottom: 0,
    height: '200%',
  },
});

