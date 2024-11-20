import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from "expo-notifications";
import { initializeNotifications } from './app/screens/initialize';


initializeNotifications();

const farmer_url = 'http://192.168.1.2:8000/farmer';
const crop_url = 'http://192.168.1.2:8000/crop';
const crop_harvested_url = 'http://192.168.1.2:8000/crop/harvested';
const crop_planted_url = 'http://192.168.1.2:8000/crop/planted';
const farmer_login_url = 'http://192.168.1.2:8000/farmer/login';
const crop_log_url = 'http://192.168.1.2:8000/crop_log';
const farmer_profile_url = 'http://192.168.1.2:8000/farmer/profile';
const crop_logs_delete_all_url = 'http://192.168.1.2:8000/crop_logs/delete_all';
const device_delete_url='http://192.168.1.2:8000/device/delete_all';
const websocket_url = 'ws://192.168.1.2:8000/ws'; // WebSocket URL
const websocket_link ='ws://192.168.1.2:8000/link';
const notifdelete_url = 'http://192.168.1.2:8000/notifications/delete_all'
const listofdev_url = 'http://192.168.1.2:8000/device';

export const ApiContext = createContext();

const MyComponent = ({ children }) => {
  const [websocket, setWebSocket] = useState(null);
  const [messages, setMessages] = useState([]);  // Store WebSocket messages
  const [wsmessage, setwsMessages] = useState({})
  const [notificationMessage, setNotificationMessage] = useState("");  // State for notification message
  const [farmer, setFarmer] = useState(null); // State for farmer data
  const [device, setDevice] = useState({});
  let is_water_low = false;
  let is_soil_low = false;


  const setdev = async (data) =>{
    // console.log('random bs',data)
    await setDevice(data)
  }
  // WebSocket connection setup
  const setupWebSocket = () => {
    const ws = new WebSocket(websocket_url);

    ws.onopen = () => {
      console.log('Connected to WebSocket');
      setWebSocket(ws);  // Store WebSocket connection
    };
  
    ws.onmessage = async (event) => {
      if (event.data.includes("WATER") || event.data.includes("delete")) {
        return
      }
      await scheduleNotification(JSON.parse(event.data));
    };
  
    ws.onclose = (event) => {
      console.log('WebSocket disconnected', event.reason);
      setWebSocket(ws);
      console.log('reconnected')
    };
  
    ws.onerror = (error) => {
      console.error('WebSocket Error:', error.message);
    };
  };

  const scheduleNotification = async (message) => {
    
    // console.log(wsmessage)
    try {
      // console.log('notifying:', message.message);
      let data = JSON.parse(message.message)
      
      // console.log(message.message)
      // console.log(data.id)
      // console.log(device)
      // if(data.id == device.id) {
        setwsMessages(data);
      // }
        
      
      if (data.water_level == "Low" && !is_water_low){
        is_water_low = true
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'New Message',
            body: "Low water Level",
          },
          trigger: null,
        });
      }
      else if (data.water_level != "Low" && is_water_low){
        is_water_low = false
      }
      if (data.soil_moisture >= 3000 && !is_soil_low){
        is_soil_low = true;
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'New Message',
            body: "Low soil moisture", // Display the fetched message from the database
          },
          
          trigger: null, // Display immediately
        });
      }
      else if (data.soil_moisture < 3000 && is_soil_low){
        is_soil_low = false;
      }
      
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  // WebSocket message sending function
  const sendMessage = (message) => {
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(message);
      console.log('Message sent:', message);
    } else {
      console.error('WebSocket is not open');
    }
  };

  // Farmer login function
  const login = async (username, password) => {
    try {
      const response = await axios.get(farmer_login_url, { params: { username, password } });
      const farmerData = response.data.farmer;
      setFarmer(farmerData); // Set farmer state
      await AsyncStorage.setItem('farmerId', farmerData.id);  // Store farmer ID in AsyncStorage
      setupWebSocket();  // Open WebSocket connection on successful login
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Invalid username or password.');
      }
      throw new Error('Error logging in: ' + error.message);
    }
  };

  // Farmer profile view function
  const viewFarmerProfile = async () => {
    try {
      const farmerId = await AsyncStorage.getItem('farmerId');
      if (!farmerId) throw new Error('No farmer ID found.');
      const response = await axios.get(farmer_profile_url, { params: { farmer_id: farmerId } });
      return response.data;
    } catch (error) {
      console.error('Error fetching farmer profile:', error.message);
      throw error;
    }
  };

  // Farmer profile update function
  const updateFarmerProfile = async (farmerId, profileData) => {
    try {
      const response = await axios.put(`${farmer_url}/${farmerId}`, profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating farmer profile:', error.message);
      throw error;
    }
  };

  // Post farmer data
  const postFarmerData = async (farmerData) => {
    try {
      const response = await axios.post(farmer_url, farmerData);
      return response.data;
    } catch (error) {
      console.error('Error posting farmer data:', error.message);
      throw error;
    }
  };

  // Post crop data
  const postCropData = async (cropData) => {
    try {
      const response = await axios.post(crop_url, cropData);
      return response.data;
    } catch (error) {
      console.error('Error posting crop data:', error.message);
      throw error;
    }
  };

  // Fetch harvested crops
  const fetchCropsHarvested = async () => {
    try {
      const response = await axios.get(crop_harvested_url);
      return response.data;
    } catch (error) {
      console.error('Error fetching harvested crops:', error.message);
      throw error;
    }
  };

  // Fetch planted crops
  const fetchCropsPlanted = async () => {
    try {
      const response = await axios.get(crop_planted_url);
      return response.data;
    } catch (error) {
      console.error('Error fetching planted crops:', error.message);
      throw error;
    }
  };

  // Update crop status to harvested
  const updateCropToHarvest = async (cropName) => {
    try {
      const response = await axios.put(`${crop_url}/${cropName}/harvested`);
      return response.data;
    } catch (error) {
      console.error('Error updating crop to harvested:', error.message);
      throw error;
    }
  };

  // Select crop and update to planted
  const handleSelectCrop = async (cropName) => {
    try {
      const plantedCrops = await fetchCropsPlanted();
      
      if (!plantedCrops || plantedCrops.length === 0) {
        await updateCropToPlanted(cropName);
        alert('Success: Crop status updated to planted.');
      } else {
        alert('Error: Another crop is already planted.');
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  // Update crop status to planted
  const updateCropToPlanted = async (cropName) => {
    try {
      const response = await axios.put(`${crop_url}/${cropName}/planted`);
      return response.data;
    } catch (error) {
      console.error('Error updating crop:', error.message);
      throw error;
    }
  };

  // Fetch crop logs
  const fetchCropLogs = async () => {
    try {
      const response = await axios.get(crop_log_url);
      return response.data;
    } catch (error) {
      console.error('Error fetching crop logs:', error.message);
      throw error;
    }
  };

  const fetchlistofdev = async () => {
    try {
      const response = await axios.get(listofdev_url);
      return response.data;
    } catch (error) {
      console.error('Error fetching crop logs:', error.message);
      throw error;
    }
  };

  // Update crop log to harvested
  const updateCropLog = async (cropName) => {
    try {
      const response = await axios.put(`${crop_log_url}/${cropName}/harvested`);
      return response.data;
    } catch (error) {
      console.error('Error updating crop log:', error.message);
      throw error;
    }
  };

  // Delete all logs except unharvested
  const deleteLogsExceptUnharvested = async () => {
    try {
      const response = await axios.delete(crop_logs_delete_all_url);
      return response.data;
    } catch (error) {
      console.error('Error deleting logs:', error.message);
      throw error;
    }
  };

  const deletenotifs = async () => {
    try {
      const response = await axios.delete(notifdelete_url);
      return response.data;
    } catch (error) {
      console.error('Error deleting logs:', error.message);
      throw error;
    }
  };

  const devicedelete = async() => {
    try {
      const response = await axios.delete(device_delete_url);
      try{
        websocket.send("delete")
      } catch (error) {
        console.log('Error deleting devices:', error.message);
        throw error;
      }
      return response.data;
    } catch (error) {
      console.log('Error deleting devices:', error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('farmerId');  // Clear farmer ID on logout
      if (websocket) {
        websocket.close();  // Close WebSocket connection on logout
        setWebSocket(null);  // Clear WebSocket state
      }
      setFarmer(null);  // Clear farmer data state
    } catch (error) {
      console.error('Error during logout:', error.message);
      throw error;
    }
  };

  return (
    <ApiContext.Provider value={{
      postFarmerData,
      deletenotifs,
      postCropData,
      login,
      logout,
      viewFarmerProfile,
      updateFarmerProfile,
      fetchCropsHarvested,
      fetchCropsPlanted,
      handleSelectCrop,
      updateCropToHarvest,
      fetchCropLogs,
      deleteLogsExceptUnharvested,
      updateCropLog,
      fetchlistofdev,
      wsmessage,
      notificationMessage,  // Pass the notificationMessage state to children components
      sendMessage,
      websocket,
      devicedelete,
      setdev
       // WebSocket message sender
    }}>
      {children}
    </ApiContext.Provider>
  );
};

export default MyComponent;
