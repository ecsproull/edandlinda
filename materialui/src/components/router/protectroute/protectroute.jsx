import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/authentication';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading, hasAnyRole } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // If allowedRoles is specified, check if user has any of the allowed roles
  if (allowedRoles.length > 0 && !hasAnyRole(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}