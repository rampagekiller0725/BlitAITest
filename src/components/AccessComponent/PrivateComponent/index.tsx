import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { selectIsAuthenticated } from "state/reducers/authSlice";
import { useAppSelector } from "state/hooks";

interface PrivateComponentProps {
  children: ReactNode;
  redirectPath?: string;
}

const PrivateComponent = ({
  children,
  redirectPath = "/",
}: PrivateComponentProps) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  if (isAuthenticated) {
    return <>{children}</>;
  }
  return <Navigate to={redirectPath} replace />;
};

export default PrivateComponent;
