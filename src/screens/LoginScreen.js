import { useEffect, useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useAuthRequest } from 'expo-auth-session';
import { useMutation } from 'react-query';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';

WebBrowser.maybeCompleteAuthSession();

const config = {
  clientId: 'RXXQyHK94ST6UCcbFTOu1Nl6sXYxXs9W3KPuZGVN',
  scopes: ['openid', 'profile', 'email', 'read', 'write'],
  redirectUri: 'exp://localhost:19000/--/oauthredirect',
  clientSecret:
    'NKaKzFkHbgShuj6ekEEBgS5wQBgASdtxXZAOBxmSKURT1Ta68cLp8wfa9YFYnZ9p4tTl3Q3joUyDpU4Hm4Mb6OwFgjtwuWENfEcA5Y6SwBKFIf4ZgWvhxbOTk7PfPcuv',
  extraParams: {
    usePKCE: true,
  },
};

const discovery = {
  authorizationEndpoint: 'http://mspr.scholatech.com/o/authorize/',
  tokenEndpoint: 'http://mspr.scholatech.com/o/token/',
  revocationEndpoint: 'http://mspr.scholatech.com/o/revoke_token/',
};

export default function LoginScreen() {
  const navigation = useNavigation();
  const [request, response, promptAsync] = useAuthRequest(config, discovery);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const mutation = useMutation(async (data) => {
    const response = await fetch(discovery.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: Object.keys(data)
        .map(
          (key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`
        )
        .join('&'),
    });
    const result = await response.json();
    return result;
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { code, state } = response.params;
      const data = {
        grant_type: 'authorization_code',
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code: code,
        redirect_uri: config.redirectUri,
        state: state,
        code_verifier: request.codeVerifier,
      };
      mutation.mutate(data);
    }
  }, [response, request]);

  useEffect(() => {
    if (mutation.isSuccess) {
      console.log('Access token:', mutation.data.access_token);
      SecureStore.setItemAsync('userToken', mutation.data.access_token);
      navigation.navigate('HomeScreen');
      setIsAuthenticated(true);
    }
    if (mutation.isError) {
      Alert.alert('Error', 'Login failed'); // show an alert if login failed
    }
  }, [mutation.isSuccess]);

  const logout = async () => {
    const token = await SecureStore.getItemAsync('userToken');

    // Request to the server to revoke the token
    fetch(discovery.revocationEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `token=${token}&client_id=${config.clientId}&client_secret=${config.clientSecret}`,
    })
      .then((response) => {
        if (response.status === 200) {
          // If response is OK, remove the token from secure storage and set isAuthenticated to false
          SecureStore.deleteItemAsync('userToken');
          setIsAuthenticated(false);
        } else {
          // Handle failure case
          console.error('Failed to revoke token');
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <View style={styles.container}>
      {!isAuthenticated ? (
        <Button
          disabled={!request}
          title='Log In'
          onPress={() => {
            promptAsync();
          }}
        />
      ) : (
        <Button title='Log Out' onPress={logout} />
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
});
