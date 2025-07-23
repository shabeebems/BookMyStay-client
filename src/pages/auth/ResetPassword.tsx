import React from 'react';
import AuthLayout from './components/layout/AuthLayout';
import ResetPasswordForm from './components/forms/ResetPasswordForm';

const ResetPassword: React.FC = () => {
  return (
    <AuthLayout>
      <ResetPasswordForm />
    </AuthLayout>
  );
};

export default ResetPassword;
