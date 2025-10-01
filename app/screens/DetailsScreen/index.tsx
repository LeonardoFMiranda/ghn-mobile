import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    Image,
    Linking,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import type { Article } from '../../types/news';

const DetailsScreen: React.FC = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    
    const article: Article | null = params.article ? JSON.parse(params.article as string) : null;

    const handleOpenOriginal = async () => {
        if (article?.url) {
            try {
                await Linking.openURL(article.url);
            } catch (error) {
                Alert.alert('Erro', 'Não foi possível abrir o link');
            }
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    if (!article) {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.detailsContainer}>
                        <Text style={styles.detailsTitle}>Detalhes da Notícia</Text>
                        <View style={styles.detailsPlaceholder}>
                            <MaterialIcons name="article" size={64} color="#38bdf8" />
                            <Text style={styles.placeholderText}>Nenhuma notícia selecionada.</Text>
                            <TouchableOpacity style={styles.button} onPress={() => router.back()}>
                                <Text style={styles.buttonText}>Voltar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.detailsContainer}>
                    <Text style={styles.detailsTitle}>{article.title}</Text>
                    
                    <View style={styles.detailsMeta}>
                        <Text style={styles.newsSource}>{article.source.name}</Text>
                        <Text style={styles.newsDate}>{formatDate(article.publishedAt)}</Text>
                    </View>

                    {article.urlToImage && (
                        <Image
                            source={{ uri: article.urlToImage }}
                            style={styles.detailsImage}
                            resizeMode="cover"
                        />
                    )}

                    <Text style={styles.detailsDescription}>{article.description}</Text>
                    
                    {article.content && (
                        <Text style={styles.detailsContent}>{article.content}</Text>
                    )}

                    <View style={styles.detailsActions}>
                        <TouchableOpacity style={styles.button} onPress={handleOpenOriginal}>
                            <MaterialIcons name="open-in-new" size={16} color="#fff" style={styles.buttonIcon} />
                            <Text style={styles.buttonText}>Ver notícia original</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => router.back()}>
                            <MaterialIcons name="arrow-back" size={16} color="#d7263d" style={styles.buttonIcon} />
                            <Text style={[styles.buttonText, styles.secondaryButtonText]}>Voltar</Text>
                        </TouchableOpacity>
                    </View>
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
    scrollContainer: {
        padding: 16,
    },
    detailsContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 24,
        padding: 24,
        marginVertical: 16,
        shadowColor: '#0f172a',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 8,
    },
    detailsTitle: {
        fontSize: 24,
        color: '#fbbf24',
        marginBottom: 16,
        textAlign: 'center',
        fontWeight: '600',
        lineHeight: 32,
    },
    detailsMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    newsSource: {
        fontSize: 14,
        color: '#38bdf8',
        fontWeight: '600',
    },
    newsDate: {
        fontSize: 14,
        color: '#6b7280',
    },
    detailsImage: {
        width: '100%',
        height: 200,
        borderRadius: 18,
        marginVertical: 16,
    },
    detailsDescription: {
        fontSize: 16,
        color: '#374151',
        lineHeight: 24,
        marginBottom: 16,
        textAlign: 'justify',
    },
    detailsContent: {
        fontSize: 15,
        color: '#4b5563',
        lineHeight: 22,
        marginBottom: 24,
        textAlign: 'justify',
    },
    detailsPlaceholder: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    placeholderText: {
        color: '#38bdf8',
        fontSize: 18,
        marginTop: 16,
        marginBottom: 24,
        textAlign: 'center',
    },
    detailsActions: {
        flexDirection: 'column',
        gap: 12,
        marginTop: 16,
    },
    button: {
        backgroundColor: '#d7263d',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#d7263d',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#d7263d',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButtonText: {
        color: '#d7263d',
    },
    buttonIcon: {
        marginRight: 8,
    },
});

export default DetailsScreen;
