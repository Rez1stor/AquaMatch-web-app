import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Check, Search, Fish, ShieldAlert, CheckCircle2, AlertTriangle, Droplets, Info } from 'lucide-react';

export default function HomeView() {
  const [waterType, setWaterType] = useState('freshwater');
  const [volume, setVolume] = useState<number>(100);
  
  const [species, setSpecies] = useState<any[]>([]);
  const [recommendedSpecies, setRecommendedSpecies] = useState<any[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [analysis, setAnalysis] = useState<any>(null);

  const { token } = useAuth();
  const navigate = useNavigate();

  // Reset selected species when water type changes
  useEffect(() => {
    setSelectedSpecies([]);
    setAnalysis(null);
  }, [waterType]);

  useEffect(() => {
    fetchSpecies();
  }, [waterType]);

  useEffect(() => {
    if (selectedSpecies.length > 0) {
      fetchAnalysis();
      fetchRecommendations();
    } else {
      setAnalysis(null);
      setRecommendedSpecies([]);
    }
  }, [selectedSpecies, volume, waterType]);

  const fetchSpecies = async () => {
    try {
      const res = await api.get(`/species/?water_type=${waterType}`);
      setSpecies(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const res = await api.post(`/species/recommend`, {
        water_type: waterType,
        volume: volume,
        current_species_ids: selectedSpecies
      });
      setRecommendedSpecies(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAnalysis = async () => {
    try {
      const res = await api.post(`/aquariums/analyze`, {
        water_type: waterType,
        volume: volume,
        species_ids: selectedSpecies
      });
      setAnalysis(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSpecies = (id: number) => {
    setSelectedSpecies(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    const aquariumData = {
      name: `Mój zbiornik ${volume}L`,
      water_type: waterType,
      volume,
      species_ids: selectedSpecies
    };

    if (token) {
      try {
        const res = await api.post('/aquariums/', aquariumData);
        navigate(`/report/${res.data.id}`);
      } catch (err) {
        console.error(err);
      }
    } else {
      localStorage.setItem('pendingAquarium', JSON.stringify(aquariumData));
      navigate('/login');
    }
  };

  const filteredSpecies = species.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.tags.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-primary mb-4 flex items-center justify-center gap-3">
            <Fish className="w-10 h-10" /> AquaMatch Konfigurator
          </h1>
          <p className="text-lg text-muted-foreground">Zaprojektuj swój idealny zbiornik. Zobacz ocenę surową i rekomendacje na żywo!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Kolumna Lewa: Parametry */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card rounded-xl shadow-lg border border-border p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Droplets className="text-primary"/> 1. Parametry</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Typ wody</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setWaterType('freshwater')}
                      className={`p-3 border rounded-lg text-center transition-colors font-medium ${waterType === 'freshwater' ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'}`}
                    >
                      Słodkowodne
                    </button>
                    <button 
                      onClick={() => setWaterType('saltwater')}
                      className={`p-3 border rounded-lg text-center transition-colors font-medium ${waterType === 'saltwater' ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'}`}
                    >
                      Morskie
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Pojemność (litry): {volume}L</label>
                  <input 
                    type="range" 
                    value={volume} 
                    onChange={e => setVolume(Number(e.target.value))} 
                    className="w-full accent-primary"
                    min="10"
                    max="1000"
                    step="10"
                  />
                </div>
              </div>
            </div>

            {/* Kolumna Lewa: Wyniki na żywo */}
            {analysis && (
              <div className="bg-card rounded-xl shadow-lg border border-border p-6 animate-fadeIn">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Info className="text-primary"/> Raport Na Żywo</h2>
                
                <div className="mb-6 flex flex-col items-center">
                  <div className="relative">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted" />
                      <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" 
                        strokeDasharray={377} strokeDashoffset={377 - (377 * analysis.compatibility_score) / 100} 
                        className={analysis.compatibility_score > 80 ? "text-primary" : analysis.compatibility_score > 50 ? "text-yellow-400" : "text-destructive"} 
                      />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold">
                      {analysis.compatibility_score}
                    </div>
                  </div>
                  <span className="mt-2 font-medium text-muted-foreground">Compatibility Score</span>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Bioload: {analysis.total_bioload}L</span>
                    <span>Pojemność: {analysis.capacity}L</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className={`h-2.5 rounded-full ${analysis.total_bioload > analysis.capacity ? 'bg-destructive' : 'bg-primary'}`} style={{ width: `${Math.min(100, (analysis.total_bioload / analysis.capacity) * 100)}%` }}></div>
                  </div>
                </div>

                {analysis.warnings.length > 0 && (
                  <div className="space-y-2 mt-4">
                    {analysis.warnings.map((w: any, idx: number) => (
                      <div key={idx} className={`p-3 rounded-lg text-sm flex items-start ${w.type === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-yellow-50 text-yellow-800'}`}>
                        {w.type === 'error' ? <ShieldAlert className="w-5 h-5 mr-2 shrink-0" /> : <AlertTriangle className="w-5 h-5 mr-2 shrink-0" />}
                        <span>{w.message}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <button 
                onClick={handleSave}
                disabled={selectedSpecies.length === 0}
                className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {token ? 'Zapisz do swojej Biblioteki' : 'Zaloguj się, aby Zapisać'}
            </button>
            {token && (
              <button 
                  onClick={() => navigate('/dashboard')}
                  className="w-full py-3 mt-2 bg-secondary text-secondary-foreground font-bold rounded-xl hover:bg-secondary/90 transition-colors"
                >
                  Wróć do Dashboardu
              </button>
            )}

          </div>

          {/* Kolumna Prawa: Wybór Ryb */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Rekomendacje */}
            {recommendedSpecies.length > 0 && (
               <div className="bg-primary/5 rounded-xl border border-primary/20 p-6 animate-fadeIn">
                 <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary">
                    <CheckCircle2 /> Rekomendowane dla Ciebie
                 </h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {recommendedSpecies.map(sp => (
                      <div 
                        key={sp.id} 
                        onClick={() => toggleSpecies(sp.id)}
                        className="flex items-center p-3 border border-primary/30 rounded-xl cursor-pointer hover:bg-primary/10 transition-all bg-card"
                      >
                        <img src={sp.image_url} alt={sp.name} className="w-12 h-12 rounded-lg object-cover mr-3" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate">{sp.name}</p>
                          <p className="text-xs text-muted-foreground truncate">Bioload: {sp.bioload}L</p>
                        </div>
                      </div>
                    ))}
                 </div>
               </div>
            )}

            <div className="bg-card rounded-xl shadow-lg border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">2. Wybierz Obsadę</h2>
                <div className="relative w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-9 pr-3 py-2 border border-input bg-input-background rounded-md text-sm focus:ring-1 focus:ring-primary"
                    placeholder="Szukaj (np. peaceful)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
                {filteredSpecies.map(sp => {
                  const isSelected = selectedSpecies.includes(sp.id);
                  return (
                    <div 
                      key={sp.id} 
                      onClick={() => toggleSpecies(sp.id)}
                      className={`relative flex items-center p-4 border rounded-xl cursor-pointer transition-all ${isSelected ? 'border-primary bg-primary/10 ring-1 ring-primary' : 'border-border hover:border-primary/50 hover:bg-muted/30'}`}
                    >
                      <img src={sp.image_url} alt={sp.name} className="w-16 h-16 rounded-lg object-cover mr-4" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{sp.name}</p>
                        <p className="text-xs text-muted-foreground italic truncate">{sp.scientific_name}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {sp.tags.split(',').map((tag: string, i: number) => (
                            <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 text-primary">
                          <Check className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
