import { useState } from 'react';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { Container, Content, Table, TableContainer } from './styles';
import { useAuth } from '../../contexts/AuthContext';
import { UserModal } from '../../components/UserModal';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

export function Users() {
  const { users, deleteUser, isAdmin } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

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

  function handleEdit(user) {
    setSelectedUser(user);
    setIsCreating(false);
    setIsModalOpen(true);
  }

  function handleCreate() {
    setSelectedUser(null);
    setIsCreating(true);
    setIsModalOpen(true);
  }

  function handleDelete(userId, userName) {
    const confirmed = window.confirm(
      `Tem certeza que deseja deletar o usuário "${userName}"?`,
    );

    if (confirmed) {
      const result = deleteUser(userId);
      window.alert(result.message);
    }
  }

  function handleModalClose() {
    setIsModalOpen(false);
    setSelectedUser(null);
  }

  return (
    <Container>
      <Header />
      <Content>
        <div className="header">
          <div>
            <h1>Gerenciar usuários</h1>
            <p>Crie, edite e organize permissões de acesso.</p>
          </div>
          <Button
            title="Novo usuário"
            icon={<FiPlus />}
            onClick={handleCreate}
          />
        </div>

        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Função</th>
                <th>Ações</th>
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
                  <td className={`role ${user.role}`}>{user.role === 'admin' ? 'Administrador' : 'Usuário'}</td>
                  <td>
                    <div className="actions">
                      <button
                        type="button"
                        onClick={() => handleEdit(user)}
                        className="edit-btn"
                        title="Editar usuário"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(user.id, user.name)}
                        className="delete-btn"
                        title="Deletar usuário"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>

        {isModalOpen && (
          <UserModal
            user={selectedUser}
            isCreating={isCreating}
            onClose={handleModalClose}
          />
        )}
      </Content>
    </Container>
  );
}
