import { useState } from 'react';
import { Container, Form, Background } from './styles';
import { Link } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useAuth } from '../../contexts/AuthContext';


export function SignIn() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('manoel@example.com');
  const [password, setPassword] = useState('123456');

  function handleSubmit(event) {
    event.preventDefault();

    const result = signIn({ email, password });

    if (!result.success) {
      window.alert(result.message);
    }
  }

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <h1>RocketMovies</h1>
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