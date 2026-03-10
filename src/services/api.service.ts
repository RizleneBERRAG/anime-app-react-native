import axios from "axios";
import { AnimeApiResponse } from "../types/types";

const BASE_URL = "https://api.jikan.moe/v4";

// instance axios
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});


// récupérer la liste des animes avec pagination
export const getAnimes = async (page: number = 1): Promise<AnimeApiResponse> => {
  const response = await api.get(`/anime?page=${page}`);
  return response.data;
};


// rechercher un anime
export const searchAnime = async (query: string, page: number = 1): Promise<AnimeApiResponse> => {
  const response = await api.get(`/anime?q=${query}&page=${page}`);
  return response.data;
};


// récupérer un anime par son ID
export const getAnimeById = async (id: number) => {
  const response = await api.get(`/anime/${id}`);
  return response.data;
};