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
import ErrorMsg from '../../components/ErrorMsg';
import MainNewsGrid from '../../components/MainNewsGrid/MainNewsGrid';
import NewsListVertical from '../../components/NewsListVertical/NewsListVertical';
import { useArticlesCache } from '../../context/ArticlesCacheContext';
import { useFavorites } from '../../context/FavoritesContext';
import type { Article } from '../../types/news';
import { CacheData } from '@/app/types/articleCache';

const API_URL = 'https://newsapi.org/v2/everything';
const API_KEY = '6c1a3cbf3e084ceea7ea877bf1cc921d';
const PAGE_SIZE = 10;

const categories = [
    { label: 'Tudo', value: 'notícias' },
];

const MAIN_SEARCHES = [
    "trump",
    "brasil",
    "onu"
];



const HomeScreen: React.FC = () => {
    const router = useRouter();
    const [articles, setArticles] = useState<Article[]>([]);
    const [firstLoad, setFirstLoad] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showErrorMsg, setShowErrorMsg] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [page, setPage] = useState(1);
    const [isSearching] = useState(false);
    const [category] = useState(categories[0].value);
    const [mainArticles, setMainArticles] = useState<Article[]>([]);
    const [mainSearchType] = useState(() => Math.floor(Math.random() * 3));
    const { favorites, addFavorite, removeFavorite } = useFavorites();

    const isFavorite = (url: string) => favorites.some(fav => fav.url === url);
    const { cache, setCache } = useArticlesCache();
    const [hasMorePages, setHasMorePages] = useState(true);

    const fetchArticles = async (currentPage: number, selectedCategory: string) => {
        setLoading(true);
        try {

            if (cache[selectedCategory]?.[currentPage]) {
                const cachedArticles = cache[selectedCategory][currentPage];
                if (currentPage === 1) {
                    setArticles(cachedArticles);
                } else {
                    setArticles(prev => [...prev, ...cachedArticles]);
                }
                setLoading(false);
                return;
            } else {
                console.log(cache, 'usando cache');
                const response = await fetch(
                    `${API_URL}?q=${selectedCategory}&pageSize=${PAGE_SIZE}&page=${currentPage}&language=pt&apiKey=${API_KEY}`
                );
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Erro ao buscar notícias');
                }

                const newArticles = data.articles || [];

                if (newArticles.length < PAGE_SIZE) {
                    setHasMorePages(false);
                }

                setCache((prev: CacheData) => ({
                    ...prev,
                    [selectedCategory]: {
                        ...(prev[selectedCategory] || {}),
                        [currentPage]: newArticles,
                    }
                }));

                if (currentPage === 1) {
                    setArticles(newArticles);
                    setHasMorePages(true);
                } else {
                    setArticles(prev => [...prev, ...newArticles]);
                }
            }
        } catch (err) {
            if (articles.length === 0) {
                setError('Erro ao buscar notícias.');
            } else {
                setErrorMessage('Não foi possível carregar mais notícias. Tente novamente.');
                setShowErrorMsg(true);
            }
            console.log('Erro ao buscar artigos:', err);
        } finally {
            setLoading(false);
            setFirstLoad(false);
        }
    };

    useEffect(() => {
        const fetchMainArticles = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `${API_URL}?q=${MAIN_SEARCHES[mainSearchType]}&pageSize=3&language=pt&apiKey=${API_KEY}`
                );
                const data = await response.json();

                if (response.ok) {
                    setMainArticles(data.articles || []);
                } else {
                    setMainArticles([]);
                }
            } catch (error) {
                console.log('Erro ao buscar artigos principais:', error);
                setMainArticles([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMainArticles();
    }, [mainSearchType]);

    useEffect(() => {
        fetchArticles(page, category);
    }, [page, category]);

    useEffect(() => {
        setPage(1);
    }, [category]);

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

    const handleFavoriteToggle = (article: Article) => {
        if (isFavorite(article.url)) {
            removeFavorite(article.url);
        } else {
            addFavorite(article);
        }
    };

    if (loading && firstLoad) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>Carregando notícias...</Text>
                </View>
            </SafeAreaView>
        );
    }

    const listArticles = articles.slice(3);

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
                <View style={styles.feedContainer}>
                    <MainNewsGrid
                        articles={mainArticles}
                        isFavorite={(url: string) => isFavorite(url)}
                        onFavoriteToggle={handleFavoriteToggle}
                    />
                    <Text style={styles.feedTitle}>Mais Notícias</Text>
                    <NewsListVertical
                        articles={listArticles}
                        isFavorite={isFavorite}
                        addFavorite={addFavorite}
                        removeFavorite={removeFavorite}
                        startIndex={3}
                    />
                    {(error && category !== 'favorites') ? (
                        <View style={styles.newsListPlaceholder}>
                            <View style={{ alignItems: 'center', marginVertical: 32 }}>
                                <Text style={styles.errorIcon}>�</Text>
                                <Text style={{
                                    color: '#888',
                                    marginTop: 16,
                                    fontSize: 18,
                                    textAlign: 'center',
                                    lineHeight: 24
                                }}>
                                    Nenhuma notícia encontrada.{'\n'}
                                    O macaquinho está trabalhando triste...
                                </Text>
                            </View>
                        </View>
                    ) : (
                        <>

                        </>
                    )}

                    {loading && !firstLoad && (
                        <View style={styles.loadingMore}>
                            <ActivityIndicator size="small" color="#007AFF" />
                            <Text style={styles.loadingMoreText}>Carregando mais...</Text>
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
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        marginTop: 50,
    },
    errorIcon: {
        fontSize: 80,
        marginBottom: 16,
        opacity: 0.6,
    },
    errorText: {
        color: '#888',
        fontSize: 18,
        textAlign: 'center',
        lineHeight: 24,
    },
    loadingMore: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingMoreText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666',
    },

    feedContainer: {
        maxWidth: 1100,
        marginTop: 40,
        marginBottom: 40,
        marginHorizontal: 'auto',
        paddingHorizontal: 24,
        paddingBottom: 40,
        borderRadius: 16,
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
    feedFilters: {
        marginBottom: 24,
        gap: 12,
    },
    feedNavContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 24,
        flexWrap: 'wrap',
    },
    feedSearch: {
        flex: 1,
        padding: 12,
        paddingHorizontal: 18,
        fontSize: 16,
        borderWidth: 1.5,
        borderColor: '#d7263d',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    feedCategoryContainer: {
        flexDirection: 'row',
        gap: 10,
        flexWrap: 'wrap',
    },
    feedCategoryButton: {
        backgroundColor: '#f4f4f4',
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 18,
        marginRight: 8,
        marginBottom: 8,
    },
    feedCategoryButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    activeCategory: {
        backgroundColor: '#d7263d',
    },
    activeCategoryText: {
        color: '#fff',
        fontWeight: '700',
    },
    newsList: {
        gap: 28,
    },
    newsListItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
        overflow: 'hidden',
        minHeight: 120,
    },
    newsListItemColumn: {
        flexDirection: 'column',
    },
    newsListImageWrap: {
        position: 'relative',
        flex: 1,
        maxWidth: '33.33%',
        minWidth: 120,
        backgroundColor: '#f4f4f4',
        justifyContent: 'center',
        alignItems: 'center',
    },
    newsListImageWrapFull: {
        maxWidth: '100%',
        minHeight: 160,
    },
    newsListImage: {
        width: '100%',
        height: '100%',
        minHeight: 120,
    },
    newsListContent: {
        flex: 2,
        padding: 18,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    newsListContentColumn: {
        padding: 14,
        paddingHorizontal: 12,
    },
    newsTitle: {
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 6,
        color: '#222',
    },
    newsMeta: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 6,
    },
    newsSource: {
        fontSize: 15,
        fontWeight: '600',
        color: '#d7263d',
    },
    newsDate: {
        fontSize: 15,
        color: '#555',
    },
    newsDescription: {
        fontSize: 16,
        color: '#444',
        lineHeight: 22,
        marginBottom: 0,
    },
    newsActions: {
        marginTop: 12,
        alignItems: 'flex-end',
    },
    newsLink: {
        backgroundColor: '#d7263d',
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 18,
    },
    newsLinkText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    newsListPlaceholder: {
        textAlign: 'center',
        color: '#d7263d',
        fontSize: 18,
        paddingVertical: 24,
        fontWeight: '600',
    },
    mainNewsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 24,
        marginBottom: 32,
        minHeight: 340,
    },
    mainNewsCard: {
        position: 'relative',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 12,
        minHeight: 240,
        justifyContent: 'flex-end',
        backgroundColor: '#222',
    },
    mainNewsCardLarge: {
        width: '60%',
    },
    mainNewsCardSmall: {
        width: '35%',
    },
    mainNewsImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
    },
    mainNewsContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 2,
        paddingVertical: 24,
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
    },
    mainNewsTitle: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
        color: '#fff',
        lineHeight: 24,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
    mainNewsMeta: {
        fontSize: 15,
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
    mainNewsSource: {
        fontWeight: '600',
        color: '#ffd600',
    },
    mainNewsDate: {
        color: '#eee',
    },
    mainNewsDescription: {
        marginTop: 10,
        color: '#f4f4f4',
        fontSize: 16,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
        maxHeight: 44,
    },
    favStar: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'transparent',
        fontSize: 20,
        color: '#fbbf24',
        zIndex: 2,
    },
    favStarActive: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'transparent',
        fontSize: 20,
        color: '#ffd600',
        zIndex: 2,
    },
    favStarMain: {
        position: 'absolute',
        top: -10,
        right: -15,
        backgroundColor: 'transparent',
        fontSize: 20,
        color: '#fff',
        zIndex: 2,
        textShadowColor: 'rgba(0, 0, 0, 0.6)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
    favStarMainActive: {
        color: '#ffd600',
    },
});

export default HomeScreen;