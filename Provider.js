import React, { createContext, useState } from 'react';
import axios from 'axios';

// Replace with your local IP address
const API_URL = 'http://192.168.230.6:8000/farmer';
const crop_url = 'http://192.168.230.6:8000/crop';

export const ApiContext = createContext();

const MyComponent = ({ children }) => {
  const [farmer, setFarmer] = useState(null);

  const postFarmerData = async (farmerData) => {
    try {
      const response = await axios.post(API_URL, farmerData);
      console.log('Farmer data posted successfully', response.data);
      return response.data;
    } catch (error) {
      console.error('Error posting farmer data:', error.message);
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
      throw error;
    }
  };

  const postCropData = async (cropData) => {
    try {
      const response = await axios.post(crop_url, cropData);
      console.log('Crop data posted successfully', response.data);
      return response.data;
    } catch (error) {
      console.error('Error posting crop data', error.message);
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
      throw error;
    }
  };

  return (
    <ApiContext.Provider value={{ postFarmerData, postCropData }}>
      {children}
    </ApiContext.Provider>
  );
};

export default MyComponent;