// Image de l'anime
export interface AnimeImage {
  image_url: string;
}

// Structure des images
export interface AnimeImages {
  jpg: AnimeImage;
}

// Objet Anime principal
export interface Anime {
  mal_id: number;
  title: string;
  synopsis: string;
  score: number;
  images: AnimeImages;
}

// Pagination de l'API
export interface Pagination {
  last_visible_page: number;
  has_next_page: boolean;
}

// Réponse complète de l'API
export interface AnimeApiResponse {
  data: Anime[];
  pagination: Pagination;
}