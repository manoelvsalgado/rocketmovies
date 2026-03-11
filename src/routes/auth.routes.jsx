import { Navigate, Route, Routes } from 'react-router-dom';
import { SignIn } from '../pages/SignIn';

export function AuthRoutes(){
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}