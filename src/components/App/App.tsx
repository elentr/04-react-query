import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import css from './App.module.css';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Loader from '../Loader/Loader';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import SearchBar from '../SearchBar/SearchBar';
import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';

export default function App() {
  //стани
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  //функція пошуку
  const handleSearch = async (query: string) => {
    try {
      setIsLoading(true);
      setError(false); //скидання помилок
      setMovies([]); // очищення попередніх результатів
      const results = await fetchMovies(query);
      if (results.length === 0) {
        toast.error('No movies found for your request.');
      }
      setMovies(results);
    } catch {
      setError(true);
      toast.error('Failed to fetch movies. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  //обробка вибору фільму
  const handleSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={css.app}>
      <Toaster position="top-right" />
      <SearchBar onSubmit={handleSearch} />
      {error && <ErrorMessage />}
      {isLoading && <Loader />}
      {!isLoading && !error && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelect} />
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}
