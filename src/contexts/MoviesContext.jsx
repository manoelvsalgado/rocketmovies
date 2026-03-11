import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const MoviesContext = createContext({});
const MOVIES_STORAGE_PREFIX = '@rocketmovies:movies:';

function moviesStorageKey(userId) {
  return `${MOVIES_STORAGE_PREFIX}${userId}`;
}

function readStoredMovies(userId) {
  const storedValue = localStorage.getItem(moviesStorageKey(userId));

  if (!storedValue) {
    return [];
  }

  try {
    return JSON.parse(storedValue);
  } catch {
    return [];
  }
}

function persistMovies(userId, movies) {
  localStorage.setItem(moviesStorageKey(userId), JSON.stringify(movies));
}

function buildMovie({ title, description, rating, tags }) {
  return {
    id: `movie-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title,
    description,
    rating,
    tags,
    createdAt: new Date().toISOString(),
  };
}

export function MoviesProvider({ children }) {
  const [movies, setMovies] = useState([]);
  const { user } = useAuth();

  const refreshMovies = useCallback(async () => {
    if (!user?.id) {
      setMovies([]);
      return [];
    }

    const storedMovies = readStoredMovies(user.id);
    setMovies(storedMovies);
    return storedMovies;
  }, [user?.id]);

  useEffect(() => {
    async function loadMovies() {
      try {
        await refreshMovies();
      } catch {
        window.alert('Não foi possível carregar os filmes locais.');
      }
    }

    loadMovies();
  }, [refreshMovies]);

  async function createMovie({ title, description, rating, tags }) {
    if (!user?.id) {
      throw new Error('Usuário não autenticado.');
    }

    const newMovie = buildMovie({
      title: title.trim(),
      description: description.trim(),
      rating: Number(rating),
      tags: tags.filter(Boolean),
    });

    const nextMovies = [newMovie, ...readStoredMovies(user.id)];
    persistMovies(user.id, nextMovies);
    setMovies(nextMovies);

    return newMovie;
  }

  async function updateMovie(id, { title, description, rating, tags }) {
    if (!user?.id) {
      throw new Error('Usuário não autenticado.');
    }

    const nextMovies = readStoredMovies(user.id).map(movie => {
      if (movie.id !== id) {
        return movie;
      }

      return {
        ...movie,
        title: title.trim(),
        description: description.trim(),
        rating: Number(rating),
        tags: tags.filter(Boolean),
      };
    });

    persistMovies(user.id, nextMovies);
    setMovies(nextMovies);

    return nextMovies.find(movie => movie.id === id);
  }

  async function deleteMovie(id) {
    if (!user?.id) {
      throw new Error('Usuário não autenticado.');
    }

    const nextMovies = readStoredMovies(user.id).filter(movie => movie.id !== id);
    persistMovies(user.id, nextMovies);
    setMovies(nextMovies);
  }

  function getMovieById(id) {
    return movies.find(movie => movie.id === id);
  }

  const value = {
    movies,
    createMovie,
    updateMovie,
    deleteMovie,
    getMovieById,
  };

  return <MoviesContext.Provider value={value}>{children}</MoviesContext.Provider>;
}

export function useMovies() {
  return useContext(MoviesContext);
}
