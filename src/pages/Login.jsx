import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [firebaseError, setFirebaseError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper function to get user-friendly error messages
  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/user-not-found":
        return "Incorrect sign in credentials. Please check your email and password.";
      case "auth/wrong-password":
        return "Incorrect sign in credentials. Please check your email and password.";
      case "auth/invalid-credential":
        return "Incorrect sign in credentials. Please check your email and password.";
      case "auth/invalid-email":
        return "Invalid email address format.";
      case "auth/user-disabled":
        return "This account has been disabled.";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later.";
      case "auth/network-request-failed":
        return "Network error. Please check your connection.";
      default:
        return "Incorrect sign in credentials. Please check your email and password.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFirebaseError("");
    
    if (validateForm()) {
      setLoading(true);
      
      try {
        const result = await login(formData.email, formData.password);
        
        if (result.success) {
          // Success - user will be automatically redirected by AuthContext
          navigate("/dashboard");
        } else {
          // Handle Firebase error
          const errorMessage = getErrorMessage(result.error);
          setFirebaseError(errorMessage);
        }
      } catch (error) {
        setFirebaseError("An unexpected error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="login-page">
      <div className="container py-5">
        <div className="row justify-content-center align-items-center min-vh-100 py-5">
          <motion.div
            className="col-lg-5 col-md-7 col-sm-9"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="login-card" variants={itemVariants}>
              {/* Header */}
              <div className="text-center mb-4">
                <motion.h2
                  className="login-title mb-2"
                  variants={itemVariants}
                >
                  Welcome Back
                </motion.h2>
                <motion.p
                  className="login-subtitle"
                  variants={itemVariants}
                >
                  Sign in to continue to PortfolioPro
                </motion.p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit}>
                {/* Email Field */}
                <motion.div className="mb-3" variants={itemVariants}>
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    autoComplete="email"
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </motion.div>

                {/* Password Field */}
                <motion.div className="mb-4" variants={itemVariants}>
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`form-control ${errors.password ? "is-invalid" : ""}`}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                    >
                      <i
                        className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                      ></i>
                    </button>
                  </div>
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                  <div className="text-end mt-2">
                    <Link to="/forgot-password" className="forgot-password-link">
                      Forgot password?
                    </Link>
                  </div>
                </motion.div>

                {/* Firebase Error Message */}
                {firebaseError && (
                  <motion.div
                    className="alert alert-danger"
                    role="alert"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {firebaseError}
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  className="btn login-submit-btn w-100 mb-3"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </motion.button>
              </form>

              {/* Divider */}
              <motion.div
                className="divider-wrapper my-4"
                variants={itemVariants}
              >
                <div className="divider"></div>
                <span className="divider-text">OR</span>
                <div className="divider"></div>
              </motion.div>

              {/* Sign Up Link */}
              <motion.div className="text-center" variants={itemVariants}>
                <p className="signup-prompt">
                  Don't have an account?{" "}
                  <Link to="/signup" className="signup-link">
                    Sign up here
                  </Link>
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;

