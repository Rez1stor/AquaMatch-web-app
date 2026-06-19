import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, LogOut, LayoutDashboard, Settings, Save, Trash2 } from 'lucide-react';

export default function ProfileView() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/me');
      setUsername(res.data.username);
      setEmail(res.data.email);
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  const handleSave = async () => {
    setMessage(null);
    try {
      await api.put('/auth/me', { username, email, password: password || undefined });
      setMessage({ type: 'success', text: 'Profil został zaktualizowany!' });
      setIsEditing(false);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Błąd podczas zapisu' });
    }
  };

  const handleDelete = async () => {
    setDeleteError('');
    try {
      await api.delete('/auth/me', { data: { password: deletePassword } });
      logout();
      navigate('/login');
    } catch (err: any) {
      setDeleteError(err.response?.data?.detail || 'Nie udało się usunąć konta. Sprawdź hasło.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background p-4">
      <div className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border p-8 text-center animate-fadeIn">
        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-primary/30">
          <User className="w-12 h-12 text-primary" />
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-2">Twój Profil</h1>
        <p className="text-muted-foreground mb-6">Zarządzaj swoimi ustawieniami i biblioteką zbiorników w systemie AquaMatch.</p>
        
        {message && (
          <div className={`p-3 rounded-lg text-sm mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <div className="space-y-4 text-left">
          {isEditing ? (
            <div className="bg-muted/50 p-4 rounded-xl border border-border space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Nazwa użytkownika</label>
                <input 
                  type="text" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Adres e-mail</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Nowe hasło (opcjonalnie)</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Zostaw puste, by nie zmieniać"
                  className="w-full px-3 py-2 rounded-md border border-input bg-background"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button 
                  onClick={handleSave}
                  className="flex-1 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" /> Zapisz
                </button>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2 bg-muted text-foreground font-bold rounded-lg hover:bg-muted/80"
                >
                  Anuluj
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-muted/30 p-4 rounded-xl border border-border flex justify-between items-center mb-6">
              <div>
                <p className="font-bold text-foreground">{username || 'Brak nazwy'}</p>
                <p className="text-sm text-muted-foreground">{email}</p>
              </div>
              <button 
                onClick={() => setIsEditing(true)}
                className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                title="Edytuj profil"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          )}

          

          
          <div className="pt-4 border-t border-border mt-6 space-y-3">
            <button 
              onClick={handleLogout}
              className="w-full py-3 px-4 bg-secondary text-secondary-foreground font-bold rounded-xl hover:bg-secondary/80 transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" /> Wyloguj się
            </button>
            
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="w-full py-3 px-4 bg-destructive/10 text-destructive font-bold rounded-xl hover:bg-destructive hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <Trash2 className="w-5 h-5" /> Usuń trwale konto
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border p-8 text-center animate-scaleIn">
            <Trash2 className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Potwierdź usunięcie konta</h2>
            <p className="text-muted-foreground mb-6">
              Czy na pewno chcesz usunąć swoje konto? Ta operacja jest <strong>nieodwracalna</strong> i usunie wszystkie Twoje akwaria! Wprowadź hasło, aby potwierdzić.
            </p>
            
            {deleteError && (
              <div className="bg-red-100 text-red-800 p-3 rounded-lg text-sm mb-4 text-left">
                {deleteError}
              </div>
            )}

            <div className="text-left mb-6">
              <label className="block text-sm font-medium text-muted-foreground mb-1">Hasło</label>
              <input 
                type="password" 
                value={deletePassword}
                onChange={e => setDeletePassword(e.target.value)}
                placeholder="Twoje hasło"
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
              />
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword('');
                  setDeleteError('');
                }}
                className="flex-1 py-3 bg-muted text-foreground font-bold rounded-xl hover:bg-muted/80 transition-colors"
              >
                Anuluj
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 py-3 bg-destructive text-white font-bold rounded-xl hover:bg-destructive/90 transition-colors"
              >
                Usuń trwale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
