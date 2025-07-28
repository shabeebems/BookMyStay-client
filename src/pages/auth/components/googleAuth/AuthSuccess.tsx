import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AuthSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      navigate('/');
    } else {
      navigate('/login/user');
    }
  }, [location, navigate]);

  return <div>Logging in with Google...</div>;
};

export default AuthSuccess;
