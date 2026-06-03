import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminGuard } from "./store/AuthGuard";
import AdminLogin from "./components/AdminLogin";
import AdminAuth from "./components/AdminAuth";
import ForgotPassword from "./components/ForgotPassword";
import GoogleCallback from "./components/GoogleCallback";
import AdminLayout from "./layout/AdminLayout";
import useAuthStore from "./store/authStore";
import JobCategorys from "./pages/category/JobCategorys";
import JobPost from "./pages/jobs/JobPost";

function App() {
  const { isAuthenticated, tokens, setAuthHeader, user } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && tokens?.accessToken) {
      setAuthHeader(tokens.accessToken);
    } else {
      setAuthHeader(null);
    }
  }, [isAuthenticated, tokens?.accessToken, setAuthHeader]);

  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="!rounded-2xl !shadow-lg !text-sm !font-medium"
      />

      <Routes>
        {/* ── Public routes ── */}
        <Route
          path="/login"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <AdminLogin />
            )
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <AdminAuth />
            )
          }
        />
        <Route
          path="/forgot-password"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <ForgotPassword />
            )
          }
        />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />

        {/* ── Root redirect ── */}
        <Route
          path="/"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* ── Protected admin routes (AdminGuard wraps all of these) ── */}
        <Route element={<AdminGuard />}>
          <Route element={<AdminLayout />}>
            <Route
              path="/admin/dashboard"
              element={
                <div className="p-6 text-[#1e2558] font-semibold">
                  Dashboard
                </div>
              }
            />
            <Route
              path="/admin/home"
              element={
                <div className="p-6 text-[#1e2558] font-semibold">Home</div>
              }
            />
            <Route
              path="/admin/users"
              element={
                <div className="p-6 text-[#1e2558] font-semibold">Users</div>
              }
            />
            <Route
              path="/admin/profiles"
              element={
                <div className="p-6 text-[#1e2558] font-semibold">
                  Profile Setup
                </div>
              }
            />
            <Route
              path="/admin/all-customer"
              element={
                <div className="p-6 text-[#1e2558] font-semibold">
                  All Customers
                </div>
              }
            />
            <Route
              path="/admin/all-jobs"
              element={<div className="p-6">All Jobs</div>}
            />
            <Route path="/admin/add-new-job" element={<JobPost />} />
            <Route path="/admin/job-categories" element={<JobCategorys />} />
            <Route
              path="/admin/country-setup"
              element={<div className="p-6">Country Setup</div>}
            />
            <Route
              path="/admin/city-setup"
              element={<div className="p-6">City Setup</div>}
            />
            <Route
              path="/admin/area-setup"
              element={<div className="p-6">Area Setup</div>}
            />
            <Route
              path="/admin/job-type-setup"
              element={<div className="p-6">Job Type Setup</div>}
            />
            <Route
              path="/admin/all-employers"
              element={<div className="p-6">All Employers</div>}
            />
            <Route
              path="/admin/create-employer"
              element={<div className="p-6">Create Employer</div>}
            />
            <Route
              path="/admin/employer-package"
              element={<div className="p-6">Employer Package</div>}
            />
            <Route
              path="/admin/employer-package-order"
              element={<div className="p-6">Package Orders</div>}
            />
            <Route
              path="/admin/employer-profile"
              element={<div className="p-6">Employer Profile</div>}
            />
            <Route
              path="/admin/employer-payment"
              element={<div className="p-6">Employer Payment</div>}
            />
            <Route
              path="/admin/employer-mail-notify"
              element={<div className="p-6">Employer Mail Notify</div>}
            />
            <Route
              path="/admin/all-seekers"
              element={<div className="p-6">All Seekers</div>}
            />
            <Route
              path="/admin/create-seeker"
              element={<div className="p-6">Create Seeker</div>}
            />
            <Route
              path="/admin/seeker-profile"
              element={<div className="p-6">Seeker Profile</div>}
            />
            <Route
              path="/admin/seeker-payment"
              element={<div className="p-6">Seeker Payment</div>}
            />
            <Route
              path="/admin/seeker-job-apply"
              element={<div className="p-6">Job Apply</div>}
            />
            <Route
              path="/admin/seeker-mail-notify"
              element={<div className="p-6">Seeker Mail Notify</div>}
            />
            <Route
              path="/admin/create-package"
              element={<div className="p-6">Create Package</div>}
            />
            <Route
              path="/admin/all-package"
              element={<div className="p-6">All Packages</div>}
            />
            <Route
              path="/admin/create-notification"
              element={<div className="p-6">Create Notification</div>}
            />
            <Route
              path="/admin/all-notification"
              element={<div className="p-6">All Notifications</div>}
            />
            <Route
              path="/admin/all-users"
              element={<div className="p-6">All Users</div>}
            />
            <Route
              path="/admin/create-user"
              element={<div className="p-6">Create User</div>}
            />

            {/* Catch-all inside admin → dashboard */}
            <Route
              path="/admin/*"
              element={<Navigate to="/admin/dashboard" replace />}
            />
          </Route>
        </Route>

        {/* ── Global catch-all ── */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
