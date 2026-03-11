import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({});

const STORAGE_KEY = '@rocketmovies:user';
const USERS_STORAGE_KEY = '@rocketmovies:users';

function buildAvatarUrl(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=FF859B&color=232129`;
}

const DEMO_USER = {
  id: 'demo-admin',
  name: 'Visitante Demo',
  email: 'demo@rocketmovies.app',
  avatarUrl: buildAvatarUrl('Visitante Demo'),
  role: 'admin',
};

const DEFAULT_USERS = [
  DEMO_USER,
  {
    id: 'demo-user-2',
    name: 'Usuário Exemplo',
    email: 'usuario@demo.app',
    avatarUrl: buildAvatarUrl('Usuário Exemplo'),
    role: 'user',
  },
];

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

function readStoredUsers() {
  const storedValue = localStorage.getItem(USERS_STORAGE_KEY);

  if (!storedValue) {
    return DEFAULT_USERS;
  }

  try {
    const parsed = JSON.parse(storedValue);
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_USERS;
  } catch {
    return DEFAULT_USERS;
  }
}

function persistUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
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

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(readStoredUsers);
  const [user, setUser] = useState(readStoredUser);

  useEffect(() => {
    persistCurrentUser(user);
  }, [user]);

  useEffect(() => {
    persistUsers(users);
  }, [users]);

  useEffect(() => {
    const storedUser = readStoredUser();
    setUser(storedUser);

    const storedUsers = readStoredUsers();
    setUsers(storedUsers);
  }, []);

  async function signIn({ email, password }) {
    if (!email.trim() || !password.trim()) {
      return { success: false, message: 'Preencha e-mail e senha para continuar.' };
    }

    setUser(DEMO_USER);
    return { success: true };
  }

  function signInDemo() {
    setUser(DEMO_USER);
    return { success: true };
  }

  async function signOut() {
    setUser(null);
  }

  async function updateProfile({ name, email, avatarUrl }) {
    if (!user) {
      return { success: false, message: 'Nenhum usuário autenticado.' };
    }

    try {
      const trimmedName = name.trim();
      const nextAvatarUrl = avatarUrl?.trim() || user.avatarUrl;

      const nextEmail = email && normalizeEmail(email) !== normalizeEmail(user.email)
        ? normalizeEmail(email)
        : user.email;

      const updatedUser = {
        ...user,
        name: trimmedName,
        email: nextEmail,
        avatarUrl: nextAvatarUrl,
      };

      setUser(updatedUser);
      setUsers(currentUsers => currentUsers.map(currentUser => {
        if (currentUser.id !== updatedUser.id) {
          return currentUser;
        }

        return updatedUser;
      }));

      return { success: true };
    } catch {
      return { success: false, message: 'Falha ao atualizar perfil no modo demo.' };
    }
  }

  function isAdmin() {
    return user?.role === 'admin';
  }

  const value = {
    user,
    users,
    signIn,
    signInDemo,
    signOut,
    updateProfile,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
