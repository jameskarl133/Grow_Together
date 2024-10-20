import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const farmer_url = 'http://192.168.1.7:8000/farmer';
const crop_url = 'http://192.168.1.7:8000/crop';
const crop_harvested_url = 'http://192.168.1.7:8000/crop/harvested';
const crop_planted_url = 'http://192.168.1.7:8000/crop/planted';
const farmer_login_url = 'http://192.168.1.7:8000/farmer/login';
const crop_log_url = 'http://192.168.1.7:8000/crop_log';
const farmer_profile_url = 'http://192.168.1.7:8000/farmer/profile';
const crop_logs_delete_all_url = 'http://192.168.1.7:8000/crop_logs/delete_all';
const websocket_url = 'ws://192.168.1.7:8000/ws'; // WebSocket URL

export const ApiContext = createContext();

const MyComponent = ({ children }) => {
  const [websocket, setWebSocket] = useState(null);
  const [messages, setMessages] = useState([]);  // Store WebSocket messages
  const [notificationMessage, setNotificationMessage] = useState("");  // State for notification message
  const [farmer, setFarmer] = useState(null); // State for farmer data

  // WebSocket connection setup
  useEffect(() => {
    const ws = new WebSocket(websocket_url);

    ws.onopen = () => {
      console.log('Connected to WebSocket');
      setWebSocket(ws);  // Store WebSocket connection
    };

    ws.onmessage = (event) => {
      const message = event.data;
      console.log('Received:', message);
      setMessages((prevMessages) => [...prevMessages, message]);  // Store messages
      setNotificationMessage(message);  // Set the notification message when received
    };

    ws.onclose = (event) => {
      console.log('WebSocket disconnected', event.reason);
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error.message);
    };

    // Clean up WebSocket connection on unmount
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();  // Close WebSocket when the component unmounts
      }
    };
  }, []);

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

  return (
    <ApiContext.Provider value={{
      postFarmerData,
      postCropData,
      login,
      viewFarmerProfile,
      updateFarmerProfile,
      fetchCropsHarvested,
      fetchCropsPlanted,
      handleSelectCrop,
      updateCropToHarvest,
      fetchCropLogs,
      deleteLogsExceptUnharvested,
      updateCropLog,
      messages,
      notificationMessage,  // Pass the notificationMessage state to children components
      sendMessage  // WebSocket message sender
    }}>
      {children}
    </ApiContext.Provider>
  );
};

export default MyComponent;
