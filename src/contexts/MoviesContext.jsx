import { createContext, useContext, useEffect, useState } from 'react';
import { moviesDb } from '../services/supabase';

const MoviesContext = createContext({});

export function MoviesProvider({ children }) {
  const [movies, setMovies] = useState([]);

  async function refreshMovies() {
    const moviesFromDb = await moviesDb.list();
    setMovies(moviesFromDb);
    return moviesFromDb;
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
