const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    try {
      const payload = await response.json();
      throw new Error(payload.message || 'Falha na comunicação com a API.');
    } catch {
      throw new Error('Falha na comunicação com a API.');
    }
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function requestWithAuth(path, getToken, options = {}) {
  const token = await getToken();

  if (!token) {
    throw new Error('Sessão inválida. Faça login novamente.');
  }

  return request(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
}

export const usersApi = {
  list: () => request('/users'),
  create: payload => request('/users', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  remove: id => request(`/users/${id}`, { method: 'DELETE' }),
};

export const moviesApi = {
  list: () => request('/movies'),
  create: payload => request('/movies', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/movies/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  remove: id => request(`/movies/${id}`, { method: 'DELETE' }),
};

export const adminUsersApi = {
  list: getToken => requestWithAuth('/admin/users', getToken),
  create: (payload, getToken) =>
    requestWithAuth('/admin/users', getToken, { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload, getToken) =>
    requestWithAuth(`/admin/users/${id}`, getToken, { method: 'PATCH', body: JSON.stringify(payload) }),
  remove: (id, getToken) => requestWithAuth(`/admin/users/${id}`, getToken, { method: 'DELETE' }),
};
