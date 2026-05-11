import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Auth";

const ProtectedRoute = ({ children, rolesPermitidos }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!rolesPermitidos.includes(user.role)) {
    return <Navigate to="/no-autorizado" />;
  }

  return children;
};

export default ProtectedRoute;
