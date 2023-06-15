import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import AuthScreen from './src/screens/AuthScreen';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthScreen />
    </QueryClientProvider>
  );
}
