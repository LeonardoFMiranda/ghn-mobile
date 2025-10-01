import { Stack } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import Header from "./components/Header";
import { ArticlesCacheProvider } from "./context/ArticlesCacheContext";
import { FavoritesProvider } from "./context/FavoritesContext";

export default function RootLayout() {
  return (
    <ArticlesCacheProvider>
      <FavoritesProvider>
        <View style={styles.container}>
          <Header 
            onSearch={(query: string) => {
              console.log('Search:', query);
            }}
            onCategorySelect={(category: string) => {
              console.log('Category:', category);
            }}
          />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#f7f7f7' }
            }}
          >
            <Stack.Screen name="index" />
          </Stack>
        </View>
      </FavoritesProvider>
    </ArticlesCacheProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
});
