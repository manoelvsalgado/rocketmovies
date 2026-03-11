import { RiShutDownLine } from 'react-icons/ri';
import { MdAdminPanelSettings } from 'react-icons/md';
import { Container, Profile, Logout } from './styles';
import { Input } from '../../components/Input';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';


export function Header({ onSearch, searchValue = '' }) {
  const navigate = useNavigate();
  const { user, signOut, isAdmin } = useAuth();

  return (
    <Container>
      <Link to="/" className="logo">
        <h1>RocketMovies</h1>
      </Link>

      {onSearch ? (
        <div className="search">
          <Input
            type="search"
            placeholder="Pesquise pelo título ou marcador"
            value={searchValue}
            onChange={event => onSearch(event.target.value)}
          />
        </div>
      ) : (
        <div className="spacer" />
      )}

      {isAdmin() && (
        <button
          className="admin-btn"
          onClick={() => navigate('/users')}
          title="Gerenciar usuários"
        >
          <MdAdminPanelSettings />
        </button>
      )}

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