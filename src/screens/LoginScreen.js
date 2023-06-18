import React, { useEffect } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import * as Linking from 'expo-linking';

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
  authorizationEndpoint: 'http://10.0.2.2:8000/o/authorize/',
  tokenEndpoint: 'http://10.0.2.2:8000/o/token/',
  revocationEndpoint: 'http://10.0.2.2:8000/o/revoke_token/',
};

function handleUrl({ url }) {
  let { path, queryParams } = Linking.parse(url);
  console.log(
    `Linked to app with path: ${path} and data: ${JSON.stringify(queryParams)}`
  );
}

export default function LoginScreen() {
  const [request, response, promptAsync] = useAuthRequest(config, discovery);

  useEffect(() => {
    Linking.addEventListener('url', handleUrl);
    return () => {
      Linking.removeEventListener('url', handleUrl);
    };
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      console.log('response', response);
      const { code } = response.params;
      Alert.alert('Authorization Code', code);
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Button
        disabled={!request}
        title='Log In'
        onPress={() => {
          promptAsync();
        }}
      />
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
