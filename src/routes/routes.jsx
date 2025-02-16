import PrivateRoute from "./PrivateRoute"; // Pastikan hanya mengimpor
import { lazy } from "react";
import AspirasiList from "../pages/AspirasiList";
import EditAspiration from "../pages/EditAspirasi";
import AddAspirasi from "../pages/AddAspiration";
import LoginAdmin from "../pages/LoginAdmin";

// Lazy load pages
const Home = lazy(() => import("../pages/Home"));
const NotFound = lazy(() => import("../pages/NotFound"));
const UsersPage = lazy(() => import("../pages/Users"));
const RegisterUser = lazy(() => import("../pages/RegisterUsers"));
const LoginUser = lazy(() => import("../pages/LoginUser"));
const FormAspirasi = lazy(() => import("../pages/FormAspirasi"));
const SemuaAspirasi = lazy(() => import("../pages/SemuaAspirasi"));
const ProfileUser = lazy(() => import("../pages/ProfileUser"));
const MyAspiration = lazy(() => import("../pages/MyAspiration"));

// Daftar route
const routes = [
  { path: "/", element: <PrivateRoute element={<Home />} /> },
  { path: "/users", element: <UsersPage /> },
  { path: "*", element: <NotFound /> },
  { path: "/register", element: <RegisterUser /> },
  { path: "/login", element: <LoginUser /> },
  { path: "/loginAdmin", element: <LoginAdmin /> },
  { path: "/inputaspirasi", element: <PrivateRoute element={<FormAspirasi />} /> },
  { path: "/aspirasilist", element: <PrivateRoute element={<AspirasiList />} /> },
  { path: "/editaspirasi", element: <PrivateRoute element={<EditAspiration />} /> },
  { path: "/addaspirasi", element: <PrivateRoute element={<AddAspirasi />} /> },
  { path: "/semuaaspirasi", element: <PrivateRoute element={<SemuaAspirasi />} /> },
  { path: "/profil", element: <PrivateRoute element={<ProfileUser />} /> },
  { path: "/aspirasisaya", element: <PrivateRoute element={<MyAspiration />} /> },
];

export default routes;
