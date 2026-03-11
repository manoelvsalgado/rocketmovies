import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const MoviesContext = createContext({});

const STORAGE_KEY = '@rocketmovies:movies';

const seedMovies = [
  {
    id: 'movie-1',
    title: 'Três Homens em Conflito',
    rating: 5,
    description:
      'Durante a Guerra Civil Americana, três pistoleiros disputam uma fortuna escondida enquanto cruzam um oeste brutal e inesquecível.',
    tags: ['Faroeste', 'Clint Eastwood', 'Sergio Leone'],
    createdAt: '2026-03-10T12:00:00.000Z',
  },
];

function readStorage() {
  const storedValue = localStorage.getItem(STORAGE_KEY);

  if (!storedValue) {
    return seedMovies;
  }

  try {
    return JSON.parse(storedValue);
  } catch {
    return seedMovies;
  }
}

function createMovieId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `movie-${Date.now()}`;
}

export function MoviesProvider({ children }) {
  const [movies, setMovies] = useState(readStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
  }, [movies]);

  function createMovie({ title, description, rating, tags }) {
    const newMovie = {
      id: createMovieId(),
      title: title.trim(),
      description: description.trim(),
      rating: Number(rating),
      tags: tags.filter(Boolean),
      createdAt: new Date().toISOString(),
    };

    setMovies(previousMovies => [newMovie, ...previousMovies]);

    return newMovie;
  }

  function deleteMovie(id) {
    setMovies(previousMovies => previousMovies.filter(movie => movie.id !== id));
  }

  function getMovieById(id) {
    return movies.find(movie => movie.id === id);
  }

  const value = useMemo(
    () => ({
      movies,
      createMovie,
      deleteMovie,
      getMovieById,
    }),
    [movies],
  );

  return <MoviesContext.Provider value={value}>{children}</MoviesContext.Provider>;
}

export function useMovies() {
  return useContext(MoviesContext);
}
