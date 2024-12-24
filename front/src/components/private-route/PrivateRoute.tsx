import React, { useEffect, useState } from "react";
import { RouteProps, Outlet, Navigate } from "react-router-dom";
import { acquireToken } from "../../auth/auth-utils";
import Loader from "../loader/Loader";
import { routes } from "../../routes";

const PrivateRoute: React.FC<RouteProps> = () => {
  const [isConnected, setIsConnected] = useState<boolean | undefined>(
    undefined
  );

  useEffect(() => {
    acquireToken().then((value) => setIsConnected(!!value));
  }, []);

  if (isConnected === undefined) {
    return <Loader />;
  }

  if (!isConnected) {
    return <Navigate to={routes.signin} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
