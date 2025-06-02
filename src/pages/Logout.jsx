import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';

function Logout() {
  useEffect(() => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
  }, []);

  return <Navigate to="/login" />;
}

export default Logout;
