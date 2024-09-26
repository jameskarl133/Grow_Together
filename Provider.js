import React, { createContext, useState } from 'react';
import axios from 'axios';

const farmer_url = 'http://192.168.0.107:8000/farmer';
const crop_url = 'http://192.168.0.107:8000/crop';
const crop_ondb_url = 'http://192.168.0.107:8000/crop/ondb';
const crop_planted_url = 'http://192.168.0.107:8000/crop/planted';
const farmer_login_url = 'http://192.168.0.107:8000/farmer/login';

export const ApiContext = createContext();

const MyComponent = ({ children }) => {
  const [farmer, setFarmer] = useState(null);

  const login = async (username, password) => {
    try {
      const response = await axios.get(farmer_login_url, { params: { username, password } });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Invalid username or password.');
      }
      throw new Error('Error logging in: ' + error.message);
    }
  };

  const postFarmerData = async (farmerData) => {
    try {
      const response = await axios.post(farmer_url, farmerData);
      return response.data;
    } catch (error) {
      console.error('Error posting farmer data:', error.message);
      throw error;
    }
  };

  const postCropData = async (cropData) => {
    try {
      const response = await axios.post(crop_url, cropData);
      return response.data;
    } catch (error) {
      console.error('Error posting crop data:', error.message);
      throw error;
    }
  };

  const fetchCropsOnDb = async () => {
    try {
      const response = await axios.get(crop_ondb_url);
      return response.data;
    } catch (error) {
      console.error('Error fetching crops:', error.message);
      throw error;
    }
  };

  const fetchCropsPlanted = async () => {
    try {
      const response = await axios.get(crop_planted_url);
      return response.data;
    } catch (error) {
      console.error('Error fetching planted crops:', error.message);
      throw error;
    }
  };

  const updateCropToPlanted = async (cropName) => {
    try {
      const response = await axios.put(`${crop_url}/${cropName}/planted`);
      return response.data;
    } catch (error) {
      console.error('Error updating crop:', error.message);
      throw error;
    }
  };

  const handleSelectCrop = async (cropName) => {
    try {
      const plantedCrops = await fetchCropsPlanted();
      
      // Check if there are no crops or if none of the crops are planted
      if (!plantedCrops || plantedCrops.length === 0) {
        // No crops are planted, proceed to update the selected crop
        await updateCropToPlanted(cropName);
        alert('Success: Crop status updated to planted.');
      } else {
        // If there's at least one planted crop
        alert('Error: Another crop is already planted.');
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <ApiContext.Provider value={{ postFarmerData, postCropData, login, fetchCropsOnDb, fetchCropsPlanted, handleSelectCrop }}>
      {children}
    </ApiContext.Provider>
  );
};

export default MyComponent;
