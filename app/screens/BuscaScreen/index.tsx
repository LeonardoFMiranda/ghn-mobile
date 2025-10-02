import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import NewsListVertical from '@/app/components/NewsListVertical/NewsListVertical';
import { useArticlesCache } from '@/app/context/ArticlesCacheContext';
import { CacheData } from '@/app/types/articleCache';
import { Image } from 'expo-image';
import ErrorMsg from '../../components/ErrorMsg';
import MainNewsGrid from '../../components/MainNewsGrid/MainNewsGrid';
import { useFavorites } from '../../context/FavoritesContext';
import type { Article } from '../../types/news';

const API_URL = 'https://newsapi.org/v2/everything';
const API_KEY = process.env.EXPO_PUBLIC_API_URL;
const PAGE_SIZE = 20;

interface BuscaScreenProps {
    query?: string;
}

const BuscaScreen: React.FC<BuscaScreenProps> = ({ query }) => {
    const router = useRouter();
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [firstLoad, setFirstLoad] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const { favorites, addFavorite, removeFavorite } = useFavorites();

    const isFavorite = (url: string) => favorites.some(fav => fav.url === url);
    const [isSearching] = useState(false);
    const [page, setPage] = useState(1);
    const [currentQuery, setCurrentQuery] = useState(query || '');
    const [hasMorePages, setHasMorePages] = useState(true);
    const [showErrorMsg, setShowErrorMsg] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { cache, setCache } = useArticlesCache();

    const handleFavoriteToggle = (article: Article) => {
        if (isFavorite(article.url)) {
            removeFavorite(article.url);
        } else {
            addFavorite(article);
        }
    };

    const fetchArticles = async (currentPage: number, searchQuery: string) => {
        if (cache[searchQuery]?.[currentPage]) {
            const cachedArticles = cache[searchQuery][currentPage];
            if (currentPage === 1) {
                setArticles(cachedArticles);
            } else {
                setArticles(prev => [...prev, ...cachedArticles]);
            }
            setLoading(false);
            setFirstLoad(false);
            return;
        } else {
            setLoadingMore(true);
        }

        try {
            if (searchQuery === 'favoritos') {
                setArticles(favorites);
                setHasMorePages(false);
                setLoading(false);
                setLoadingMore(false);
                setFirstLoad(false);
                return;
            }

            const response = await fetch(
                `${API_URL}?q=${encodeURIComponent(searchQuery)}&language=pt&apiKey=${API_KEY}&pageSize=${PAGE_SIZE}&page=${currentPage}`
            );

            if (!response.ok) {
                throw new Error('Erro ao buscar notícias');
            }

            const data = await response.json();
            // const filtered = (data.articles || []).filter(
            //     (art: Article) => !art.url?.includes('kk.org')
            // );

            if (data.articles && data.articles.length < PAGE_SIZE) {
                setHasMorePages(false);
            }

            console.log('Artigos buscados:', data.articles);

            setCache((prev: CacheData) => ({
                ...prev,
                [searchQuery]: {
                    ...(prev[searchQuery] || {}),
                    [currentPage]: data.articles,
                }
            }));

            if (currentPage === 1) {
                setArticles(data.articles);
            } else {
                setArticles(prevArticles => [...prevArticles, ...data.articles]);
            }
        } catch (error) {
            console.log('Erro ao buscar artigos:', error);

            if (articles.length > 0) {
                setErrorMessage('Não foi possível carregar mais notícias. Tente novamente.');
                setShowErrorMsg(true);
            } else {
                setErrorMessage('Não foi possível carregar mais notícias. Tente novamente.');
                setShowErrorMsg(true);
                setArticles([]);
            }
        } finally {
            setLoading(false);
            setLoadingMore(false);
            setFirstLoad(false);
            console.log(hasMorePages, ' - ', articles.length, ' - ', currentPage, ' - ', searchQuery);
        }
    };

    useEffect(() => {
        if (!currentQuery) return;

        setArticles([]);
        setPage(1);
        setHasMorePages(true);
        fetchArticles(1, currentQuery);
    }, [currentQuery]);

    useEffect(() => {
        if (!currentQuery || page === 1) return;
        fetchArticles(page, currentQuery);
    }, [page]);

    useEffect(() => {
        if (query !== currentQuery) {
            setCurrentQuery(query || '');
        }
    }, [query]);

    const handleLoadMore = () => {
        if (!isSearching && !loading && hasMorePages) {
            setPage(prev => prev + 1);
        }
    };

    const handleScroll = (event: any) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const paddingToBottom = 200;

        if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
            handleLoadMore();
        }
    };

    

    const mainArticles = articles.slice(0, 3);
    const listArticles = articles.slice(3);
    console.log('Artigos:', articles.length);
    console.log('Categoria de busca:', currentQuery);

    if (loading && firstLoad) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#d7263d" />
                    <Text style={styles.loadingText}>
                        {currentQuery === 'favoritos' ? 'Carregando favoritos...' : 'Buscando notícias...'}
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ErrorMsg
                message={errorMessage}
                visible={showErrorMsg}
                onDismiss={() => setShowErrorMsg(false)}
            />
            <ScrollView
                style={styles.scrollView}
                onScroll={handleScroll}
                scrollEventThrottle={400}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            {currentQuery === 'favoritos' ? 'Notícias Favoritas' : 'Resultados para: '}<Text style={styles.highlight}>{currentQuery === 'favoritos' ? '' : `"${currentQuery}"`}</Text>
                        </Text>
                    </View>

                    {!loading && articles.length === 0 ? (
                        <View style={styles.noResultsContainer}>
                            <Image
                                source={require('../../assets/images/notFound.png')}
                                style={styles.noResultsImage}
                            />
                            <Text style={styles.noResultsText}>
                                Nenhuma notícia encontrada.{'\n'}
                                O macaquinho está trabalhando triste...
                            </Text>
                        </View>
                    ) : (
                        <>

                            {mainArticles.length > 0 && (
                                <MainNewsGrid
                                    articles={mainArticles}
                                    isFavorite={(url: string) => isFavorite(url)}
                                    onFavoriteToggle={handleFavoriteToggle}
                                />
                            )}

                            
                            {listArticles.length > 0 && (
                                <>
                                    <Text style={styles.feedTitle}>Mais Notícias</Text>
                                    <NewsListVertical
                                        articles={listArticles.slice(3)}
                                        isFavorite={isFavorite}
                                        addFavorite={addFavorite}
                                        removeFavorite={removeFavorite}
                                        startIndex={3}
                                    />
                                </>
                            )}
                        </>
                    )}

                    {loadingMore && (
                        <View style={styles.loadingMore}>
                            <ActivityIndicator size="small" color="#d7263d" />
                            <Text style={styles.loadingMoreText}>Carregando mais resultados...</Text>
                        </View>
                    )}

                    {!hasMorePages && articles.length > 0 && currentQuery !== 'favoritos' && (
                        <View style={styles.endMessage}>
                            <Text style={styles.endMessageText}>
                                🎉 Você chegou ao final! Todas as notícias foram carregadas.
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        maxWidth: 900,
        marginHorizontal: 'auto',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 24,
        margin: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    header: {
        marginBottom: 24,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 8,
        color: '#333',
    },
    highlight: {
        color: '#d7263d',
    },
    resultCount: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    noResultsContainer: {
        alignItems: 'center',
        paddingTop: 10,
        paddingVertical: 60,
    },
    noResultsIcon: {
        fontSize: 80,
        marginBottom: 16,
        opacity: 0.6,
    },
    noResultsText: {
        color: '#888',
        fontSize: 18,
        textAlign: 'center',
        lineHeight: 24,
        marginTop: 16,
    },
    loadingMore: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
        marginTop: 20,
    },
    loadingMoreText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666',
    },

    verticalList: {
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 16,
        color: '#333',
        paddingLeft: 4,
    },
    list: {
        paddingVertical: 8,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 16,
        position: 'relative',
    },
    imageWrap: {
        width: 120,
        height: 80,
        backgroundColor: '#f4f4f4',
        borderRadius: 8,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    icon: {
        fontSize: 32,
        color: '#d7263d',
    },
    itemContent: {
        flex: 1,
        paddingRight: 40,
    },
    link: {
        color: '#d7263d',
        fontWeight: '600',
        fontSize: 16,
        marginBottom: 6,
        lineHeight: 20,
    },
    metaContainer: {
        marginBottom: 6,
    },
    meta: {
        color: '#555',
        fontSize: 12,
    },
    desc: {
        color: '#444',
        fontSize: 14,
        lineHeight: 18,
    },
    favoriteButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 8,
    },
    favoriteIcon: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    endMessage: {
        alignItems: 'center',
        paddingVertical: 30,
        paddingHorizontal: 20,
        marginTop: 20,
    },
    endMessageText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
    },

    feedTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#d7263d',
        marginVertical: 16,
        letterSpacing: -1,
        textAlign: 'left',
        borderLeftWidth: 6,
        borderLeftColor: '#d7263d',
        paddingLeft: 12,
    },
    noResultsImage: {
        width: 300,
        height: 200,
        alignSelf: 'center'
    },
});

export default BuscaScreen;