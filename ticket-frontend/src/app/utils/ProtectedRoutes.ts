import  { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
    element: React.ReactNode;
    requiredRole: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, requiredRole }) => {
  const navigate = useNavigate();
  const authRole = localStorage.getItem('userType')
  useEffect(() => {
    // Check if the user's role matches the required role
    if (authRole !== requiredRole && authRole !== 'admin') {
      localStorage.clear()
      navigate('/'); 
    }
  }, [authRole, requiredRole, navigate]);

  return authRole === requiredRole || 'admin' ? element : null;
};

export default ProtectedRoute;
