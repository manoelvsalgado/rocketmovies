import { BrowserRouter } from 'react-router-dom';

import { AppRoutes } from './app.routes';
import { AuthRoutes } from './auth.routes';
import { useAuth } from '../contexts/AuthContext';

export function Routes() {
  const { user } = useAuth();

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      {user ? <AppRoutes /> : <AuthRoutes />}
    </BrowserRouter>
  )
}