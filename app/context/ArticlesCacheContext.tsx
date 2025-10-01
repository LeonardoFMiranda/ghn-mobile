import React, { createContext, useContext, useState } from 'react';
import type { ArticlesCache, ArticlesCacheContextType } from '../types/articleCache';

const ArticlesCacheContext = createContext<ArticlesCacheContextType | undefined>(undefined);

export const ArticlesCacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cache, setCache] = useState<ArticlesCache>({});
    return (
        <ArticlesCacheContext.Provider value={{ cache, setCache }}>
            {children}
        </ArticlesCacheContext.Provider>
    );
};

export const useArticlesCache = () => {
    const context = useContext(ArticlesCacheContext);
    if (!context) throw new Error('Erro no Article Cache Context');
    return context;
};