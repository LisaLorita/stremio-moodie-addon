export interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  imdb_id?: string;
  genre_ids: number[];
}

export interface TmdbDiscoverResponse {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
}
