import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { QueryClient, QueryClientProvider } from 'react-query';
import LoginFormScreen from './src/screens/LoginFormScreen';
import HomeScreen from './src/screens/HomeScreen'; // import your HomeScreen component here

const Stack = createStackNavigator();
const queryClient = new QueryClient();

function AppStack() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginFormScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <AppStack />
      </NavigationContainer>
    </QueryClientProvider>
  );
}