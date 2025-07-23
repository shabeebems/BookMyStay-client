import React from 'react';
import AuthLayout from './components/layout/AuthLayout';
import LoginForm from './components/forms/LoginForm';
import { useParams } from 'react-router-dom';

const Login: React.FC = () => {
  const { role = '' } = useParams<{ role: string }>();

  return (
    <AuthLayout>
      <LoginForm role={role} />
    </AuthLayout>
  );
};

export default Login;
