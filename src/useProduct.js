import { useQuery } from 'react-query';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const fetchProducts = async () => {
  const userToken = await SecureStore.getItemAsync('userToken');
  const { data } = await axios.get('http://mspr.scholatech.com/api/products/', {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });
  console.log(data);
  return data;
};

export const useProduct = () => {
  return useQuery('stations', fetchProducts);
};
