import { RiShutDownLine } from 'react-icons/ri';
import { Container, Profile, Logout } from './styles';
import { Input } from '../../components/Input';
import { useAuth } from '../../contexts/AuthContext';


export function Header({ onSearch, searchValue = '' }) {
  const { user, signOut } = useAuth();

  return (
    <Container>
      <h1>RocketMovies</h1>

      <div className="search">
        <Input
          placeholder="Pesquise pelo título"
          value={searchValue}
          onChange={event => onSearch?.(event.target.value)}
        />
      </div>

      <Profile to="/profile">
        <div>
          <strong>{user?.name}</strong>
          <span>{user?.email}</span>
        </div>

        <img 
        src={user?.avatarUrl}
        alt="Foto de Usuário"
        />
      </Profile>

      <Logout type="button" onClick={signOut} aria-label="Sair">
        <RiShutDownLine />
      </Logout>

    </Container>
  );
}