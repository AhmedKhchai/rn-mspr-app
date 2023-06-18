import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import LoginScreen from './src/screens/LoginScreen';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LoginScreen />
    </QueryClientProvider>
  );
}
