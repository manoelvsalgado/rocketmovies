import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { moviesDb } from '../services/supabase';
import { useAuth } from './AuthContext';

const MoviesContext = createContext({});
const DEMO_MOVIES_KEY = '@rocketmovies:demo-movies';

function readDemoMovies() {
  const storedValue = localStorage.getItem(DEMO_MOVIES_KEY);

  if (!storedValue) {
    return [];
  }

  try {
    return JSON.parse(storedValue);
  } catch {
    return [];
  }
}

function persistDemoMovies(movies) {
  localStorage.setItem(DEMO_MOVIES_KEY, JSON.stringify(movies));
}

function buildDemoMovie({ title, description, rating, tags }) {
  return {
    id: `demo-${Date.now()}-${Math.random().toString(16).slice(2)}`,
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

  const isDemoUser = user?.id === 'demo-user';

  const refreshMovies = useCallback(async () => {
    if (isDemoUser) {
      const demoMovies = readDemoMovies();
      setMovies(demoMovies);
      return demoMovies;
    }

    const moviesFromDb = await moviesDb.list();
    setMovies(moviesFromDb);
    return moviesFromDb;
  }, [isDemoUser]);

  useEffect(() => {
    async function loadMovies() {
      try {
        await refreshMovies();
      } catch {
        window.alert('Não foi possível carregar os filmes da API.');
      }
    }

    loadMovies();
  }, [refreshMovies]);

  async function createMovie({ title, description, rating, tags }) {
    if (isDemoUser) {
      const newMovie = buildDemoMovie({
        title: title.trim(),
        description: description.trim(),
        rating: Number(rating),
        tags: tags.filter(Boolean),
      });

      const nextMovies = [newMovie, ...readDemoMovies()];
      persistDemoMovies(nextMovies);
      setMovies(nextMovies);

      return newMovie;
    }

    const newMovie = await moviesDb.create({
      title: title.trim(),
      description: description.trim(),
      rating: Number(rating),
      tags: tags.filter(Boolean),
    });

    await refreshMovies();

    return newMovie;
  }

  async function updateMovie(id, { title, description, rating, tags }) {
    if (isDemoUser) {
      const nextMovies = readDemoMovies().map(movie => {
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

      persistDemoMovies(nextMovies);
      setMovies(nextMovies);

      return nextMovies.find(movie => movie.id === id);
    }

    const updatedMovie = await moviesDb.update(id, {
      title: title.trim(),
      description: description.trim(),
      rating: Number(rating),
      tags: tags.filter(Boolean),
    });

    await refreshMovies();

    return updatedMovie;
  }

  async function deleteMovie(id) {
    if (isDemoUser) {
      const nextMovies = readDemoMovies().filter(movie => movie.id !== id);
      persistDemoMovies(nextMovies);
      setMovies(nextMovies);
      return;
    }

    await moviesDb.remove(id);
    await refreshMovies();
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
