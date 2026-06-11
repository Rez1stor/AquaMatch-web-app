import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function LoginView() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      let currentToken = '';
      if (isRegistering) {
        await api.post('/auth/register', { email, password });
        const res = await api.post('/auth/login', { username: email, password });
        currentToken = res.data.access;
        login(currentToken, email);
      } else {
        const res = await api.post('/auth/login', { username: email, password });
        currentToken = res.data.access;
        login(currentToken, email);
      }

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
      setError(err.response?.data?.detail || 'Wystąpił błąd');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-aqua-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-aqua-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-aqua-900">
            AquaMatch
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Twój wirtualny doradca akwarystyczny
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-aqua-500 focus:border-aqua-500 focus:z-10 sm:text-sm"
                placeholder="Adres e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-aqua-500 focus:border-aqua-500 focus:z-10 sm:text-sm"
                placeholder="Hasło"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-aqua-600 hover:bg-aqua-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-aqua-500 transition-colors"
            >
              {isRegistering ? 'Zarejestruj się' : 'Zaloguj się'}
            </button>
          </div>
          <div className="text-sm text-center">
            <button
              type="button"
              className="font-medium text-aqua-600 hover:text-aqua-500"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? 'Masz już konto? Zaloguj się' : 'Nie masz konta? Zarejestruj się'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
