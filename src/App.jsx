// src/App.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

// Layouts & Contexts
import Navbar from "./layouts/Navbar";
import Footer from "./layouts/Footer";
import { ThemeProvider } from "./contexts/ThemeContext";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

// Pages (Public)
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Contact from "./pages/Contact";
import PublicPortfolio from "./pages/PublicPortfolio";

// Pages (Protected)
import Dashboard from "./pages/Dashboard";
import AskAI from "./pages/AskAI";
import Settings from "./pages/Settings";
import UploadResume from "./pages/UploadResume";
import UploadPortfolio from "./pages/UploadPortfolio";

// Portfolio Pages
import CustomizeTemplates from "./pages/CustomizeTemplates";
import CreatePortfolio from "./pages/CreatePortfolio";
import Editor from "./pages/Editor";
import GetInspired from "./pages/GetInspired";

const App = () => {
  const location = useLocation();

  // Routes where we hide Navbar & Footer
  const hideNavbarRoutes = [
    "/login",
    "/signup",
    "/editor",          // matches /editor/:id
    "/create-portfolio",
  ];

  // Public Portfolio URL → hide navbar
  const isPublicPortfolio = location.pathname.startsWith("/u/");

  const shouldHideNavbar =
    hideNavbarRoutes.some((r) => location.pathname.startsWith(r)) ||
    isPublicPortfolio;

  return (
    <ThemeProvider>
      {!shouldHideNavbar && <Navbar />}

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Public portfolio viewer */}
        <Route path="/u/:username" element={<PublicPortfolio />} />

        {/* Get Inspired — should be PUBLIC */}
        <Route path="/get-inspired" element={<GetInspired />} />

        {/* Protected dashboard routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* Template Gallery */}
        <Route
          path="/templates"
          element={
            <ProtectedRoute>
              <CustomizeTemplates />
            </ProtectedRoute>
          }
        />

        {/* Portfolio creation */}
        <Route
          path="/create-portfolio"
          element={
            <ProtectedRoute>
              <CreatePortfolio />
            </ProtectedRoute>
          }
        />

        {/* Wix-style editor */}
        <Route
          path="/editor/:id"
          element={
            <ProtectedRoute>
              <Editor />
            </ProtectedRoute>
          }
        />

        {/* Resume Upload */}
        <Route
          path="/upload-resume"
          element={
            <ProtectedRoute>
              <UploadResume />
            </ProtectedRoute>
          }
        />

        {/* Portfolio Upload */}
        <Route
          path="/upload-portfolio"
          element={
            <ProtectedRoute>
              <UploadPortfolio />
            </ProtectedRoute>
          }
        />

        {/* AI Page */}
        <Route
          path="/ask-ai"
          element={
            <ProtectedRoute>
              <AskAI />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Home />} />
      </Routes>

      {!shouldHideNavbar && <Footer />}
    </ThemeProvider>
  );
};

export default App;
