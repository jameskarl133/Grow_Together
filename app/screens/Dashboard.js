import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function Dashboard({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Grow Together!</Text>
      <Text style={styles.subtitle}>We're excited to help you grow.</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Add Crop"
          onPress={() => alert('Navigate to Add Crop Screen')}
          color="green"
        />
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
});