import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext({});

const STORAGE_KEYS = {
  users: '@rocketmovies:users',
  user: '@rocketmovies:user',
};

const seedUsers = [
  {
    id: 'user-1',
    name: 'Manoel Salgado',
    email: 'manoel@example.com',
    password: '123456',
    avatarUrl: 'https://github.com/manoelvsalgado.png',
    role: 'admin',
  },
  {
    id: 'user-2',
    name: 'João Silva',
    email: 'joao@example.com',
    password: '123456',
    avatarUrl: 'https://ui-avatars.com/api/?name=Jo%C3%A3o%20Silva&background=FF859B&color=232129',
    role: 'user',
  },
  {
    id: 'user-3',
    name: 'Maria Santos',
    email: 'maria@example.com',
    password: '123456',
    avatarUrl: 'https://ui-avatars.com/api/?name=Maria%20Santos&background=FF859B&color=232129',
    role: 'user',
  },
];

function readStorage(key, fallback) {
  const storedValue = localStorage.getItem(key);

  if (!storedValue) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(storedValue);
    
    // Se for array vazia ou null, retorna fallback
    if (Array.isArray(parsed) && parsed.length === 0) {
      return fallback;
    }
    
    return parsed;
  } catch {
    return fallback;
  }
}

function persistUsers(users) {
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
}

function persistCurrentUser(user) {
  if (!user) {
    localStorage.removeItem(STORAGE_KEYS.user);
    return;
  }

  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
}

function createUserId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `user-${Date.now()}`;
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => readStorage(STORAGE_KEYS.users, seedUsers));
  const [user, setUser] = useState(() => readStorage(STORAGE_KEYS.user, null));

  useEffect(() => {
    persistUsers(users);
  }, [users]);

  useEffect(() => {
    persistCurrentUser(user);
  }, [user]);

  function signIn({ email, password }) {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();
    
    const foundUser = users.find(
      existingUser =>
        existingUser.email.toLowerCase() === normalizedEmail &&
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
  }

  function signUp({ name, email, password }) {
    const normalizedEmail = email.trim().toLowerCase();
    const emailAlreadyExists = users.some(
      existingUser => existingUser.email.toLowerCase() === normalizedEmail,
    );

    if (emailAlreadyExists) {
      return {
        success: false,
        message: 'Já existe uma conta com este e-mail.',
      };
    }

    const newUser = {
      id: createUserId(),
      name: name.trim(),
      email: normalizedEmail,
      password,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=FF859B&color=232129`,
      role: 'user',
    };

    setUsers(previousUsers => [...previousUsers, newUser]);
    setUser(newUser);

    return {
      success: true,
    };
  }

  function signOut() {
    setUser(null);
  }

  function updateProfile({ name, email, password, avatarUrl }) {
    if (!user) {
      return {
        success: false,
        message: 'Nenhum usuário autenticado.',
      };
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailAlreadyExists = users.some(
      existingUser =>
        existingUser.id !== user.id &&
        existingUser.email.toLowerCase() === normalizedEmail,
    );

    if (emailAlreadyExists) {
      return {
        success: false,
        message: 'Este e-mail já está em uso.',
      };
    }

    const updatedUser = {
      ...user,
      name: name.trim(),
      email: normalizedEmail,
      password: password || user.password,
      avatarUrl: avatarUrl || user.avatarUrl,
    };

    setUsers(previousUsers =>
      previousUsers.map(existingUser =>
        existingUser.id === updatedUser.id ? updatedUser : existingUser,
      ),
    );
    setUser(updatedUser);

    return {
      success: true,
    };
  }
function createUser({ name, email, password, role = 'user' }) {
    const normalizedEmail = email.trim().toLowerCase();
    const emailAlreadyExists = users.some(
      existingUser => existingUser.email.toLowerCase() === normalizedEmail,
    );

    if (emailAlreadyExists) {
      return {
        success: false,
        message: 'Já existe um usuário com este e-mail.',
        user: null,
      };
    }

    const newUser = {
      id: createUserId(),
      name: name.trim(),
      email: normalizedEmail,
      password,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=FF859B&color=232129`,
      role,
    };

    setUsers(previousUsers => [...previousUsers, newUser]);

    return {
      success: true,
      message: 'Usuário criado com sucesso.',
      user: newUser,
    };
  }

  function updateUser(userId, { name, email, password, role }) {
    const normalizedEmail = email.trim().toLowerCase();
    const emailAlreadyExists = users.some(
      existingUser =>
        existingUser.id !== userId &&
        existingUser.email.toLowerCase() === normalizedEmail,
    );

    if (emailAlreadyExists) {
      return {
        success: false,
        message: 'Este e-mail já está em uso.',
      };
    }

    const updatedUser = {
      ...users.find(u => u.id === userId),
      name: name.trim(),
      email: normalizedEmail,
      password: password || users.find(u => u.id === userId).password,
      role,
    };

    setUsers(previousUsers =>
      previousUsers.map(existingUser =>
        existingUser.id === userId ? updatedUser : existingUser,
      ),
    );

    if (user?.id === userId) {
      setUser(updatedUser);
    }

    return {
      success: true,
      message: 'Usuário atualizado com sucesso.',
    };
  }

  function deleteUser(userId) {
    if (user?.id === userId) {
      return {
        success: false,
        message: 'Você não pode deletar sua própria conta aqui. Use as configurações de perfil.',
      };
    }

    setUsers(previousUsers => previousUsers.filter(u => u.id !== userId));

    return {
      success: true,
      message: 'Usuário deletado com sucesso.',
    };
  }

  function isAdmin() {
    return user?.role === 'admin';
  }

  const value = useMemo(
    () => ({
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
    }),
    [user, users],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
