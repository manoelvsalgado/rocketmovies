import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { Container } from './styles';
import { Header } from '../../components/Header';
import { Note } from '../../components/Note';
import { Button } from '../../components/Button';
import { Section } from '../../components/Section';
import { useMovies } from '../../contexts/MoviesContext';

export function Home() {
  const navigate = useNavigate();
  const { movies } = useMovies();
  const [search, setSearch] = useState('');

  const filteredMovies = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return movies;
    }

    return movies.filter(movie =>
      movie.title.toLowerCase().includes(normalizedSearch) ||
      movie.tags.some(tag => tag.toLowerCase().includes(normalizedSearch)),
    );
  }, [movies, search]);

  return (
    <Container>
      <Header onSearch={setSearch} searchValue={search} />

      <main>
        <Section title="Meus filmes">
          <div className="actions">
            <Button 
              icon={<FiPlus/>}
              title="Adicionar filme"
              onClick={() => navigate('/new')}
            />
          </div>

          {filteredMovies.map(movie => (
            <Note
              key={movie.id}
              data={{
                ...movie,
                tags: movie.tags.map(tag => ({
                  id: `${movie.id}-${tag}`,
                  name: tag,
                })),
              }}
              onClick={() => navigate(`/details/${movie.id}`)}
            />
          ))}

          {!filteredMovies.length && (
            <div className="empty">
              <strong>Nenhum filme encontrado</strong>
              <p>Tente buscar por outro título ou marcador.</p>
            </div>
          )}
        </Section>
      </main>
    </Container>
  );
}