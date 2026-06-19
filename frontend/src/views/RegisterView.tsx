import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function RegisterView() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Hasła nie są identyczne');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Wprowadź prawidłowy adres e-mail (np. user@example.com)');
      return;
    }
    
    try {
      await api.post('/auth/register', { username: username || email.split('@')[0], email, password });
      const res = await api.post('/auth/login', { email, password });
      const currentToken = res.data.access_token;
      login(currentToken, email);

      // Check pending aquarium
      const pendingStr = localStorage.getItem('pendingAquarium');
      if (pendingStr) {
        const pendingData = JSON.parse(pendingStr);
        // Save pending aquarium
        try {
          const saveRes = await api.post('/aquariums/', pendingData, {
            headers: { Authorization: `Bearer ${currentToken}` }
          });
          localStorage.removeItem('pendingAquarium');
          navigate(`/report/${saveRes.data.id}`);
          return;
        } catch (saveErr) {
          console.error("Failed to save pending aquarium", saveErr);
        }
      }

      navigate('/dashboard');

    } catch (err: any) {
      let errorMessage = 'Wystąpił błąd';
      if (err.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) {
          errorMessage = err.response.data.detail.map((e: any) => e.msg).join(', ');
        } else if (typeof err.response.data.detail === 'string') {
          errorMessage = err.response.data.detail;
        }
      }
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-aqua-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-aqua-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-aqua-900">
            Rejestracja
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Dołącz do AquaMatch
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <div className="space-y-4">
            <div>
              <input
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-aqua-500 focus:border-aqua-500 focus:z-10 sm:text-sm"
                placeholder="Nazwa użytkownika"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <input
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-aqua-500 focus:border-aqua-500 focus:z-10 sm:text-sm"
                placeholder="Adres e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-aqua-500 focus:border-aqua-500 focus:z-10 sm:text-sm"
                placeholder="Hasło"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-aqua-500 focus:border-aqua-500 focus:z-10 sm:text-sm"
                placeholder="Powtórz hasło"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-aqua-600 hover:bg-aqua-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-aqua-500 transition-colors"
            >
              Zarejestruj się
            </button>
          </div>
          <div className="text-sm text-center">
            <Link
              to="/login"
              className="font-medium text-aqua-600 hover:text-aqua-500"
            >
              Masz już konto? Zaloguj się
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
