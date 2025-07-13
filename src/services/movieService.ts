import axios from 'axios';
import type { Movie } from '../types/movie';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_TOKEN;

interface FetchMoviesResponse {
  results: Movie[];
  total_pages: number;
}

export async function fetchMovies(
  query: string,
  page: number
): Promise<FetchMoviesResponse> {
  const response = await axios.get<FetchMoviesResponse>(
    `${BASE_URL}/search/movie`,
    {
      params: {
        query,
        page,
      },
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
    }
  );
  return response.data;
}
