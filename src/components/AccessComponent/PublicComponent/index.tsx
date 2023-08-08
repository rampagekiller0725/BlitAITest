import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAppSelector } from "state/hooks";
import { selectIsAuthenticated } from "state/reducers/authSlice";

interface PublicComponentProps {
  children: ReactNode;
  redirectPath?: string;
}

const PublicComponent = ({
  children,
  redirectPath = "/projects",
}: PublicComponentProps) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }
  return <>{children}</>;
};

export default PublicComponent;
