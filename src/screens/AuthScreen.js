import React, { useState } from 'react';
import { StyleSheet, Button, TextInput, Alert, View, Text } from 'react-native';
import * as Keychain from 'react-native-keychain';
import { useMutation } from 'react-query';
import axios from 'axios';

const login = (email, password) => {
  const payload = {
    email: email,
    password: password,
  };
  console.log('payload', payload);
  return axios.post('http://mspr.scholatech.com/api/login', {
    data: payload,
  });
};

const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const mutation = useMutation(login, {
    onSuccess: async (data) => {
      await Keychain.setGenericPassword('token', data.data.access_token);
      Alert.alert('Logged in!');
    },
    onError: () => {
      Alert.alert(
        'Cananot log in',
        'Please check your credentials and try again'
      );
    },
  });
  const handleLogin = async () => {
    try {
      console.log(`Email: ${email}, Password: ${password}`);
      const response = await login(email, password);
      const accessToken = response.data.access_token;
      await Keychain.setGenericPassword(email, accessToken);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder='Email'
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder='Password'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title='Log in' onPress={handleLogin} />
      {mutation.isLoading && <Text>Loading...</Text>}
    </View>
  );
};

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

export default AuthScreen;
