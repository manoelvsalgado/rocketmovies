import { RiShutDownLine } from 'react-icons/ri';
import { Container, Profile, Logout } from './styles';
import { Input } from '../../components/Input';
import { Link } from 'react-router-dom';


export function Header() {
  
  return (
    <Container>
      <h1>RocketMovies</h1>
      
      <Input placeholder="Pesquise pelo título" />

      <Profile to="/profile">
        <div>
          <strong>Manoel Salgado</strong>
          <Logout>
            <p>sair</p>
          </Logout>
        </div>
        
        <img 
        src="https://github.com/manoelvsalgado.png"
        alt="Foto de Usuário"
        />
      </Profile>



    </Container>
  );
}