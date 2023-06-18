import React, { useState } from 'react';
import { Button, TextInput, View, StyleSheet } from 'react-native';
import { useMutation } from 'react-query';
import * as SecureStore from 'expo-secure-store';
import base64 from 'base-64';

const config = {
  clientId: 'KSdJitTUvXzt6EPGjDL7b2SPq9PjJ8G9PS4SvM3n',
  clientSecret:
    'NKaKzFkHbgShuj6ekEEBgS5wQBgASdtxXZAOBxmSKURT1Ta68cLp8wfa9YFYnZ9p4tTl3Q3joUyDpU4Hm4Mb6OwFgjtwuWENfEcA5Y6SwBKFIf4ZgWvhxbOTk7PfPcuv',
};

async function loginUser(credentials) {
  try {
    const response = await fetch('http://192.168.1.71:8000/o/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        Authorization: `Basic ${base64.encode(
          `${config.clientId}:${config.clientSecret}`
        )}`,
      },
      body: `grant_type=password&username=${credentials.username}&password=${credentials.password}`,
    });

    const data = await response.json();

    if (!response.ok) {
      console.log('Response data:', data); // log the response data
      throw new Error('Network response was not ok');
    }

    await SecureStore.setItemAsync('accessToken', data.access_token);

    return data;
  } catch (error) {
    throw new Error(`Fetch failed: ${error.message}`);
  }
}

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const mutation = useMutation(loginUser, {
    onError: (error) => {
      console.log('Error logging in:', error);
    },
    onSuccess: (data) => {
      console.log('Logged in successfully:', data);
    },
  });

  const handleLogin = () => {
    mutation.mutate({ username, password });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder='Username'
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder='Password'
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title='Log in' onPress={handleLogin} />
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
    marginBottom: 12,
    padding: 8,
  },
});