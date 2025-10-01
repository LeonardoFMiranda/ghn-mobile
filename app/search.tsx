import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import BuscaScreen from './screens/BuscaScreen';

export default function SearchPage() {
  const { q } = useLocalSearchParams<{ q: string }>();
  
  return <BuscaScreen query={q} />;
}