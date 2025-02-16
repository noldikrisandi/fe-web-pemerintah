import { Navigate } from "react-router-dom";
import { getDataWithExpiry } from "../utils/StorageHelper";

const PrivateRoute = ({ element }) => {
  const token = getDataWithExpiry("token"); // Ambil token

  if (!token) {
    return <Navigate to="/login" />;
  }

  return element;
};

export default PrivateRoute;
