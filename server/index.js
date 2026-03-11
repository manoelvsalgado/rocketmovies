import cors from 'cors';
import express from 'express';
import sqlite3 from 'sqlite3';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const app = express();
const PORT = Number(process.env.PORT || 3001);
const DB_PATH = resolve(process.cwd(), 'server', 'data', 'rocketmovies.sqlite');
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdmin =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    : null;

mkdirSync(dirname(DB_PATH), { recursive: true });

const db = new sqlite3.Database(DB_PATH);

function run(query, params = []) {
  return new Promise((resolvePromise, rejectPromise) => {
    db.run(query, params, function onRun(error) {
      if (error) {
        rejectPromise(error);
        return;
      }

      resolvePromise({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function get(query, params = []) {
  return new Promise((resolvePromise, rejectPromise) => {
    db.get(query, params, (error, row) => {
      if (error) {
        rejectPromise(error);
        return;
      }

      resolvePromise(row || null);
    });
  });
}

function all(query, params = []) {
  return new Promise((resolvePromise, rejectPromise) => {
    db.all(query, params, (error, rows) => {
      if (error) {
        rejectPromise(error);
        return;
      }

      resolvePromise(rows || []);
    });
  });
}

function parseTags(rawTags) {
  if (!rawTags) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawTags);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function toMoviePayload(movieRow) {
  return {
    id: movieRow.id,
    title: movieRow.title,
    rating: Number(movieRow.rating),
    description: movieRow.description,
    tags: parseTags(movieRow.tags),
    createdAt: movieRow.createdAt,
  };
}

function mapSupabaseUser(authUser) {
  const name = authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Usuário';

  return {
    id: authUser.id,
    name,
    email: authUser.email,
    avatarUrl: authUser.user_metadata?.avatarUrl || '',
    role: authUser.user_metadata?.role || 'user',
    createdAt: authUser.created_at,
  };
}

function getBearerToken(request) {
  const authHeader = request.headers.authorization || '';

  if (!authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.slice(7);
}

function ensureSupabaseConfig(response) {
  if (supabaseAdmin) {
    return true;
  }

  response.status(500).json({
    message: 'Supabase não configurado no servidor. Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.',
  });

  return false;
}

async function requireAdmin(request, response, next) {
  if (!ensureSupabaseConfig(response)) {
    return;
  }

  const token = getBearerToken(request);

  if (!token) {
    response.status(401).json({ message: 'Token de autenticação não informado.' });
    return;
  }

  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
    response.status(401).json({ message: 'Token inválido.' });
    return;
  }

  if (user.user_metadata?.role !== 'admin') {
    response.status(403).json({ message: 'Acesso restrito a administradores.' });
    return;
  }

  request.currentUser = user;
  next();
}

async function ensureSchema() {
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      avatarUrl TEXT,
      role TEXT NOT NULL DEFAULT 'member',
      createdAt TEXT NOT NULL
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS movies (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      rating REAL NOT NULL,
      description TEXT NOT NULL,
      tags TEXT NOT NULL DEFAULT '[]',
      createdAt TEXT NOT NULL
    );
  `);
}

app.use(cors());
app.use(express.json());

app.get('/health', (_, response) => {
  response.json({ status: 'ok' });
});

app.get('/admin/users', requireAdmin, async (_, response) => {
  const {
    data: { users },
    error,
  } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });

  if (error) {
    response.status(500).json({ message: 'Falha ao listar usuários do Supabase.' });
    return;
  }

  response.json(users.map(mapSupabaseUser));
});

app.post('/admin/users', requireAdmin, async (request, response) => {
  const { name, email, password, role = 'user', avatarUrl = '' } = request.body;

  if (!name?.trim() || !email?.trim() || !password?.trim()) {
    response.status(400).json({ message: 'Nome, e-mail e senha são obrigatórios.' });
    return;
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: email.trim().toLowerCase(),
    password: password.trim(),
    email_confirm: true,
    user_metadata: {
      name: name.trim(),
      role,
      avatarUrl,
    },
  });

  if (error || !data.user) {
    response.status(400).json({ message: error?.message || 'Falha ao criar usuário.' });
    return;
  }

  response.status(201).json(mapSupabaseUser(data.user));
});

app.patch('/admin/users/:id', requireAdmin, async (request, response) => {
  const { id } = request.params;
  const { name, email, password, role, avatarUrl } = request.body;

  const {
    data: { user: existingUser },
    error: existingError,
  } = await supabaseAdmin.auth.admin.getUserById(id);

  if (existingError || !existingUser) {
    response.status(404).json({ message: 'Usuário não encontrado.' });
    return;
  }

  const payload = {
    email: email?.trim().toLowerCase() || existingUser.email,
    user_metadata: {
      ...existingUser.user_metadata,
      name: name?.trim() || existingUser.user_metadata?.name,
      role: role || existingUser.user_metadata?.role || 'user',
      avatarUrl: avatarUrl ?? existingUser.user_metadata?.avatarUrl ?? '',
    },
  };

  if (password?.trim()) {
    payload.password = password.trim();
  }

  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(id, payload);

  if (error || !data.user) {
    response.status(400).json({ message: error?.message || 'Falha ao atualizar usuário.' });
    return;
  }

  response.json(mapSupabaseUser(data.user));
});

app.delete('/admin/users/:id', requireAdmin, async (request, response) => {
  const { id } = request.params;

  if (request.currentUser?.id === id) {
    response.status(400).json({ message: 'Você não pode deletar sua própria conta.' });
    return;
  }

  const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

  if (error) {
    response.status(400).json({ message: error.message || 'Falha ao remover usuário.' });
    return;
  }

  response.status(204).send();
});

app.get('/users', async (_, response) => {
  const users = await all(
    'SELECT id, name, email, password, avatarUrl, role, createdAt FROM users ORDER BY createdAt DESC',
  );

  response.json(users);
});

app.post('/users', async (request, response) => {
  const { name, email, password, avatarUrl = '', role = 'member' } = request.body;

  if (!name?.trim() || !email?.trim() || !password?.trim()) {
    response.status(400).json({ message: 'Nome, e-mail e senha são obrigatórios.' });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await get('SELECT id FROM users WHERE LOWER(email) = ?', [normalizedEmail]);

  if (existingUser) {
    response.status(409).json({ message: 'Já existe um usuário com este e-mail.' });
    return;
  }

  const id = randomUUID();
  const createdAt = new Date().toISOString();

  await run(
    `
      INSERT INTO users (id, name, email, password, avatarUrl, role, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [id, name.trim(), normalizedEmail, password.trim(), avatarUrl, role, createdAt],
  );

  const newUser = await get(
    'SELECT id, name, email, password, avatarUrl, role, createdAt FROM users WHERE id = ?',
    [id],
  );

  response.status(201).json(newUser);
});

app.patch('/users/:id', async (request, response) => {
  const { id } = request.params;
  const currentUser = await get('SELECT * FROM users WHERE id = ?', [id]);

  if (!currentUser) {
    response.status(404).json({ message: 'Usuário não encontrado.' });
    return;
  }

  const nextName = request.body.name?.trim() || currentUser.name;
  const nextEmail = (request.body.email || currentUser.email).trim().toLowerCase();
  const nextPassword = request.body.password?.trim() || currentUser.password;
  const nextAvatarUrl = request.body.avatarUrl ?? currentUser.avatarUrl;
  const nextRole = request.body.role || currentUser.role;

  const emailInUse = await get('SELECT id FROM users WHERE LOWER(email) = ? AND id <> ?', [nextEmail, id]);

  if (emailInUse) {
    response.status(409).json({ message: 'Este e-mail já está em uso.' });
    return;
  }

  await run(
    `
      UPDATE users
      SET name = ?, email = ?, password = ?, avatarUrl = ?, role = ?
      WHERE id = ?
    `,
    [nextName, nextEmail, nextPassword, nextAvatarUrl, nextRole, id],
  );

  const updatedUser = await get(
    'SELECT id, name, email, password, avatarUrl, role, createdAt FROM users WHERE id = ?',
    [id],
  );

  response.json(updatedUser);
});

app.delete('/users/:id', async (request, response) => {
  const { id } = request.params;
  const result = await run('DELETE FROM users WHERE id = ?', [id]);

  if (!result.changes) {
    response.status(404).json({ message: 'Usuário não encontrado.' });
    return;
  }

  response.status(204).send();
});

app.get('/movies', async (_, response) => {
  const movies = await all('SELECT * FROM movies ORDER BY createdAt DESC');
  response.json(movies.map(toMoviePayload));
});

app.post('/movies', async (request, response) => {
  const { title, rating, description, tags = [], createdAt } = request.body;

  if (!title?.trim() || !description?.trim() || Number.isNaN(Number(rating))) {
    response.status(400).json({ message: 'Título, nota e descrição são obrigatórios.' });
    return;
  }

  const id = randomUUID();
  const createdAtValue = createdAt || new Date().toISOString();

  await run(
    `
      INSERT INTO movies (id, title, rating, description, tags, createdAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    [id, title.trim(), Number(rating), description.trim(), JSON.stringify(tags), createdAtValue],
  );

  const newMovie = await get('SELECT * FROM movies WHERE id = ?', [id]);
  response.status(201).json(toMoviePayload(newMovie));
});

app.patch('/movies/:id', async (request, response) => {
  const { id } = request.params;
  const currentMovie = await get('SELECT * FROM movies WHERE id = ?', [id]);

  if (!currentMovie) {
    response.status(404).json({ message: 'Filme não encontrado.' });
    return;
  }

  const nextTitle = request.body.title?.trim() || currentMovie.title;
  const nextRating =
    request.body.rating !== undefined ? Number(request.body.rating) : Number(currentMovie.rating);
  const nextDescription = request.body.description?.trim() || currentMovie.description;
  const nextTags = Array.isArray(request.body.tags)
    ? request.body.tags.filter(Boolean)
    : parseTags(currentMovie.tags);

  if (Number.isNaN(nextRating)) {
    response.status(400).json({ message: 'A nota deve ser um número válido.' });
    return;
  }

  await run(
    `
      UPDATE movies
      SET title = ?, rating = ?, description = ?, tags = ?
      WHERE id = ?
    `,
    [nextTitle, nextRating, nextDescription, JSON.stringify(nextTags), id],
  );

  const updatedMovie = await get('SELECT * FROM movies WHERE id = ?', [id]);
  response.json(toMoviePayload(updatedMovie));
});

app.delete('/movies/:id', async (request, response) => {
  const { id } = request.params;
  const result = await run('DELETE FROM movies WHERE id = ?', [id]);

  if (!result.changes) {
    response.status(404).json({ message: 'Filme não encontrado.' });
    return;
  }

  response.status(204).send();
});

app.use((error, _, response, __) => {
  console.error(error);
  response.status(500).json({ message: 'Erro interno da API.' });
});

ensureSchema()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API persistente em http://localhost:${PORT}`);
      console.log(`SQLite database: ${DB_PATH}`);
    });
  })
  .catch(error => {
    console.error('Falha ao iniciar API:', error);
    process.exit(1);
  });
