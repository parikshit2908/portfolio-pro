import React from "react";
import { motion } from "framer-motion";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-page">
      <div className="container py-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">
            Welcome to your portfolio dashboard. Your portfolio management tools will appear here.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;

