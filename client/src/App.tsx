import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { useState } from "react";
import LandingNavbar from "./components/LandingNavbar";
import DashboardNavbar from "./components/DashboardNavbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Landing from "./pages/Landing";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import "./App.css";

function App() {
  // Temporary auth state
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Pages Shell (Shares LandingNavbar) */}
        <Route
          element={
            <div className="min-h-screen bg-white">
              <LandingNavbar />
              <Outlet />{" "}
              {/* Renders <Landing />, <PrivacyPolicy />, or <Terms /> */}
            </div>
          }
        >
          <Route path="/" element={<Landing />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        </Route>

        {/* Shared Protected App Shell (Dashboard + Expenses) */}
        <Route
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <div className="h-screen">
                <DashboardNavbar />
                <Outlet /> {/* Renders <Dashboard /> or <Expenses /> */}
              </div>
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/expenses" element={<Expenses />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
