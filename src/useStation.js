import { useEffect, useState } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const useStation = () => {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const userToken = await SecureStore.getItemAsync('userToken');
        const response = await axios.get(
          'http://10.0.2.2:8000/rest_api/stations/',
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        console.log('stations', response.data);
        setStations(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchStations();
  }, []);

  return stations;
};
