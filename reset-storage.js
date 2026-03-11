// Script para resetar localStorage e carregar seedUsers
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

// Clear storage
localStorage.removeItem(STORAGE_KEYS.users);
localStorage.removeItem(STORAGE_KEYS.user);

// Set seed users
localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(seedUsers));

console.log('✓ localStorage cleared and seed users loaded');
console.log('Test credentials:');
console.log('Email: manoel@example.com, Password: 123456 (admin)');
console.log('Email: joao@example.com, Password: 123456 (user)');
