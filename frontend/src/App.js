import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import InterviewPage from "./pages/InterviewPage";
import ResultsPage from "./pages/ResultsPage";

import Header from "./components/common/Header";
import Footer from "./components/common/Footer";

import "./styles.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/interview/:userId" element={<InterviewPage />} />
        <Route path="/results/:userId" element={<ResultsPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
