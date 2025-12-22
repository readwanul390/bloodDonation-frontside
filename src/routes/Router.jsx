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
import AllBloodDonationRequests from "../Dashboard/Admin/AllBloodDonationRequests";
import AllBloodDonationRequestsVolunteer from "../Dashboard/Volunteer/AllBloodDonationRequestsVolunteer";

import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import VolunteerRoute from "./VolunteerRoute";
import Search from "../Pages/Search";
import DonationRequestDetails from "../Pages/DonationRequestDetails";
import DonationRequests from "../Pages/DonationRequests";
import Funding from "../Pages/Funding";
import VolunteerHome from "../Dashboard/volunteer/Volunteer_Home";



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
      
      { index: true, element: <DonorHome /> },

      // 🔹 COMMON
      { path: "profile", element: <Profile /> },
      {
        path: "funding",
        element: (
          <PrivateRoute>
            <Funding/>
          </PrivateRoute>
        ),
      },

      // 🔹 DONOR
      { path: "my-donation-requests", element: <MyDonationRequests /> },
      { path: "create-donation-request", element: <CreateDonationRequest /> },

      // 🔹 ADMIN
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
        path: "all-blood-donation-request",
        element: (
          <AdminRoute>
            <AllBloodDonationRequests />
          </AdminRoute>
        ),
      },

      // 🔹 VOLUNTEER
      {
        path: "volunteer/all-blood-donation-request",
        element: (
          <VolunteerRoute>
            <AllBloodDonationRequestsVolunteer />
          </VolunteerRoute>
        ),
      },
      {
        path: "volunteer/volunteer-home",
        element: (
          <VolunteerRoute>
            <VolunteerHome />
          </VolunteerRoute>
        ),
      }
    ],
    
  },
  

  {
    path: "search",
    element: <Search />,
  },
  {
    path: "donation-requests",
    element: <DonationRequests />,
  },
  {
    path: "donation-request/:id",
    element: (
      <PrivateRoute>
        <DonationRequestDetails />
      </PrivateRoute>
    ),
  },
  

  

]);

export default Router;
