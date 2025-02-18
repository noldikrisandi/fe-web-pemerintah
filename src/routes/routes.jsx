import PrivateRoute from "./PrivateRoute";
import PrivateRouteAdmin from "./PrivateRouteAdmin";
import { lazy } from "react";
import AspirasiList from "../pages/AspirasiList";
import LoginAdmin from "../pages/LoginAdmin";
import RegisterAdmin from "../pages/RegisterAdmin";
import AdminControllerList from "../pages/AdminControllerList";
// import Edit from "../pages/edit"; tidak saya fungsikan dulu


const Home = lazy(() => import("../pages/Home"));
const NotFound = lazy(() => import("../pages/NotFound"));
const UsersPage = lazy(() => import("../pages/Users"));
const RegisterUser = lazy(() => import("../pages/RegisterUsers"));
const LoginUser = lazy(() => import("../pages/LoginUser"));
const FormAspirasi = lazy(() => import("../pages/FormAspirasi"));
const SemuaAspirasi = lazy(() => import("../pages/SemuaAspirasi"));
const ProfileUser = lazy(() => import("../pages/ProfileUser"));
const MyAspiration = lazy(() => import("../pages/MyAspiration"));


const routes = [
  { path: "/", element: <PrivateRoute element={<Home />} /> },
  { path: "/users", element: <UsersPage /> },
  { path: "*", element: <NotFound /> },
  { path: "/register", element: <RegisterUser /> },
  { path: "/loginAdmin", element: <LoginAdmin /> },
  { path: "/login", element: <LoginUser /> },
  { path: "/inputaspirasi", element: <PrivateRoute element={<FormAspirasi />} /> },
  { path: "/semuaaspirasi", element: <PrivateRoute element={<SemuaAspirasi />} /> },
  { path: "/profil", element: <PrivateRoute element={<ProfileUser />} /> },
  { path: "/aspirasisaya", element: <PrivateRoute element={<MyAspiration />} /> },
  { path: "/aspirasilist", element: <PrivateRouteAdmin element={<AspirasiList />} /> },
  { path: "/registeradmin", element: <PrivateRouteAdmin element={<RegisterAdmin />} /> },
  { path: "/admincontrollerlist", element: <PrivateRouteAdmin element={<AdminControllerList />} /> },
  // { path: "/edit", element: <PrivateRouteAdmin element={<Edit />} /> }, tidak saya fungsikan dulu
];

export default routes;
