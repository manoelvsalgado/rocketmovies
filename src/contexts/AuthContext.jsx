import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { adminUsersApi } from '../services/api';

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

function mapAuthUser(authUser) {
  if (!authUser) {
    return null;
  }

  const name = authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Usuário';
  const avatarUrl = authUser.user_metadata?.avatarUrl || buildAvatarUrl(name);

  return {
    id: authUser.id,
    name,
    email: authUser.email,
    avatarUrl,
    role: authUser.user_metadata?.role || DEFAULT_ROLE,
  };
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(readStoredUser);

  const getAccessToken = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    return session?.access_token || null;
  }, []);

  const refreshUsers = useCallback(async () => {
    const usersFromApi = await adminUsersApi.list(getAccessToken);
    setUsers(usersFromApi);
    return usersFromApi;
  }, [getAccessToken]);

  useEffect(() => {
    persistCurrentUser(user);
  }, [user]);

  useEffect(() => {
    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(mapAuthUser(session?.user) || null);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(mapAuthUser(session?.user) || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    async function syncAdminUsers() {
      if (!user || user.role !== 'admin') {
        setUsers([]);
        return;
      }

      try {
        await refreshUsers();
      } catch {
        window.alert('Não foi possível carregar os usuários da API admin.');
      }
    }

    syncAdminUsers();
  }, [user, refreshUsers]);

  async function signIn({ email, password }) {
    try {
      const normalizedEmail = normalizeEmail(email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: password.trim(),
      });

      if (error || !data.user) {
        return {
          success: false,
          message: 'E-mail ou senha inválidos.',
        };
      }

      setUser(mapAuthUser(data.user));

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
      const normalizedEmail = normalizeEmail(email);

      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: password.trim(),
        options: {
          data: {
            name: name.trim(),
            avatarUrl: buildAvatarUrl(name),
            role: DEFAULT_ROLE,
          },
        },
      });

      if (error) {
        return {
          success: false,
          message: error.message,
        };
      }

      setUser(mapAuthUser(data.user));

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

  async function signOut() {
    await supabase.auth.signOut();
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
      const payload = {
        data: {
          name: name.trim(),
          avatarUrl: avatarUrl?.trim() || user.avatarUrl,
          role: user.role || DEFAULT_ROLE,
        },
      };

      if (email && normalizeEmail(email) !== normalizeEmail(user.email)) {
        payload.email = normalizeEmail(email);
      }

      if (password?.trim()) {
        payload.password = password.trim();
      }

      const { data, error } = await supabase.auth.updateUser(payload);

      if (error) {
        return {
          success: false,
          message: error.message,
        };
      }

      setUser(mapAuthUser(data.user));

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
      const newUser = await adminUsersApi.create(
        {
          name: name.trim(),
          email: normalizeEmail(email),
          password: password.trim(),
          role,
          avatarUrl: buildAvatarUrl(name),
        },
        getAccessToken,
      );

      await refreshUsers();

      return {
        success: true,
        message: 'Usuário criado com sucesso.',
        user: newUser,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Falha ao criar usuário na API admin.',
        user: null,
      };
    }
  }

  async function updateUser(userId, { name, email, password, role }) {
    try {
      await adminUsersApi.update(
        userId,
        {
          name: name.trim(),
          email: normalizeEmail(email),
          password: password?.trim() || undefined,
          role,
        },
        getAccessToken,
      );

      await refreshUsers();

      if (user?.id === userId) {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(mapAuthUser(session?.user));
      }

      return {
        success: true,
        message: 'Usuário atualizado com sucesso.',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Falha ao atualizar usuário na API admin.',
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
      await adminUsersApi.remove(userId, getAccessToken);
      await refreshUsers();

      return {
        success: true,
        message: 'Usuário deletado com sucesso.',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Falha ao deletar usuário na API admin.',
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
