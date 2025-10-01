import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

const menuCategories = [
    { label: 'Inicio', value: 'inicio', color: '#19a7d2ff' },
    { label: 'Tecnologia', value: 'tecnologia', color: '#1976d2' },
    { label: 'Negócios', value: 'negócios', color: '#388e3c' },
    { label: 'Esportes', value: 'esportes', color: '#fbc02d' },
    { label: 'Saúde', value: 'saúde', color: '#d7263d' },
    { label: 'Ciência', value: 'ciência', color: '#7b1fa2' },
    { label: 'Entretenimento', value: 'entretenimento', color: '#ff7043' },
    { label: 'Viagens', value: 'viagens', color: '#0288d1' },
    { label: 'Gastronomia', value: 'gastronomia', color: '#8d6e63' },
    { label: 'Educação', value: 'education', color: '#388e3c' },
    { label: 'Programação', value: 'programação', color: '#455a64' },
    { label: 'Investimentos', value: 'investimentos', color: '#c2185b' },
    { label: 'Sustentabilidade', value: 'sustentabilidade', color: '#43a047' },
    { label: 'Lifestyle', value: 'lifestyle', color: '#f06292' },
    { label: 'Favoritos', value: 'favoritos', color: '#f8e801' }
];

const categories = [
    { label: 'Tecnologia', value: 'tecnologia' },
    { label: 'Negócios', value: 'negócios' },
    { label: 'Esportes', value: 'esportes' },
    { label: 'Saúde', value: 'saúde' },
    { label: 'Ciência', value: 'ciência' },
    { label: 'Favoritos', value: 'favoritos' }
];

interface HeaderProps {
    onSearch?: (query: string) => void;
    onCategorySelect?: (category: string) => void;
    currentCategory?: string;
}

const Header: React.FC<HeaderProps> = ({
    onSearch,
    onCategorySelect,
    currentCategory = categories[0].value
}) => {
    const [search, setSearch] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchVisible, setSearchVisible] = useState(false);
    const [category, setCategory] = useState(currentCategory);

    const handleSearch = () => {
        if (search.trim()) {
            // Navegação para página de busca
            router.push(`/search?q=${encodeURIComponent(search.trim())}`);
            setSearch('');
            setSearchVisible(false);
        }
        // Callback opcional para componente pai
        if (search.trim() && onSearch) {
            onSearch(search.trim());
        }
    };

    const handleCategorySelect = (selectedCategory: string) => {
        setCategory(selectedCategory);

        if (selectedCategory === 'inicio') {
            // Navegação para a página inicial
            router.push(`/`);
            setSidebarOpen(false);
        } else {
            // Navegação para página de busca por categoria
            router.push(`/search?q=${encodeURIComponent(selectedCategory)}`);

            // Callback opcional para componente pai
            if (onCategorySelect) {
                onCategorySelect(selectedCategory);
            }
            setSidebarOpen(false);
        }
    };

    const renderCategoryItem = ({ item }: { item: typeof menuCategories[0] }) => (
        <TouchableOpacity
            style={[styles.sidebarItem, { borderLeftColor: item.color }]}
            onPress={() => handleCategorySelect(item.value)}
        >
            <Text style={styles.sidebarItemText}>{item.label}</Text>
        </TouchableOpacity>
    );

    const SearchIcon = () => (
        <Text style={styles.searchIcon}>🔍</Text>
    );

    return (
        <View style={styles.header}>
            <View style={styles.navBar}>
                {/* Menu Icon */}
                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => setSidebarOpen(true)}
                >
                    <View style={styles.menuIcon}>
                        <View style={styles.menuIconLine} />
                        <View style={styles.menuIconLine} />
                        <View style={styles.menuIconLine} />
                    </View>
                </TouchableOpacity>

                {/* Logo */}
                <Text style={styles.navLogo}>GHN</Text>

                {/* Categories - Desktop */}
                {width > 600 && (
                    <ScrollView
                        horizontal
                        style={styles.headerCategories}
                        showsHorizontalScrollIndicator={false}
                    >
                        {categories.map((cat, idx) => {
                            const isActive = category === cat.value;
                            return (
                                <TouchableOpacity
                                    key={idx}
                                    style={[
                                        styles.headerCategoryButton,
                                        isActive && styles.activeCategory
                                    ]}
                                    onPress={() => handleCategorySelect(cat.value)}
                                >
                                    <Text style={[
                                        styles.headerCategoryButtonText,
                                        isActive && styles.activeCategoryText
                                    ]}>
                                        {cat.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                )}

                {/* Search Container */}
                <View style={styles.searchContainer}>
                    {!searchVisible ? (
                        <TouchableOpacity
                            style={styles.navSearchButton}
                            onPress={() => setSearchVisible(true)}
                        >
                            <SearchIcon />
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.searchInputContainer}>
                            <TextInput
                                style={styles.navSearchInput}
                                placeholder="Busca detalhada..."
                                placeholderTextColor="#999"
                                value={search}
                                onChangeText={setSearch}
                                onSubmitEditing={handleSearch}
                                onBlur={() => !search && setSearchVisible(false)}
                                autoFocus={true}
                                returnKeyType="search"
                            />
                            <TouchableOpacity onPress={handleSearch}>
                                <SearchIcon />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>

            {/* Sidebar Modal */}
            <Modal
                visible={sidebarOpen}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setSidebarOpen(false)}
            >
                <TouchableOpacity
                    style={styles.sidebarOverlay}
                    activeOpacity={1}
                    onPress={() => setSidebarOpen(false)}
                >
                    <View style={styles.sidebar}>
                        <TouchableOpacity
                            style={styles.closeSidebar}
                            onPress={() => setSidebarOpen(false)}
                        >
                            <Text style={styles.closeSidebarText}>×</Text>
                        </TouchableOpacity>

                        <FlatList
                            data={menuCategories}
                            renderItem={renderCategoryItem}
                            keyExtractor={(item) => item.value}
                            style={styles.sidebarList}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingTop: 40,
        backgroundColor: '#000',
        paddingVertical: 8,
        borderBottomWidth: 2,
        borderBottomColor: 'rgba(215, 38, 61, 0.1)',
        shadowColor: 'rgba(215, 38, 61, 0.2)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 16,
        elevation: 8,
    },
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 64,
        paddingHorizontal: 12,
    },
    menuButton: {
        padding: 8,
        zIndex: 102,
    },
    menuIcon: {
        width: 28,
        height: 22,
        justifyContent: 'space-between',
    },
    menuIconLine: {
        height: 4,
        backgroundColor: '#fff',
        borderRadius: 2,
    },
    navLogo: {
        fontSize: 28,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 2,
        flex: 1,
        textAlign: width > 600 ? 'left' : 'center',
        marginLeft: width > 600 ? 40 : 0,
    },
    headerCategories: {
        flex: 2,
        marginHorizontal: 20,
    },
    headerCategoryButton: {
        backgroundColor: 'transparent',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginHorizontal: 6,
    },
    headerCategoryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    activeCategory: {
        backgroundColor: '#d7263d',
    },
    activeCategoryText: {
        color: '#fff',
        fontWeight: '600',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    navSearchButton: {
        padding: 8,
    },
    searchIcon: {
        fontSize: 20,
        color: '#fff',
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: '#e0e0e0',
        paddingHorizontal: 12,
        width: width > 600 ? 200 : 150,
    },
    navSearchInput: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 16,
        color: '#000',
    },
    sidebarOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'flex-start',
    },
    sidebar: {
        width: 280,
        height: '100%',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 16,
        paddingTop: 40,
    },
    closeSidebar: {
        alignSelf: 'flex-end',
        marginRight: 16,
        marginBottom: 16,
        padding: 8,
    },
    closeSidebarText: {
        fontSize: 32,
        color: '#d7263d',
        fontWeight: 'bold',
    },
    sidebarList: {
        flex: 1,
    },
    sidebarItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderLeftWidth: 5,
    },
    sidebarItemText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
    },
});

export default Header;