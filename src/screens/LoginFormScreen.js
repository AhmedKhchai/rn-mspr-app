import { useMutation } from 'react-query';
import axios from 'axios';
import { Alert, Button, StyleSheet, View, TextInput } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';

const login = async ({ email, password }) => {
  const response = await axios.post('http://mspr.scholatech.com/api/login', {
    email,
    password,
  });

  if (response.status !== 200) {
    throw new Error('Login failed');
  }

  return response.data;
};

const logout = async () => {
  const userToken = await SecureStore.getItemAsync('userToken');
  console.log('userToken:', userToken);
  const response = await axios.get('http://mspr.scholatech.com/api/logout', {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });
  console.log('response:', response);
  if (response.status !== 200) {
    throw new Error('Logout failed');
  }

  return response.data;
};

export default function LoginFormScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync('userToken')
      .then((token) => setIsAuthenticated(!!token))
      .catch(() => setIsAuthenticated(false));
  }, []);

  const loginMutation = useMutation(login, {
    onSuccess: (data) => {
      console.log('Access token:', data.access_token);
      SecureStore.setItemAsync('userToken', data.access_token).then(() =>
        setIsAuthenticated(true)
      );
      navigation.navigate('HomeScreen');
      console.log('Access token stored in SecureStore');
    },
    onError: (error) => {
      Alert.alert('Error', 'Login failed try again');
      console.error(error);
    },
  });

  const logoutMutation = useMutation(logout, {
    onSuccess: () => {
      SecureStore.deleteItemAsync('userToken').then(() =>
        setIsAuthenticated(false)
      );
      navigation.navigate('LoginScreen');
      console.log('Logged out');
    },
    onError: (error) => {
      Alert.alert('Error', 'Logout failed try again');
      console.error(error);
    },
  });

  const handleLogin = () => {
    loginMutation.mutate({ email, password });
  };

  const handleLogout = () => {
    // logoutMutation.mutate();
    setIsAuthenticated(false);
  };

  return (
    <View style={styles.container}>
      {isAuthenticated ? (
        <Button title='Logout' onPress={handleLogout} />
      ) : (
        <>
          <TextInput
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            placeholder='Email'
            keyboardType='email-address'
          />
          <TextInput
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            placeholder='Password'
            secureTextEntry
          />
          <Button title='Login' onPress={handleLogin} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
