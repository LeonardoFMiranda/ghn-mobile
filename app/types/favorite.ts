import type { Article } from "./news";

export type FavoritesContextType = {
  favorites: Article[];
  addFavorite: (article: Article) => void;
  removeFavorite: (url: string) => void;
};