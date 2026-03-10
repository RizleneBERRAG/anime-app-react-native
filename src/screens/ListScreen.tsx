import React, { useState, useEffect } from "react";
import { View, FlatList, Text, ActivityIndicator, StyleSheet } from "react-native";
import { getAnimes, searchAnime } from "../services/api.service";
import SearchBar from "../components/SearchBar";
import { Anime } from "../types/types";

export default function ListScreen() {
  const [data, setData] = useState<Anime[]>([]);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Fetch initial data
  const fetchData = async (pageNum: number, query?: string) => {
    try {
      setIsFetchingMore(true);
      let response;
      
      if (query && query.trim()) {
       response = await searchAnime(query, pageNum);
      } else {
       response = await getAnimes(pageNum);
      }

      // Merge new data with existing data
      setData(prevData => 
        pageNum === 1 
          ? response.data 
          : [...prevData, ...response.data]
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsFetchingMore(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchData(1);
  }, []);

  // Handle search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setPage(1);
    setData([]);
    setIsSearching(true);
    await fetchData(1, query);
    setIsSearching(false);
  };

  // Handle clear search
  const handleClear = async () => {
    setSearchQuery("");
    setPage(1);
    setData([]);
    setIsSearching(false);
    await fetchData(1);
  };

  // Load more when reaching end
  const handleLoadMore = () => {
    if (!isFetchingMore && !isSearching) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchData(nextPage, searchQuery || undefined);
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <SearchBar 
        onSearch={handleSearch}
        onClear={handleClear}
      />

      {/* Anime List */}
      <FlatList
        data={data}
       renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.title}</Text>
          </View>
        )}
        keyExtractor={(item) => item.mal_id.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => (
          isFetchingMore ? (
            <ActivityIndicator 
              size="large" 
              color="#0000ff" 
              style={styles.loader}
            />
          ) : null
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  loader: {
    paddingVertical: 20,
  },
});
