
import React from "react";
import { Navigate } from "react-router-dom";

const AdminPage = () => {
  // Redirect to the new admin dashboard
  return <Navigate to="/admin-dashboard" replace />;
};

export default AdminPage;
