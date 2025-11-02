import React from "react";
import { motion } from "framer-motion";
import "./AskAI.css";

const AskAI = () => {
  return (
    <div className="askai-page">
      <div className="container py-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="askai-title">Ask AI</h1>
          <p className="askai-subtitle">
            Get AI-powered assistance for your portfolio. Ask questions and get instant help.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AskAI;

