// pages/RegisterPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import RegisterForm from './components/forms/RegisterForm';

const RegisterPage: React.FC = () => {
  const { role = 'user' } = useParams<{ role: string }>();

  return <RegisterForm role={role} />;
};

export default RegisterPage;
