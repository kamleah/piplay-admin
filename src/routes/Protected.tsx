import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
function Protected({ path, children }) {
  const token = localStorage.getItem("auth");
  const location = useLocation();
  return token ? (
    <Outlet />
  ) : (
    <Navigate to="/Login" state={{ from: location }} replace />
  );
}
export default Protected;
