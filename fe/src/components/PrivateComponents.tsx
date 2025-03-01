// src/components/PrivateRoute.tsx
import { Navigate } from "react-router";
import { isAuthenticated } from "../../utils/auth";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
