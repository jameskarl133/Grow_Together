import React, { createContext, useState } from 'react';
import axios from 'axios';

<<<<<<< HEAD
const farmer_url = 'http://192.168.1.7:8000/farmer';
const crop_url = 'http://192.168.1.7:8000/crop';
const crop_ondb_url = 'http://192.168.1.7:8000/crop/ondb';
const crop_planted_url = 'http://192.168.1.7:8000/crop/planted';
const farmer_login_url = 'http://192.168.1.7:8000/farmer/login';
=======
// Replace with your local IP address
const API_URL = 'http://192.168.1.3:8000/farmer';
const crop_url = 'http://192.168.1.3:8000/crop';
const crop_ondb_url = 'http://192.168.1.3:8000/crop/ondb';
const crop_planted_url = 'http://192.168.1.3:8000/crop/planted';
const login_url = 'http://192.168.1.3:8000/farmer/login';
>>>>>>> 7cafb3e6d939d22c9608b8b9b9fa0eb54bea304f

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
<<<<<<< HEAD
      const response = await axios.get(farmer_login_url, { params: { username, password } });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Invalid username or password.');
      }
      throw new Error('Error logging in: ' + error.message);
=======
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
>>>>>>> 7cafb3e6d939d22c9608b8b9b9fa0eb54bea304f
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
<<<<<<< HEAD
    <ApiContext.Provider value={{ postFarmerData, postCropData, login, fetchCropsOnDb, handleSelectCrop }}>
=======
    <ApiContext.Provider value={{ postFarmerData, postCropData, fetchCropsOnDb, fetchCropsPlanted, loginFarmer}}>
>>>>>>> 7cafb3e6d939d22c9608b8b9b9fa0eb54bea304f
      {children}
    </ApiContext.Provider>
  );
};

export default MyComponent;
