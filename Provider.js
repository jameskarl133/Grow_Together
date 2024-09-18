import React, { createContext, useState } from 'react';
import axios from 'axios';

// Replace with your local IP address
const API_URL = 'http://192.168.1.7:8000/farmer';

export const ApiContext = createContext();

const MyComponent = ({ children }) => {
  const [farmer, setFarmer] = useState(null);

  const postFarmerData = async (farmerData) => {
    try {
      const response = await axios.post(API_URL, farmerData);
      console.log('Farmer data posted successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error posting farmer data:', error.message);
      console.log(error.response.data);
      throw error;
    }
  };

  return (
    <ApiContext.Provider value={{ postFarmerData }}>
      {children}
    </ApiContext.Provider>
  );
};

export default MyComponent;