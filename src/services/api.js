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
    throw new Error('Falha na comunicação com a API.');
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
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
  remove: id => request(`/movies/${id}`, { method: 'DELETE' }),
};
