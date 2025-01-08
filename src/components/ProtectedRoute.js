// components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const getLoggedUser = () => {
    try {
      const user = localStorage.getItem("loggedUser");
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  };

  const loggedUser = getLoggedUser();

  if (!loggedUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
