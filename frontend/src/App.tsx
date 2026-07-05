import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MatchesList from './pages/MatchesList';
import MatchesForm from './pages/MatchesForm';
import StatsList from './pages/StatsList';
import StatsForm from './pages/StatsForm';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/matches"
            element={
              <ProtectedRoute>
                <MatchesList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/matches/new"
            element={
              <ProtectedRoute>
                <MatchesForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stats"
            element={
              <ProtectedRoute>
                <StatsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stats/new"
            element={
              <ProtectedRoute>
                <StatsForm />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;