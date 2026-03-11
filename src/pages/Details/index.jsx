import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiClock, FiStar } from 'react-icons/fi';
import { Container, Links, Content } from './styles';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { Section} from '../../components/Section';
import { ButtonText } from '../../components/ButtonText';
import { Tag } from '../../components/Tag'
import { useMovies } from '../../contexts/MoviesContext';

export function Details() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getMovieById, deleteMovie } = useMovies();

  const movie = getMovieById(id);

  const formattedDate = useMemo(() => {
    if (!movie) {
      return '';
    }

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(movie.createdAt));
  }, [movie]);

  async function handleDeleteMovie() {
    if (!movie) {
      navigate('/');
      return;
    }

    const shouldDelete = window.confirm(`Deseja remover o filme "${movie.title}"?`);

    if (!shouldDelete) {
      return;
    }

    try {
      await deleteMovie(movie.id);
      navigate('/');
    } catch {
      window.alert('Falha ao excluir filme na API.');
    }
  }

  if (!movie) {
    return (
      <Container>
        <Header />

        <main>
          <Content>
            <h1>Filme não encontrado</h1>
            <p>O registro solicitado não existe mais.</p>
            <Button title="Voltar para a home" onClick={() => navigate('/')} />
          </Content>
        </main>
      </Container>
    );
  }

  return (
    <Container>
      <Header />

      <main>
        <Content>
          <div className="actions">
            <Button title="Voltar" onClick={() => navigate(-1)} />
            <ButtonText title="Excluir filme" onClick={handleDeleteMovie} />
          </div>

          <h1>{movie.title}</h1>

          <div className="rating">
            {Array.from({ length: 5 }).map((_, index) => (
              <FiStar key={`details-star-${index}`} className={index < movie.rating ? 'filled' : ''} />
            ))}
          </div>

          <div className="meta">
            <FiClock />
            <span>{formattedDate}</span>
          </div>

          <p>
            {movie.description}
          </p>

          <Section title="Marcadores">
            <Links>
              {movie.tags.map(tag => (
                <li key={tag}>
                  <Tag title={tag} />
                </li>
              ))}
            </Links>
          </Section>
        </Content>
      </main>
    </Container>
   );
}