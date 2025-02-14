import { lazy } from "react";

// Lazy load pages
const Home = lazy(() => import("../pages/Home"));
const NotFound = lazy(() => import("../pages/NotFound"));
const UsersPage = lazy(() => import("../pages/Users"));
const RegisterUser = lazy(() => import("../pages/RegisterUsers"));
const LoginUser = lazy(() => import("../pages/LoginUser"))
// const LoginPage = lazy(() => import("../pages/LoginPage"));

// Daftar route
const routes = [
  { path: "/", element: <Home /> },
  { path: "/users", element: <UsersPage /> },
  { path: "*", element: <NotFound /> },
  { path: "/register", element: <RegisterUser /> },
  {path: "/login", element: <LoginUser/>},
];

export default routes;
