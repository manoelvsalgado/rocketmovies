import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { moviesApi } from '../services/api';

const MoviesContext = createContext({});

export function MoviesProvider({ children }) {
  const [movies, setMovies] = useState([]);

  async function refreshMovies() {
    const moviesFromApi = await moviesApi.list();
    setMovies(moviesFromApi);
    return moviesFromApi;
  }

  useEffect(() => {
    async function loadMovies() {
      try {
        await refreshMovies();
      } catch {
        window.alert('Não foi possível carregar os filmes da API.');
      }
    }

    loadMovies();
  }, []);

  async function createMovie({ title, description, rating, tags }) {
    const newMovie = await moviesApi.create({
      title: title.trim(),
      description: description.trim(),
      rating: Number(rating),
      tags: tags.filter(Boolean),
      createdAt: new Date().toISOString(),
    });

    await refreshMovies();

    return newMovie;
  }

  async function deleteMovie(id) {
    await moviesApi.remove(id);
    await refreshMovies();
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
