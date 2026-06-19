import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import DashboardView from './views/DashboardView';

import ReportView from './views/ReportView';
import CalculatorView from './views/CalculatorView';
import LandingView from './views/LandingView';
import CatalogView from './views/CatalogView';
import ProfileView from './views/ProfileView';
import NotFoundView from './views/NotFoundView';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingView />} />
      <Route path="/calculator" element={<CalculatorView />} />
      <Route path="/catalog" element={<CatalogView />} />
      <Route path="/login" element={<LoginView />} />
      <Route path="/register" element={<RegisterView />} />
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <DashboardView />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <PrivateRoute>
            <ProfileView />
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
      <Route path="*" element={<NotFoundView />} />
    </Routes>
  );
}

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
