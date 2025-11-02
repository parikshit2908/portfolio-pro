import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import "./Navbar.css";

const NavBar = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleProtectedLink = (e, path) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate("/login");
    }
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate("/");
    }
  };

  // Framer Motion variant for main CTA button
  const buttonVariants = {
    rest: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
  };

  // Framer Motion variant for text links
  const linkVariants = {
    rest: { opacity: 1 },
    hover: { opacity: 0.8, transition: { duration: 0.2 } },
  };

  // Theme toggle animation variant
  const themeToggleVariants = {
    rest: { rotate: 0 },
    hover: { rotate: 15, scale: 1.1, transition: { duration: 0.2 } },
  };

  return (
    // Bootstrap Navbar component
    <motion.nav
      className="navbar navbar-expand-lg custom-navbar-bg sticky-top"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
    >
      <div className="container-fluid px-5">
        {/* 1. Left Section: Website Logo */}
        <Link
          to="/"
          className="navbar-brand me-5 fw-bold"
          style={{ color: "#4A4E69", fontSize: "1.5rem" }}
        >
          PortfolioPro
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* 2. Center Links and Right Buttons (Collapsible) */}
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          {/* Center Links */}
          <div className="navbar-nav mx-auto">
            <motion.div
              initial="rest"
              whileHover="hover"
              variants={linkVariants}
              className="nav-item"
            >
              <Link
                to="/"
                className="nav-link mx-3 custom-nav-link-color"
              >
                Home
              </Link>
            </motion.div>
            <motion.div
              initial="rest"
              whileHover="hover"
              variants={linkVariants}
              className="nav-item"
            >
              <Link
                to="/dashboard"
                className="nav-link mx-3 custom-nav-link-color"
                onClick={(e) => handleProtectedLink(e, "/dashboard")}
              >
                Dashboard
              </Link>
            </motion.div>
            <motion.div
              initial="rest"
              whileHover="hover"
              variants={linkVariants}
              className="nav-item"
            >
              <Link
                to="/ask-ai"
                className="nav-link mx-3 custom-nav-link-color"
                onClick={(e) => handleProtectedLink(e, "/ask-ai")}
              >
                Ask AI
              </Link>
            </motion.div>
            <motion.div
              initial="rest"
              whileHover="hover"
              variants={linkVariants}
              className="nav-item"
            >
              <Link
                to="/contact"
                className="nav-link mx-3 custom-nav-link-color"
              >
                Contact
              </Link>
            </motion.div>
          </div>

          {/* Right Section: Action Buttons */}
          <div className="d-flex align-items-center">
            {/* Theme Toggle Button */}
            <motion.button
              className="btn theme-toggle-btn"
              onClick={toggleTheme}
              initial="rest"
              whileHover="hover"
              variants={themeToggleVariants}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <i className="bi bi-moon-stars-fill"></i>
              ) : (
                <i className="bi bi-sun-fill"></i>
              )}
            </motion.button>

            {/* Conditional rendering based on auth status */}
            {isAuthenticated ? (
              <>
                {/* User greeting */}
                <span className="me-3 user-greeting">
                  Welcome, {user?.firstName || user?.name || (user?.email ? user.email.split('@')[0].split('.')[0] : 'User')}
                </span>
                {/* Logout Button */}
                <motion.button
                  onClick={handleLogout}
                  className="btn custom-login-btn fw-bold"
                  initial="rest"
                  whileHover="hover"
                  variants={linkVariants}
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                {/* Login Button */}
                <motion.div
                  initial="rest"
                  whileHover="hover"
                  variants={linkVariants}
                  className="me-3"
                >
                  <Link to="/login" className="btn custom-login-btn fw-bold">
                    Login
                  </Link>
                </motion.div>

                {/* Create Portfolio Button (Primary CTA) */}
                <motion.div
                  initial="rest"
                  whileHover="hover"
                  variants={buttonVariants}
                >
                  <Link to="/signup" className="btn custom-cta-btn fw-bold">
                    Create Your Portfolio
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default NavBar;
