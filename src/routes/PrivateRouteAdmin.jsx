import { Navigate } from "react-router-dom";

const PrivateRouteAdmin = ({ element }) => {
  const adminToken = localStorage.getItem("admin_token");

  if (!adminToken) {
    return <Navigate to="/loginAdmin" />;
  }

  return element;
};

export default PrivateRouteAdmin;
