import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './styles/global';

import theme from './styles/theme';

import { Routes } from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { MoviesProvider } from './contexts/MoviesContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <MoviesProvider>
          <GlobalStyle />
          <Routes />
        </MoviesProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
)