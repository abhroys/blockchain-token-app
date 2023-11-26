import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import AfterLoginPage from "./pages/afterlogin";
import BeginnerPage from "./pages/beginner";
import IntermediatePage from "./pages/intermediate";
import ProfessionalPage from "./pages/professional";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/afterlogin" element={<AfterLoginPage />} />
          <Route path="/beginner" element={<BeginnerPage />} />
          <Route path="/intermediate" element={<IntermediatePage />} />
          <Route path="/professional" element={<ProfessionalPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
