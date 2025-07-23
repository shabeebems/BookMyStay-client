import React from 'react';
import { useParams } from 'react-router-dom';
import OtpForm from './components/forms/OtpForm';

const OtpPage: React.FC = () => {
  const { email = '', role = '' } = useParams<{ email: string; role: string }>();
  console.log(role)
  return <OtpForm email={email} role={role} />;
};

export default OtpPage;
