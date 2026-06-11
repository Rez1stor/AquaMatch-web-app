import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import AquariumBuilderView from './views/AquariumBuilderView';
import ReportView from './views/ReportView';

import HomeView from './views/HomeView';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeView />} />
      <Route path="/login" element={<LoginView />} />
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <DashboardView />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/report/:id" 
        element={
          <PrivateRoute>
            <ReportView />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
