import axios from 'axios';
import type { Movie } from '../types/movie';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_TOKEN;

interface FetchMoviesResponse {
  results: Movie[];
}

export async function fetchMovies(query: string): Promise<Movie[]> {
  const response = await axios.get<FetchMoviesResponse>(
    `${BASE_URL}/search/movie`,
    {
      params: {
        query,
      },
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
    }
  );
  return response.data.results;
}
