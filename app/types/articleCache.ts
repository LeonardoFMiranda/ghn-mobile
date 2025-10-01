import type { Article } from "./news";

export type ArticlesCache = {
  [category: string]: {
    [page: number]: Article[];
  };
};

export interface CacheData {
    [category: string]: {
        [page: number]: Article[];
    };
}

export type ArticlesCacheContextType = {
  cache: ArticlesCache;
  setCache: React.Dispatch<React.SetStateAction<ArticlesCache>>;
};