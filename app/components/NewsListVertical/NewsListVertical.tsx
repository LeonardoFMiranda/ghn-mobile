import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Article } from '../../types/news';

const { width: screenWidth } = Dimensions.get('window');

interface NewsListVerticalProps {
    articles: Article[];
    isFavorite: (url: string) => boolean;
    addFavorite: (article: Article) => void;
    removeFavorite: (url: string) => void;
    startIndex?: number;
}

const NewsListVertical: React.FC<NewsListVerticalProps> = ({
    articles,
    isFavorite,
    addFavorite,
    removeFavorite,
    startIndex = 0,
}) => {
    const router = useRouter();

    const openArticle = (article: Article) => {
        router.push({
            pathname: '/details',
            params: {
                article: JSON.stringify(article)
            }
        });
    };

    const handleFavoriteToggle = (article: Article) => {
        if (isFavorite(article.url)) {
            removeFavorite(article.url);
        } else {
            addFavorite(article);
        }
    };

    const renderArticleItem = (article: Article, index: number) => (
        <TouchableOpacity
            key={`${article.url}-${index}`}
            style={styles.newsListItem}
            onPress={() => openArticle(article)}
            activeOpacity={0.95}
        >
            {/* Container da imagem */}
            <View style={styles.newsListImageWrap}>
                {article.urlToImage ? (
                    <Image
                        source={{ uri: article.urlToImage }}
                        style={styles.newsListImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.placeholderContainer}>
                        <Text style={styles.placeholderIcon}>📰</Text>
                    </View>
                )}
                
                {/* Botão de favorito */}
                <TouchableOpacity
                    style={styles.favStar}
                    onPress={(e) => {
                        e.stopPropagation();
                        handleFavoriteToggle(article);
                    }}
                    activeOpacity={0.7}
                >
                    <MaterialIcons 
                        name={isFavorite(article.url) ? "star" : "star-border"} 
                        size={24} 
                        color={isFavorite(article.url) ? "#ffd600" : "#8A8A8A"} 
                    />
                </TouchableOpacity>
            </View>

            {/* Container do conteúdo */}
            <View style={styles.newsListContent}>
                <Text style={styles.newsTitle} numberOfLines={2}>
                    {article.title}
                </Text>

                <View style={styles.newsMeta}>
                    <Text style={styles.newsSource}>
                        {article.source.name}
                    </Text>
                    <Text style={styles.newsDate}>
                        {new Date(article.publishedAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short'
                        })}
                    </Text>
                </View>

                {article.description && (
                    <Text style={styles.newsDescription} numberOfLines={3}>
                        {article.description}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.newsList}>
                {articles.map((article, idx) =>
                    renderArticleItem(article, idx)
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    newsListTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#d7263d',
        marginBottom: 16,
        paddingLeft: 4,
        borderLeftWidth: 6,
        borderLeftColor: '#d7263d',
    },
    newsList: {
        gap: 28,
    },
    newsListItem: {
        flexDirection: screenWidth > 900 ? 'row' : 'column',
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.10,
        shadowRadius: 12,
        elevation: 8,
        overflow: 'hidden',
        minHeight: 120,
    },
    newsListImageWrap: {
        position: 'relative',
        backgroundColor: '#f4f4f4',
        justifyContent: 'center',
        alignItems: 'center',
    },
    newsListImage: {
        width: '100%',
        height: 160,
        minHeight: 160,
    },
    placeholderContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f4f4',
    },
    placeholderIcon: {
        fontSize: 32,
        opacity: 0.5,
    },
    favStar: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 2,
        borderRadius: 15,
        padding: 4,
        elevation: 3,
    },
    newsListContent: {
        flex: screenWidth > 900 ? 2 : 1,
        padding: screenWidth > 900 ? 18 : 14,
        paddingHorizontal: 12,
        justifyContent: 'center',
    },
    newsTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 6,
        color: '#222',
        lineHeight: 22,
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
        lineHeight: 24,
        marginBottom: 0,
    },
});

export default NewsListVertical;
