import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext'; // Import UserProvider
import AuthForm from './component/AuthForm';
import Dashboard from './component/Dashboard';
import FoodDetails from './component/FoodDetails';
import FoodHistoryPage from './pages/FoodHistoryPage';
import './index.css';
import SuggestionsPage from './pages/SuggestionsPage';
import About from './component/About';

function App() {
  return (
    <UserProvider> {/* Wrap the app with UserProvider */}
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<AuthForm />} />
            <Route path="/login" element={<AuthForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/food-details" element={<FoodDetails />} />
            <Route path="/user-history" element={<FoodHistoryPage />} />
            <Route path="/suggestions" element={<SuggestionsPage/>} />
            <Route path="/about" element={<About/>} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
