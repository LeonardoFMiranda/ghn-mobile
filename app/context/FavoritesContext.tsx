import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { FavoritesContextType } from '../types/favorite';
import type { Article } from '../types/news';

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Article[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem('favorites');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Erro ao carregar favoritos:', error);
    }
  };

  const addFavorite = async (article: Article) => {
    if (!favorites.find(fav => fav.url === article.url)) {
      const updated = [...favorites, article];
      setFavorites(updated);
      try {
        await AsyncStorage.setItem('favorites', JSON.stringify(updated));
      } catch (error) {
        console.log('Erro ao salvar favorito:', error);
      }
    }
  };

  const removeFavorite = async (url: string) => {
    const updated = favorites.filter(fav => fav.url !== url);
    setFavorites(updated);
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(updated));
    } catch (error) {
      console.log('Erro ao remover favorito:', error);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('Erro no Favorites Context');
  return context;
};