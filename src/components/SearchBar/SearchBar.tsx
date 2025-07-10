import { useState } from 'react';
import css from './SearchBar.module.css';
import toast from 'react-hot-toast';

interface SearchBarProps {
  onSubmit: (query: string) => void;
}

export default function SearchBar({ onSubmit }: SearchBarProps) {
  const [value, setValue] = useState('');

  const handleFormAction = (formData: FormData) => {
    const query = formData.get('query') as string;
    if (!query || query.trim() === '') {
      toast.error('Please enter your search query.');
      return;
    }
    onSubmit(query);
    setValue(''); // очищення інпуту
  };

  return (
    <header className={css.header}>
      <div className={css.container}>
        <a
          className={css.link}
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by TMDB
        </a>
        <form className={css.form} action={handleFormAction}>
          <input
            className={css.input}
            type="text"
            name="query"
            value={value}
            onChange={e => setValue(e.target.value)}
            autoComplete="off"
            placeholder="Search movies..."
            autoFocus
          />
          <button className={css.button} type="submit">
            Search
          </button>
        </form>
      </div>
    </header>
  );
}
