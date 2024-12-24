import { TokenSharp } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { RouteProps, Outlet, Navigate } from "react-router-dom";
import { acquireToken } from "../../auth/auth-utils";
import { routes } from "../../routes";
import Loader from "../loader/Loader";

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

  // if (!isConnected) {
  //   return <Navigate to={routes.signin} replace />;
  // }

  return <Outlet />;
};

export default PrivateRoute;
