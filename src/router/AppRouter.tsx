import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "../features/auth/ProtectedRoute";
import ErrorPage from "../pages/ErrorPage";
import AdminLayout from "../layouts/AdminLayout";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Staff from "../pages/Staff";
import Customer from "../pages/Customer";
import Permission from "../pages/Permission";
import Role from "../pages/Role";
import Profile from "../pages/Profile";
import Item from "../pages/Item";
import Product from "../pages/Product";

const router = createBrowserRouter([
  {
    element: <Login />,
    path: "/login",
  },
  {
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        index: true,
        element: <Dashboard />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "staffs",
        element: <Staff />,
      },
      {
        path: "customers",
        element: <Customer />,
      },
      {
        path: "roles",
        element: <Role />,
      },
      {
        path: "permissions",
        element: <Permission />,
      },
      {
        path: "items",
        element: <Item />,
      },
      {
        path: "items/:id",
        element: <div>Item Detail</div>,
      },
      {
        path: "products",
        element: <Product />,
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
