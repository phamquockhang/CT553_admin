import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "../features/auth/ProtectedRoute";
import ErrorPage from "../pages/ErrorPage";
import AdminLayout from "../layouts/AdminLayout";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Staffs from "../pages/Staffs";
import Customer from "../pages/Customer";
import Permission from "../pages/Permission";

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
        path: "staffs",
        element: <Staffs />,
      },
      {
        path: "customers",
        element: <Customer />,
      },
      {
        path: "roles",
        element: <div>Roles</div>,
      },
      {
        path: "permissions",
        element: <Permission />,
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
