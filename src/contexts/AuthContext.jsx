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
  },
];

function readStorage(key, fallback) {
  const storedValue = localStorage.getItem(key);

  if (!storedValue) {
    return fallback;
  }

  try {
    return JSON.parse(storedValue);
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
    const foundUser = users.find(
      existingUser =>
        existingUser.email.toLowerCase() === normalizedEmail &&
        existingUser.password === password,
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

  const value = useMemo(
    () => ({
      user,
      users,
      signIn,
      signOut,
      signUp,
      updateProfile,
    }),
    [user, users],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
