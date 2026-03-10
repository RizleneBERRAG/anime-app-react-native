import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { getAnimeById } from "../services/api.service";
import { Anime } from "../types/types";

type DetailRouteProp = RouteProp<RootStackParamList, "Detail">;

export default function DetailScreen() {
  const route = useRoute<DetailRouteProp>();
  const { id } = route.params;

  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const response = await getAnimeById(id);
        setAnime(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement de l'anime :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!anime) {
    return (
      <View style={styles.center}>
        <Text>Anime introuvable.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: anime.images.jpg.image_url }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{anime.title}</Text>
        <Text style={styles.score}>⭐ Score : {anime.score}</Text>
        <Text style={styles.synopsis}>{anime.synopsis}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 16,
  },
  image: {
    width: "100%",
    height: 350,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  score: {
    fontSize: 16,
    marginBottom: 12,
  },
  synopsis: {
    fontSize: 15,
    lineHeight: 22,
    color: "#444",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});