import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import Svg, { Path } from 'react-native-svg'; 
import { ApiContext } from '../../Provider';

export default function Login({ navigation }) {
  const [form, setForm] = useState({
    username: '',
    password: ''
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const context = useContext(ApiContext);

  const handleLogin = async () => {
    const { username, password } = form;
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password.');
      return;
    }
  
    try {
      const response = await context.login(username, password);
      if (response.status === 200) {
        navigation.navigate('DrawerNav'); 
      } else {
        Alert.alert('Login Failed', 'Incorrect username or password.');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        Alert.alert('Login Failed', 'Incorrect username or password.');
      } else {
        console.error('Login error:', error);
        Alert.alert('Login Failed', 'An error occurred. Please try again later.');
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Circles */}
      <View style={styles.circle1}></View>
      <View style={styles.circle2}></View>
      <View style={styles.circle3}></View>

      {/* Logo */}
      <Image
        source={require('../images/gt-logo-perm1.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.textColor}>Grow Together!</Text>

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Username"
          style={styles.input}
          value={form.username}
          onChangeText={(value) => setForm({ ...form, username: value })}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            secureTextEntry={!passwordVisible}
            style={styles.passwordInput}
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
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

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Forgot Password and Sign up Links */}
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.linkText}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.linkText}>Sign up</Text>
      </TouchableOpacity>

      {/* Footer Wave */}
      <View style={styles.footer}>
        <Svg
          height="100%"
          width="100%"
          viewBox="0 0 1440 420"
          style={styles.wave}
        >
          <Path
            fill="#4CAF50"
            d="M0,320L30,288C60,256,120,192,180,181.3C240,171,300,213,360,213.3C420,213,480,171,540,160C600,149,660,171,720,160C780,149,840,107,900,85.3C960,64,1020,64,1080,74.7C1140,85,1200,107,1260,112C1320,117,1380,107,1410,101.3L1440,96L1440,420L1410,420C1380,420,1320,420,1260,420C1200,420,1140,420,1080,420C1020,420,960,420,900,420C840,420,780,420,720,420C660,420,600,420,540,420C480,420,420,420,360,420C300,420,240,420,180,420C120,420,60,420,30,420L0,420Z"
          />
        </Svg>
      </View>
    </KeyboardAvoidingView>
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
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
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
  button: {
    backgroundColor: 'green',
    paddingVertical: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    color: 'gray',
    textDecorationLine: 'underline',
    marginTop: 20,
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
    height: 130,
  },
  wave: {
    position: 'absolute',
    bottom: 0,
    height: '100%',
  },
});
