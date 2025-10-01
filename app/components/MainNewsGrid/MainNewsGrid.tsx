import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Article } from '../../types/news';
import { ImageBackground } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

interface MainNewsGridProps {
  articles: Article[];
  isFavorite: (url: string) => boolean;
  onFavoriteToggle: (article: Article) => void;
}

export default function MainNewsGrid({ articles, isFavorite, onFavoriteToggle }: MainNewsGridProps) {
  const router = useRouter();

  const openArticleDetails = (article: Article) => {
    router.push({
      pathname: '/details',
      params: {
        article: JSON.stringify(article)
      }
    });
  };
  if (!articles.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando notícias principais...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
     <View style={styles.grid}>
        {articles.map((article, index) => (
          <TouchableOpacity
            key={`${article.url}-${index}`}
            style={[
              styles.gridItem,
              index === 0 ? styles.mainItem : styles.secondaryItem
            ]}
            onPress={() => openArticleDetails(article)}
          >
            {article.urlToImage && (
              <ImageBackground
                source={{ uri: article.urlToImage }}
                style={styles.image}
                imageStyle={{ borderRadius: 8 }}
              >
                <View style={styles.content}>
                  <Text
                    style={[
                      styles.title,
                      index === 0 ? styles.mainTitle : styles.secondaryTitle
                    ]}
                    numberOfLines={index === 0 ? 3 : 2}
                  >
                    {article.title}
                  </Text>
                  <View style={styles.newsMeta}>
                    <Text style={styles.source}>
                      {article.source.name}
                    </Text>
                    <Text style={styles.date}>
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </Text>
                  </View>
                  {index === 0 && <Text style={styles.description}>{article.description}</Text>}
                </View>
              </ImageBackground>
            )}

            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => onFavoriteToggle(article)}
            >
              <Text style={[
                styles.favoriteIcon,
                { color: isFavorite(article.url) ? '#fff200' : '#999' }
              ]}>
                {isFavorite(article.url) ? <MaterialIcons name="star" size={20} color="#fff200" /> : <MaterialIcons name="star-border" size={20} color="#999" />}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  grid: {
    gap: 12,
  },
  gridItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
  },
  mainItem: {
    width: '100%',
    height: 200,
  },
  secondaryItem: {
    width: '100%',
    height: 160,
  },
  image: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 12,
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: 'flex-end',
  },
  newsMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  
  },
  title: {
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: 4,
    color: '#fff',
  },
  mainTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 22,
    marginTop: 8,
  },
  secondaryTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 22,
  },
  source: {
    fontSize: 12,
    color: '#ffd600',
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    color: '#fff',
  },
  description: {
    marginTop: 10,
    fontSize: 14,
    color: '#fff',
    maxHeight: 60,
    overflow: 'hidden',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});