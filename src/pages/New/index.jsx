import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Textarea } from '../../components/Textarea';
import { NoteItem } from '../../components/NoteItem';
import { Section } from '../../components/Section';
import { Button } from '../../components/Button';
import { Container, Form } from './styles';
import { Link } from 'react-router-dom';
import { useMovies } from '../../contexts/MoviesContext';


export function New() {
  const navigate = useNavigate();
  const { createMovie } = useMovies();
  const [title, setTitle] = useState('');
  const [rating, setRating] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');

  function handleAddTag() {
    const normalizedTag = newTag.trim();

    if (!normalizedTag) {
      return;
    }

    if (tags.includes(normalizedTag)) {
      window.alert('Este marcador já foi adicionado.');
      return;
    }

    setTags(previousTags => [...previousTags, normalizedTag]);
    setNewTag('');
  }

  function handleRemoveTag(tagToRemove) {
    setTags(previousTags => previousTags.filter(tag => tag !== tagToRemove));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim() || !description.trim() || !rating) {
      window.alert('Preencha título, nota e descrição do filme.');
      return;
    }

    const numericRating = Number(rating);

    if (Number.isNaN(numericRating) || numericRating < 0 || numericRating > 5) {
      window.alert('A nota deve ser um número entre 0 e 5.');
      return;
    }

    if (newTag.trim()) {
      window.alert('Você possui um marcador pendente. Adicione-o ou limpe o campo antes de salvar.');
      return;
    }

    const movie = createMovie({
      title,
      rating: numericRating,
      description,
      tags,
    });

    navigate(`/details/${movie.id}`);
  }

  return (
  <Container>
    <Header />

    <main>
      <Form onSubmit={handleSubmit}>
        <header>
          <Link to="/">
            <FiArrowLeft />
            Voltar
          </Link>
          <h1>Novo filme</h1>
        </header>

        <div className="row">
          <Input placeholder="Título" value={title} onChange={event => setTitle(event.target.value)} />
          <Input placeholder="Sua nota (0 a 5)" type="number" min="0" max="5" value={rating} onChange={event => setRating(event.target.value)} />
        </div>
        <Textarea placeholder="Descrição" value={description} onChange={event => setDescription(event.target.value)} />

        <Section title="Marcadores">
          <div className="tags">
          {tags.map(tag => (
            <NoteItem key={tag} value={tag} onClick={() => handleRemoveTag(tag)} />
          ))}

          <NoteItem
            isNew
            placeholder="Nova tag"
            value={newTag}
            onChange={event => setNewTag(event.target.value)}
            onClick={handleAddTag}
          />
          </div>
        </Section>

        <Button title="Salvar filme" type="submit" />

      </Form>
    </main>
  </Container>
 );
}