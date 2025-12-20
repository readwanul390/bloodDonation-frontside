import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../MainLayout/MainLayout";
import Home from "../Pages/Home";
import Register from "../Pages/Register";
import Login from "../Pages/Login";

import DashboardLayout from "../Dashboard/DashboardLayout";
import DonorHome from "../Dashboard/DonorHome";
import Profile from "../Dashboard/Profile";
import MyDonationRequests from "../Dashboard/MyDonationRequests";
import CreateDonationRequest from "../Dashboard/CreateDonationRequest";

import AdminHome from "../Dashboard/Admin/AdminHome";
import AllUsers from "../Dashboard/Admin/AllUsers";

import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import AllBloodDonationRequests from "../Dashboard/MyDonationRequests";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
    ],
  },

  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      // 🔹 DEFAULT DASHBOARD (ROLE-BASED inside component)
      { index: true, element: <DonorHome /> },

      // 🔹 COMMON
      { path: "profile", element: <Profile /> },

      // 🔹 DONOR ONLY
      { path: "my-donation-requests", element: <MyDonationRequests /> },
      { path: "create-donation-request", element: <CreateDonationRequest /> },

      // 🔹 ADMIN ONLY
      {
        path: "admin",
        element: (
          <AdminRoute>
            <AdminHome />
          </AdminRoute>
        ),
      },
      {
        path: "all-users",
        element: (
          <AdminRoute>
            <AllUsers />
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/all-blood-donation-request",
        element : (<AdminRoute>
            <AllBloodDonationRequests />
          </AdminRoute>),
      }

    ],
  },
]);

export default Router;
