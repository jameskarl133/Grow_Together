import React, { useContext, useState } from 'react';
import { StyleSheet, Text, TextInput, Button, ScrollView, TouchableOpacity, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ApiContext } from '../../Provider';  // Adjust the path if necessary

export default function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [field, setField] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState(new Date());
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  
  const { postFarmerData } = useContext(ApiContext);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    hideDatePicker();
    setDate(currentDate);
    setDob(currentDate.toISOString().split('T')[0]);
  };

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const farmerData = {
      fname: firstName,
      mname: middleName,
      lname: lastName,
      dob: dob.toString(),
      address: address,
      email: email,
      phno: phoneNumber,
      username: username,
      password: password,
      field_type: field,
      status: 'active', // or any default status you prefer
    };
    console.log(dob.toString());
    try {
      const response = await postFarmerData(farmerData);
      alert('Sign Up Successful');
    } catch (error) {
      alert('Error during sign up');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.textColor}>Sign Up</Text>
      <TextInput placeholder="First Name" style={styles.input} value={firstName} onChangeText={setFirstName} />
      <TextInput placeholder="Middle Name" style={styles.input} value={middleName} onChangeText={setMiddleName} />
      <TextInput placeholder="Last Name" style={styles.input} value={lastName} onChangeText={setLastName} />

      <View style={styles.pickerContainer}>
        <Picker selectedValue={field} onValueChange={(itemValue) => setField(itemValue)}>
          <Picker.Item label="Select field type:" value="" enabled={false} style={{ color: 'gray' }} />
          <Picker.Item label="Greenhouse" value="Greenhouse" />
          <Picker.Item label="Open" value="Open" />
          <Picker.Item label="Small" value="Small" />
        </Picker>
      </View>

      <TouchableOpacity onPress={showDatePicker} style={styles.dateInput}>
        <Text style={{ color: 'gray' }}>{dob ? dob : 'Date of Birth'}</Text>
      </TouchableOpacity>
      {isDatePickerVisible && (
        <DateTimePicker value={date} mode="date" display="default" onChange={handleConfirm} />
      )}

      <TextInput placeholder="Address" style={styles.input} value={address} onChangeText={setAddress} />
      <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput placeholder="Phone Number" style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="numeric" maxLength={11} />
      <TextInput placeholder="Username" style={styles.input} value={username} onChangeText={setUsername} />

      <View style={styles.passwordContainer}>
        <TextInput placeholder="Password" style={styles.passwordInput} value={password} onChangeText={setPassword} secureTextEntry={!passwordVisible} />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeIcon}>
          <Ionicons name={passwordVisible ? 'eye-off' : 'eye'} size={24} color="gray" />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput placeholder="Confirm Password" style={styles.passwordInput} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!confirmPasswordVisible} />
        <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)} style={styles.eyeIcon}>
          <Ionicons name={confirmPasswordVisible ? 'eye-off' : 'eye'} size={24} color="gray" />
        </TouchableOpacity>
      </View>

      <Button title="Sign Up" onPress={handleSignUp} color="green" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#e0f7e9',
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '100%',
    borderRadius: 5,
  },
  dateInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '100%',
    borderRadius: 5,
    justifyContent: 'center',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    height: 40,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '100%',
    borderRadius: 5,
  },
  passwordInput: {
    flex: 1,
    height: '100%',
  },
  eyeIcon: {
    marginLeft: 10,
  },
  pickerContainer: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    width: '100%',
    borderRadius: 5,
    justifyContent: 'center',
  },
});