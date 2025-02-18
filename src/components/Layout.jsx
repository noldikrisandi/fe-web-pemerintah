import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./Navbar";
import { getDataWithExpiry } from "../utils/StorageHelper";

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const hideNavbar = location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/loginadmin" || location.pathname === "/aspirasilist" || location.pathname === "/registeradmin";

  useEffect(() => {
    if (location.pathname === "/register") return; 

    if (location.pathname === "/loginadmin") return; 

    const userToken = getDataWithExpiry("user_token");
    const adminToken = getDataWithExpiry("admin_token");

    if (!userToken && !adminToken) {
      console.log("Token expired, redirecting to login...");
      navigate("/login"); 
    }
  }, [navigate, location.pathname]);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main>{children}</main>
    </>
  );
};

export default Layout;
