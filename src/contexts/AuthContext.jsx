import { createContext, useContext, useEffect, useState } from 'react';
import { usersApi } from '../services/api';

const AuthContext = createContext({});

const STORAGE_KEY = '@rocketmovies:user';
const DEFAULT_ROLE = 'user';

function readStoredUser() {
  const storedValue = localStorage.getItem(STORAGE_KEY);

  if (!storedValue) {
    return null;
  }

  try {
    return JSON.parse(storedValue);
  } catch {
    return null;
  }
}

function persistCurrentUser(user) {
  if (!user) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function buildAvatarUrl(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=FF859B&color=232129`;
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(readStoredUser);

  useEffect(() => {
    persistCurrentUser(user);
  }, [user]);

  useEffect(() => {
    async function loadUsers() {
      try {
        const usersFromApi = await usersApi.list();
        setUsers(usersFromApi);

        if (user) {
          const refreshedCurrentUser = usersFromApi.find(existingUser => existingUser.id === user.id);
          setUser(refreshedCurrentUser || null);
        }
      } catch {
        window.alert('Não foi possível carregar os usuários da API.');
      }
    }

    loadUsers();
  }, [user]);

  async function refreshUsers() {
    const usersFromApi = await usersApi.list();
    setUsers(usersFromApi);
    return usersFromApi;
  }

  async function signIn({ email, password }) {
    try {
      const usersFromApi = await refreshUsers();
      const normalizedEmail = normalizeEmail(email);
      const normalizedPassword = password.trim();

      const foundUser = usersFromApi.find(
        existingUser =>
          normalizeEmail(existingUser.email) === normalizedEmail &&
          existingUser.password === normalizedPassword,
      );

      if (!foundUser) {
        return {
          success: false,
          message: 'E-mail ou senha inválidos.',
        };
      }

      setUser(foundUser);

      return {
        success: true,
      };
    } catch {
      return {
        success: false,
        message: 'Falha ao acessar a API de autenticação.',
      };
    }
  }

  async function signUp({ name, email, password }) {
    try {
      const usersFromApi = await refreshUsers();
      const normalizedEmail = normalizeEmail(email);

      const emailAlreadyExists = usersFromApi.some(
        existingUser => normalizeEmail(existingUser.email) === normalizedEmail,
      );

      if (emailAlreadyExists) {
        return {
          success: false,
          message: 'Já existe uma conta com este e-mail.',
        };
      }

      const newUser = await usersApi.create({
        name: name.trim(),
        email: normalizedEmail,
        password: password.trim(),
        avatarUrl: buildAvatarUrl(name),
        role: DEFAULT_ROLE,
      });

      await refreshUsers();
      setUser(newUser);

      return {
        success: true,
      };
    } catch {
      return {
        success: false,
        message: 'Falha ao criar conta na API.',
      };
    }
  }

  function signOut() {
    setUser(null);
  }

  async function updateProfile({ name, email, password, avatarUrl }) {
    if (!user) {
      return {
        success: false,
        message: 'Nenhum usuário autenticado.',
      };
    }

    try {
      const usersFromApi = await refreshUsers();
      const normalizedEmail = normalizeEmail(email);

      const emailAlreadyExists = usersFromApi.some(
        existingUser =>
          existingUser.id !== user.id && normalizeEmail(existingUser.email) === normalizedEmail,
      );

      if (emailAlreadyExists) {
        return {
          success: false,
          message: 'Este e-mail já está em uso.',
        };
      }

      const updatedUser = await usersApi.update(user.id, {
        name: name.trim(),
        email: normalizedEmail,
        password: password?.trim() || user.password,
        avatarUrl: avatarUrl || user.avatarUrl,
      });

      await refreshUsers();
      setUser(updatedUser);

      return {
        success: true,
      };
    } catch {
      return {
        success: false,
        message: 'Falha ao atualizar perfil na API.',
      };
    }
  }

  async function createUser({ name, email, password, role = DEFAULT_ROLE }) {
    try {
      const usersFromApi = await refreshUsers();
      const normalizedEmail = normalizeEmail(email);

      const emailAlreadyExists = usersFromApi.some(
        existingUser => normalizeEmail(existingUser.email) === normalizedEmail,
      );

      if (emailAlreadyExists) {
        return {
          success: false,
          message: 'Já existe um usuário com este e-mail.',
          user: null,
        };
      }

      const newUser = await usersApi.create({
        name: name.trim(),
        email: normalizedEmail,
        password: password.trim(),
        avatarUrl: buildAvatarUrl(name),
        role,
      });

      await refreshUsers();

      return {
        success: true,
        message: 'Usuário criado com sucesso.',
        user: newUser,
      };
    } catch {
      return {
        success: false,
        message: 'Falha ao criar usuário na API.',
        user: null,
      };
    }
  }

  async function updateUser(userId, { name, email, password, role }) {
    try {
      const usersFromApi = await refreshUsers();
      const currentUser = usersFromApi.find(existingUser => existingUser.id === userId);

      if (!currentUser) {
        return {
          success: false,
          message: 'Usuário não encontrado.',
        };
      }

      const normalizedEmail = normalizeEmail(email);
      const emailAlreadyExists = usersFromApi.some(
        existingUser =>
          existingUser.id !== userId && normalizeEmail(existingUser.email) === normalizedEmail,
      );

      if (emailAlreadyExists) {
        return {
          success: false,
          message: 'Este e-mail já está em uso.',
        };
      }

      const updatedUser = await usersApi.update(userId, {
        name: name.trim(),
        email: normalizedEmail,
        password: password?.trim() || currentUser.password,
        role: role || currentUser.role,
      });

      await refreshUsers();

      if (user?.id === userId) {
        setUser(updatedUser);
      }

      return {
        success: true,
        message: 'Usuário atualizado com sucesso.',
      };
    } catch {
      return {
        success: false,
        message: 'Falha ao atualizar usuário na API.',
      };
    }
  }

  async function deleteUser(userId) {
    if (user?.id === userId) {
      return {
        success: false,
        message: 'Você não pode deletar sua própria conta aqui. Use as configurações de perfil.',
      };
    }

    try {
      await usersApi.remove(userId);
      const updatedUsers = await refreshUsers();

      if (user && !updatedUsers.some(existingUser => existingUser.id === user.id)) {
        setUser(null);
      }

      return {
        success: true,
        message: 'Usuário deletado com sucesso.',
      };
    } catch {
      return {
        success: false,
        message: 'Falha ao deletar usuário na API.',
      };
    }
  }

  function isAdmin() {
    return user?.role === 'admin';
  }

  const value = {
    user,
    users,
    signIn,
    signOut,
    signUp,
    updateProfile,
    createUser,
    updateUser,
    deleteUser,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
