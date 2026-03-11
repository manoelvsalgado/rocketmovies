import { Header } from '../../components/Header';
import { Container, Content, Table, TableContainer } from './styles';
import { useAuth } from '../../contexts/AuthContext';

export function Users() {
  const { users, isAdmin } = useAuth();

  if (!isAdmin()) {
    return (
      <Container>
        <Header />
        <Content>
          <div className="blocked">
            <h1>Acesso negado</h1>
            <p>Você não tem permissão para acessar esta página.</p>
          </div>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Header />
      <Content>
        <div className="header">
          <div>
            <h1>Usuários</h1>
            <p>Lista de usuários cadastrados na plataforma.</p>
          </div>
        </div>

        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Função</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className="user-cell">
                      <img src={user.avatarUrl} alt={user.name} />
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td className={`role ${user.role}`}>
                    {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </Content>
    </Container>
  );
}

