import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Fish, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Fish className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">AquaMatch</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/catalog" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Katalog
            </Link>
            <Link to="/calculator" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Kalkulator
            </Link>
            {token ? (
              <>
                <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  Dashboard
                </Link>
                <Link to="/profile" className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2 border border-primary/20 bg-primary/10 px-3 py-2 rounded-lg">
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline font-bold">Profil</span>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-bold hover:bg-primary/20 transition-colors shadow-sm"
                >
                  Zaloguj się
                </Link>
                <Link
                  to="/register"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors shadow-sm"
                >
                  Zarejestruj się
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
