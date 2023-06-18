import { useQuery } from 'react-query';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const fetchStations = async () => {
  const userToken = await SecureStore.getItemAsync('userToken');
  const { data } = await axios.get('http://10.0.2.2:8000/rest_api/stations/', {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });
  return data;
};

export const useStation = () => {
  return useQuery('stations', fetchStations);
};
