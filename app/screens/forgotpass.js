import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { ApiContext } from '../../Provider';
import Ionicons from 'react-native-vector-icons/Ionicons';  // Import Ionicons

const ForgotPass = ({ navigation }) => {
  const { verifyUsername, verifySecurityAnswer, updatePassword } = useContext(ApiContext);
  const [username, setUsername] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);  // To track steps of the process
  const [loadingUsername, setLoadingUsername] = useState(false);
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [loadingPasswordUpdate, setLoadingPasswordUpdate] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);  // Toggle password visibility
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);  // Toggle confirm password visibility

  const handleUsernameSubmit = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Username cannot be empty.');
      return;
    }
  
    setLoadingUsername(true);
    try {
      const data = await verifyUsername(username);
      setSecurityQuestion(data.question);
      setStep(2);  // Move to the next step
    } catch (error) {
      Alert.alert('Error', 'Username not found.');
    } finally {
      setLoadingUsername(false);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!answer.trim()) {
      Alert.alert('Error', 'Answer cannot be empty.');
      return;
    }
  
    setLoadingAnswer(true);
    try {
      const response = await verifySecurityAnswer(username, answer);
      if (response.success) {
        Alert.alert('Success');
        setStep(3);  // Move to password update step
      } else {
        Alert.alert('Error', 'Incorrect answer.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to verify answer.');
    } finally {
      setLoadingAnswer(false);
    }
  };
  

  const handlePasswordUpdate = async () => {
    if (!password.trim()) {
      Alert.alert('Error', 'Password cannot be empty.');
      return;
    }
  
    if (!confirmPassword.trim()) {
      Alert.alert('Error', 'Confirm Password cannot be empty.');
      return;
    }
  
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
  
    setLoadingPasswordUpdate(true);
    try {
      await updatePassword(username, password);
      Alert.alert('Success', 'Password updated successfully!');
      navigation.navigate('Login');  // Navigate back to login
    } catch (error) {
      Alert.alert('Error', 'Failed to update password.');
    } finally {
      setLoadingPasswordUpdate(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../images/background2.png')} // Replace with your image path
        style={styles.backgroundImage}
      >
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
            <View style={styles.logoContainer}>
              <Image
                source={require('../images/gt-logo-perm1.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.textColor}>Grow Together!</Text>
            </View>

            <View style={styles.formContainer}>
              {step === 1 && (
                <>
                  <Text style={styles.label}>Enter your username</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                  />
                  <Button
                    title={loadingUsername ? "Verifying..." : "Next"}
                    onPress={handleUsernameSubmit}
                    disabled={loadingUsername}
                    color="green"  // Set button color to green
                  />
                </>
              )}

              {step === 2 && (
                <>
                  <Text style={styles.label}>{securityQuestion}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Answer"
                    value={answer}
                    onChangeText={setAnswer}
                  />
                  <Button
                    title={loadingAnswer ? "Verifying..." : "Submit Answer"}
                    onPress={handleAnswerSubmit}
                    disabled={loadingAnswer}
                    color="green"  // Set button color to green
                  />
                </>
              )}

              {step === 3 && (
                <>
                  <Text style={styles.label}>New Password</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="New Password"
                      secureTextEntry={!passwordVisible}
                      value={password}
                      onChangeText={setPassword}
                    />
                    <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeIcon}>
                      <Ionicons name={passwordVisible ? 'eye-off' : 'eye'} size={24} color="gray" />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.label}>Confirm Password</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      placeholder="Confirm Password"
                      style={styles.passwordInput}  // Ensure this is styled properly
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!confirmPasswordVisible} // Toggle visibility
                    />
                    <TouchableOpacity
                      onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                      style={styles.eyeIcon}
                    >
                      <Ionicons
                        name={confirmPasswordVisible ? 'eye-off' : 'eye'}
                        size={24}
                        color="gray"
                      />
                    </TouchableOpacity>
                  </View>

                  <Button
                    title={loadingPasswordUpdate ? "Updating..." : "Update Password"}
                    onPress={handlePasswordUpdate}
                    disabled={loadingPasswordUpdate}
                    color="green"  // Set button color to green
                  />
                </>
              )}
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.backButton}>
              <Text style={styles.backButtonText}>Back to Login</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    alignItems: 'center',
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: -10,
  },
  textColor: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
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
    width: '100%',
    position: 'relative',
  },
  passwordInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: '100%',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 12,
  },
  backButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    width: '50%',
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ForgotPass;
