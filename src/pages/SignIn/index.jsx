import { Container, Form, Background } from './styles';
import { Button } from '../../components/Button';
import { useAuth } from '../../contexts/AuthContext';


export function SignIn() {
  const { signInDemo } = useAuth();

  function handleDemoAccess() {
    signInDemo();
  }

  return (
    <Container>
      <Form autoComplete="off">
        <small>Olá!</small>
        <h1>RocketMovies</h1>
        <p>Aplicação para acompanhar, avaliar e organizar os filmes que você assistiu.</p>
        <h2>Explore a aplicação</h2>

        <Button
          title="Entrar em modo demonstração"
          type="button"
          onClick={handleDemoAccess}
        />

      </Form>

      <Background />

    </Container>
  );
}