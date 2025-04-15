import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthForm from './component/AuthForm';
import Dashboard from './component/Dashboard';
import FoodDetails from './component/FoodDetails';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<AuthForm />} />
          <Route path="/login" element={<AuthForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/food-details" element={<FoodDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;