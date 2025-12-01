import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardPage } from "../features/dashboard/DashboardPage";
function AppRouter() {
  const isAuthenticated = true;

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;
