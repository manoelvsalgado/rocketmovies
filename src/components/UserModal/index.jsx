import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { Overlay, Modal, Header, Content, Footer } from './styles';
import { Input } from '../Input';
import { Button } from '../Button';
import { useAuth } from '../../contexts/AuthContext';

export function UserModal({ user, isCreating, onClose }) {
  const { createUser, updateUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');

  useEffect(() => {
    if (user && !isCreating) {
      setName(user.name);
      setEmail(user.email);
      setPassword('');
      setConfirmPassword('');
      setRole(user.role);
    } else {
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setRole('user');
    }
  }, [user, isCreating]);

  function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim() || !email.trim()) {
      window.alert('Preencha nome e e-mail.');
      return;
    }

    if (isCreating) {
      if (!password.trim()) {
        window.alert('Digite uma senha.');
        return;
      }

      if (password !== confirmPassword) {
        window.alert('As senhas não conferem.');
        return;
      }

      const result = createUser({
        name,
        email,
        password,
        role,
      });

      if (!result.success) {
        window.alert(result.message);
        return;
      }

      window.alert(result.message);
      onClose();
    } else {
      if (password && password !== confirmPassword) {
        window.alert('As senhas não conferem.');
        return;
      }

      const result = updateUser(user.id, {
        name,
        email,
        password: password || undefined,
        role,
      });

      if (!result.success) {
        window.alert(result.message);
        return;
      }

      window.alert(result.message);
      onClose();
    }
  }

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={event => event.stopPropagation()}>
        <Header>
          <h2>{isCreating ? 'Novo usuário' : 'Editar usuário'}</h2>
          <button type="button" onClick={onClose} className="close-btn">
            <FiX />
          </button>
        </Header>

        <Content>
          <form onSubmit={handleSubmit}>
            <Input
              placeholder="Nome"
              value={name}
              onChange={event => setName(event.target.value)}
              autoFocus
            />

            <Input
              placeholder="E-mail"
              type="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
            />

            <Input
              placeholder={isCreating ? 'Senha' : 'Nova senha (deixe vazio para não alterar)'}
              type="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
            />

            <Input
              placeholder={isCreating ? 'Confirmar senha' : 'Confirmar nova senha'}
              type="password"
              value={confirmPassword}
              onChange={event => setConfirmPassword(event.target.value)}
            />

            <div className="role-select">
              <label htmlFor="role">Função:</label>
              <select
                id="role"
                value={role}
                onChange={event => setRole(event.target.value)}
              >
                <option value="user">Usuário</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <Footer>
              <button type="button" onClick={onClose} className="cancel-btn">
                Cancelar
              </button>
              <Button title={isCreating ? 'Criar' : 'Salvar'} type="submit" />
            </Footer>
          </form>
        </Content>
      </Modal>
    </Overlay>
  );
}
