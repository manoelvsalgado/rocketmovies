import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, profilesDb } from '../services/supabase';

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
    async function loadProfiles() {
      if (!user || user.role !== 'admin') {
        setUsers([]);
        return;
      }

      try {
        const profiles = await profilesDb.list();
        setUsers(profiles);
      } catch {
        window.alert('Não foi possível carregar os usuários.');
      }
    }

    loadProfiles();
  }, [user]);

  async function signIn({ email, password }) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizeEmail(email),
        password: password.trim(),
      });

      if (error || !data.user) {
        return { success: false, message: 'E-mail ou senha inválidos.' };
      }

      setUser(mapAuthUser(data.user));
      return { success: true };
    } catch {
      return { success: false, message: 'Falha ao acessar a autenticação.' };
    }
  }

  async function signUp({ name, email, password }) {
    try {
      const trimmedName = name.trim();
      const { data, error } = await supabase.auth.signUp({
        email: normalizeEmail(email),
        password: password.trim(),
        options: {
          data: {
            name: trimmedName,
            avatarUrl: buildAvatarUrl(trimmedName),
            role: DEFAULT_ROLE,
          },
        },
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (data.user) {
        await profilesDb.upsert({
          id: data.user.id,
          name: trimmedName,
          email: normalizeEmail(email),
          avatarUrl: buildAvatarUrl(trimmedName),
          role: DEFAULT_ROLE,
        });
      }

      setUser(mapAuthUser(data.user));
      return { success: true };
    } catch {
      return { success: false, message: 'Falha ao criar conta.' };
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  async function updateProfile({ name, email, password, avatarUrl }) {
    if (!user) {
      return { success: false, message: 'Nenhum usuário autenticado.' };
    }

    try {
      const trimmedName = name.trim();
      const nextAvatarUrl = avatarUrl?.trim() || user.avatarUrl;

      const payload = {
        data: {
          name: trimmedName,
          avatarUrl: nextAvatarUrl,
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
        return { success: false, message: error.message };
      }

      const updatedUser = mapAuthUser(data.user);
      setUser(updatedUser);

      await profilesDb.upsert({
        id: updatedUser.id,
        name: trimmedName,
        email: updatedUser.email,
        avatarUrl: nextAvatarUrl,
        role: updatedUser.role,
      });

      return { success: true };
    } catch {
      return { success: false, message: 'Falha ao atualizar perfil.' };
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
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
