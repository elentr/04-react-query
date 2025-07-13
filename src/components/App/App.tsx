import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import css from './App.module.css';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Loader from '../Loader/Loader';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import SearchBar from '../SearchBar/SearchBar';
import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';

export default function App() {
  //стани
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query !== '',
    placeholderData: keepPreviousData,
  });

  //функція пошуку
  const handleSearch = (query: string) => {
    setQuery(query);
    setPage(1); // скидання сторінки до 1 при новому пошуку
  };
  useEffect(() => {
    if (isSuccess && data?.results.length === 0) {
      toast.error('No movies found for your request.');
    }
  }, [isSuccess, data]);

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1); // ReactPaginate індексує з 0, TMDB з 1
  };

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const movies = data?.results || [];
  const totalPages = data?.total_pages || 1;

  return (
    <div className={css.app}>
      <Toaster position="top-right" />
      <SearchBar onSubmit={handleSearch} />
      {isError && <ErrorMessage />}
      {isLoading && <Loader />}
      {!isLoading && !isError && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={setSelectedMovie} />
      )}
      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={handlePageChange}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}
