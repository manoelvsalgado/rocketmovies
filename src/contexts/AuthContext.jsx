import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, profilesDb } from '../services/supabase';

const AuthContext = createContext({});

const STORAGE_KEY = '@rocketmovies:user';
const DEFAULT_ROLE = 'user';
const DEMO_USER = {
  id: 'demo-user',
  name: 'Visitante Demo',
  email: 'demo@rocketmovies.app',
  avatarUrl: buildAvatarUrl('Visitante Demo'),
  role: 'user',
};

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

function mapAuthUser(authUser, profile = null) {
  if (!authUser) {
    return null;
  }

  const fallbackName = authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Usuário';
  const fallbackAvatarUrl = authUser.user_metadata?.avatarUrl || buildAvatarUrl(fallbackName);

  return {
    id: authUser.id,
    name: profile?.name || fallbackName,
    email: profile?.email || authUser.email,
    avatarUrl: profile?.avatarUrl || fallbackAvatarUrl,
    role: profile?.role || DEFAULT_ROLE,
  };
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(readStoredUser);

  async function hydrateUser(authUser) {
    if (!authUser) {
      return null;
    }

    try {
      const profile = await profilesDb.getById(authUser.id);
      return mapAuthUser(authUser, profile);
    } catch {
      return mapAuthUser(authUser);
    }
  }

  useEffect(() => {
    persistCurrentUser(user);
  }, [user]);

  useEffect(() => {
    const storedUser = readStoredUser();

    if (storedUser?.id === DEMO_USER.id) {
      setUser(storedUser);
      return undefined;
    }

    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(await hydrateUser(session?.user));
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      hydrateUser(session?.user).then(setUser);
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

      setUser(await hydrateUser(data.user));
      return { success: true };
    } catch {
      return { success: false, message: 'Falha ao acessar a autenticação.' };
    }
  }

  async function signUp({ name, email, password }) {
    try {
      const trimmedName = name.trim();
      const normalizedEmail = normalizeEmail(email);

      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: password.trim(),
        options: {
          data: {
            name: trimmedName,
            avatarUrl: buildAvatarUrl(trimmedName),
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
          email: normalizedEmail,
          avatarUrl: buildAvatarUrl(trimmedName),
          role: DEFAULT_ROLE,
        });
      }

      setUser(await hydrateUser(data.user));
      return { success: true };
    } catch {
      return { success: false, message: 'Falha ao criar conta.' };
    }
  }

  function signInDemo() {
    setUser(DEMO_USER);
    return { success: true };
  }

  async function signOut() {
    if (user?.id === DEMO_USER.id) {
      setUser(null);
      return;
    }

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

      await profilesDb.update(user.id, {
        name: trimmedName,
        email: payload.email || user.email,
        avatarUrl: nextAvatarUrl,
      });

      setUser(await hydrateUser(data.user));
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
    signInDemo,
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
