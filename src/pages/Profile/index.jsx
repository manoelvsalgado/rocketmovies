import { useState } from 'react';
import { Container, Form, Avatar } from "./styles";
import { FiArrowLeft, FiUser, FiMail, FiLock, FiLink } from "react-icons/fi";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';




export function Profile() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    const result = await updateProfile({
      name,
      email,
      avatarUrl,
      password: newPassword || password,
    });

    if (!result.success) {
      window.alert(result.message);
      return;
    }

    setPassword('');
    setNewPassword('');
    window.alert('Perfil atualizado com sucesso.');
  }

  return (
    <Container>
      <header>
        <Link to="/" >
        <FiArrowLeft />
        <span>Voltar</span>
        </Link>
      </header>

      <Form onSubmit={handleSubmit}>
        <h2>Meu perfil</h2>
        <p>Gerencie seus dados de acesso e personalize sua foto.</p>

        <Avatar>
          <img 
          src={avatarUrl || 'https://placehold.co/152x152?text=User'}
          alt="Foto do usuário" 
          />
        </Avatar>

        <Input
          placeholder="URL da foto de perfil"
          type="url"
          icon={FiLink}
          value={avatarUrl}
          onChange={event => setAvatarUrl(event.target.value)}
        />
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
          placeholder="Senha atual"
          type="password"
          icon={FiLock}
          value={password}
          onChange={event => setPassword(event.target.value)}
        />  

        <Input 
          placeholder="Nova senha"
          type="password"
          icon={FiLock}
          value={newPassword}
          onChange={event => setNewPassword(event.target.value)}
        />    

      <Button title="Salvar" type="submit" />    

      </Form>

    </Container>
  )
}