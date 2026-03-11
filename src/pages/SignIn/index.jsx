import { useState, useEffect } from 'react';
import { Container, Form, Background } from './styles';
import { Link } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useAuth } from '../../contexts/AuthContext';


export function SignIn() {
  const { signIn, users } = useAuth();
  const [email, setEmail] = useState('manoel@example.com');
  const [password, setPassword] = useState('123456');

  useEffect(() => {
    // Debug: Show available users in console
    console.log('Available users for login:', users);
  }, [users]);

  function handleSubmit(event) {
    event.preventDefault();

    const result = signIn({ email, password });

    if (!result.success) {
      window.alert(result.message);
    }
  }

  function handleResetStorage() {
    localStorage.removeItem('@rocketmovies:users');
    localStorage.removeItem('@rocketmovies:user');
    window.alert('Storage limpo! Recarregue a página.');
  }

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <h1 onDoubleClick={handleResetStorage} title="Double-click to reset storage">RocketMovies</h1>
        <p>Aplicação para acompanhar, avaliar e organizar os filmes que você assistiu.</p>
        <h2>Faça seu login</h2>
      <Input 
        placeholder="E-mail"
        type="text"
        icon={FiMail}
        value={email}
        onChange={event => setEmail(event.target.value)}
      />

      <Input 
        placeholder="Senha"
        type="password"
        icon={FiLock}
        value={password}
        onChange={event => setPassword(event.target.value)}
      />

      <Button title="Entrar" type="submit" />
      
      <Link to="/register">
        Criar Conta
      </Link>

      </Form>

      <Background />

    </Container>
  );
}