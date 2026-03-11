import { useState } from 'react';
import { Container, Form, Background } from './styles';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';


export function SignUp() {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      window.alert('Preencha nome, e-mail e senha para continuar.');
      return;
    }

    const result = signUp({ name, email, password });

    if (!result.success) {
      window.alert(result.message);
    }
  }

  return (
    <Container>
      <Background />
      <Form onSubmit={handleSubmit}>
        <small>Novo por aqui?</small>
        <h1>RocketMovies</h1>
        <p>Crie sua conta para registrar filmes, avaliações e marcadores favoritos.</p>
        <h2>Crie sua conta</h2>
        
      <Input 
        placeholder="Nome"
        type="text"
        icon={FiUser}
        value={name}
        onChange={event => setName(event.target.value)}
      />
      
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

      <Button title="Cadastrar" type="submit" />
      
      <Link to="/">
        Voltar para o login
      </Link>

      </Form>



    </Container>
  );
}