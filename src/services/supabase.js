import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
);

function mapProfile(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    avatarUrl: row.avatar_url,
    role: row.role,
    createdAt: row.created_at,
  };
}

function mapMovie(row) {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    rating: Number(row.rating),
    description: row.description,
    tags: Array.isArray(row.tags) ? row.tags : [],
    createdAt: row.created_at,
  };
}

function sdThrow(error) {
  throw new Error(error?.message || 'Erro ao comunicar com o Supabase.');
}

export const moviesDb = {
  async list() {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) sdThrow(error);
    return data.map(mapMovie);
  },

  async create({ title, rating, description, tags }) {
    const { data, error } = await supabase
      .from('movies')
      .insert({ title, rating, description, tags })
      .select()
      .single();

    if (error) sdThrow(error);
    return mapMovie(data);
  },

  async update(id, { title, rating, description, tags }) {
    const { data, error } = await supabase
      .from('movies')
      .update({ title, rating, description, tags })
      .eq('id', id)
      .select()
      .single();

    if (error) sdThrow(error);
    return mapMovie(data);
  },

  async remove(id) {
    const { error } = await supabase.from('movies').delete().eq('id', id);
    if (error) sdThrow(error);
  },
};

export const profilesDb = {
  async getById(id) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) sdThrow(error);
    return data ? mapProfile(data) : null;
  },

  async list() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) sdThrow(error);
    return data.map(mapProfile);
  },

  async upsert({ id, name, email, avatarUrl, role }) {
    const { error } = await supabase.from('profiles').upsert(
      { id, name, email, avatar_url: avatarUrl, role },
      { onConflict: 'id' },
    );

    if (error) sdThrow(error);
  },

  async update(id, { name, email, avatarUrl }) {
    const { error } = await supabase
      .from('profiles')
      .update({ name, email, avatar_url: avatarUrl })
      .eq('id', id);

    if (error) sdThrow(error);
  },
};

export const emailDb = {
  async sendWelcomeEmail({ name, toEmail }) {
    const { error } = await supabase.functions.invoke('send-welcome-email', {
      body: {
        name,
        toEmail,
      },
    });

    if (error) sdThrow(error);
  },
};
