import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { getAnimes, searchAnime } from "../services/api.service";
import { Anime } from "../types/types";
import { useNavigation } from "@react-navigation/native";
import SearchBar from "../components/SearchBar";

export default function HomeScreen() {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const navigation = useNavigation<any>();

  // Fetch data with pagination support
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
      setAnimes(prevData =>
        pageNum === 1
          ? response.data
          : [...prevData, ...response.data]
      );
    } catch (error) {
     console.error("Erreur API :", error);
    } finally {
      setIsFetchingMore(false);
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchData(1);
  }, []);

  if (loading) {
   return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Handle search from SearchBar
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setPage(1);
    setAnimes([]);
    setIsSearching(true);
    setLoading(true);
    await fetchData(1, query);
    setIsSearching(false);
  };

  // Handle clear search
  const handleClear = async () => {
    setSearchQuery("");
    setPage(1);
    setAnimes([]);
    setIsSearching(false);
    setLoading(true);
    await fetchData(1);
  };

  // Load more when reaching end of list
  const handleLoadMore = () => {
    if (!isFetchingMore && !isSearching) {
     const nextPage = page + 1;
      setPage(nextPage);
      fetchData(nextPage, searchQuery || undefined);
    }
  };

  const renderAnime = ({ item }: { item: Anime }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("Detail", { id: item.mal_id })}
    >
      <Image source={{ uri: item.images.jpg.image_url }} style={styles.image} />

      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.score}>⭐ {item.score}</Text>
      </View>
    </TouchableOpacity>
  );

 return (
    <View style={styles.container}>
      {/* Search Bar */}
      <SearchBar
        onSearch={handleSearch}
        onClear={handleClear}
      />

      {/* Anime List */}
      <FlatList
        data={animes}
        keyExtractor={(item) => item.mal_id.toString()}
       renderItem={renderAnime}
       contentContainerStyle={styles.list}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          isFetchingMore ? (
            <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
 container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 200,
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  score: {
    marginTop: 5,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loader: {
    paddingVertical: 20,
  },
});