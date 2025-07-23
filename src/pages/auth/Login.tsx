import React from 'react';
import AuthLayout from './components/layout/AuthLayout';
import LoginForm from './components/forms/LoginForm';

type LoginProps = {
  role: string;
};

const Login: React.FC<LoginProps> = ({ role }) => {
  return (
    <AuthLayout>
      <LoginForm role={role} />
    </AuthLayout>
  );
};

export default Login;
