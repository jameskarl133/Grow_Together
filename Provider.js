import React, { createContext, useState } from 'react';
import axios from 'axios';

// Replace with your local IP address
const API_URL = 'http://192.168.1.3:8000/farmer';
const crop_url = 'http://192.168.1.3:8000/crop';
const crop_ondb_url = 'http://192.168.1.3:8000/crop/ondb';
const crop_planted_url = 'http://192.168.1.3:8000/crop/planted';
const login_url = 'http://192.168.1.3:8000/farmer/login';

export const ApiContext = createContext();

const MyComponent = ({ children }) => {
  const [farmer, setFarmer] = useState(null);

  // const loginFarmer = async (username, password) => {
  //   try {
  //     const response = await axios.get(login_url, { username, password });
  //     console.log('Login successful:', response.data);
  //     setFarmer(response.data.farmer);
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error logging in:', error.message);
  //     console.log(error.response.data);
  //     console.log(error.response.status);
  //     console.log(error.response.headers);
  //     throw error;
  //   }
  // };

  const loginFarmer = async (username, password) => {
    try {
      const response = await axios.get(login_url, {
        params: { username, password }  
      });
      console.log('Login successful:', response.data);
      setFarmer(response.data.farmer);
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error.message);
      console.log(error.response?.data);
      console.log(error.response?.status);
      console.log(error.response?.headers);
      throw error;
    }
  };
//   const loginFarmer = async (username, password) => {
//     try {
//         const response = await axios.get(`${API_URL}/login`, {
//             params: {
//                 username_input,
//                 password_input,
//             },
//         });
//         console.log('Login successful:', response.data);
//         setFarmer(response.data.farmer);
//         return response.data;
//     } catch (error) {
//         console.error('Error logging in:', error.message);
//         throw error;
//     }
// };

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

  const fetchCropsOnDb = async () => {
    try {
      const response = await axios.get(crop_ondb_url);
      console.log('Crops fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching crops:', error.message);
      throw error;
    }
  }; //unggoy

  const fetchCropsPlanted = async () => {
    try {
      const response = await axios.get(crop_planted_url);
      console.log('Crops fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching crops:', error.message);
      throw error;
    }
  };
  return (
    <ApiContext.Provider value={{ postFarmerData, postCropData, fetchCropsOnDb, fetchCropsPlanted, loginFarmer}}>
      {children}
    </ApiContext.Provider>
  );
};

export default MyComponent;