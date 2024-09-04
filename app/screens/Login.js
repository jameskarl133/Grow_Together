import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo, otherwise adjust the import accordingly

export default function Login({ navigation }) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.textColor}>Grow Together!</Text>
      <View style={styles.inputContainer}>
        <TextInput placeholder="Username" style={styles.input} />
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            secureTextEntry={!passwordVisible}
            style={styles.passwordInput}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={passwordVisible ? 'eye-off' : 'eye'}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Login"
          onPress={() => navigation.navigate('Dashboard')}
          color="green"
        />
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.linkText}>Sign up</Text>
      </TouchableOpacity>
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
  textColor: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginVertical: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: '100%',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    height: 40,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: '100%',
  },
  passwordInput: {
    flex: 1,
  },
  eyeIcon: {
    marginLeft: 10,
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 10,
  },
  linkText: {
    color: 'gray',
    textDecorationLine: 'underline',
    marginTop: 20,
  },
});

