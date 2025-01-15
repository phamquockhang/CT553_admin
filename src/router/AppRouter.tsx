import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "../features/auth/ProtectedRoute";
import ErrorPage from "../pages/ErrorPage";
import AdminLayout from "../layouts/AdminLayout";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Staffs from "../pages/Staffs";

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
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
