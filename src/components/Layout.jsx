import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./Navbar";
import { getDataWithExpiry } from "../utils/StorageHelper";

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const hideNavbar = location.pathname === "/login" || location.pathname === "/register";

  useEffect(() => {
    const token = getDataWithExpiry("token");

    if (!token) {
      console.log("Token expired, redirecting to login...");
      navigate("/login"); // Redirect hanya di halaman yang butuh auth
    }
  }, [navigate]);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main>{children}</main>
    </>
  );
};

export default Layout;
