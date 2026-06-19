import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Fish } from 'lucide-react';
import AquariumParametersForm from '../compositions/AquariumParametersForm';
import LiveReportPanel from '../compositions/LiveReportPanel';
import SpeciesList from '../compositions/SpeciesList';
import SelectedFishesColumn from '../compositions/SelectedFishesColumn';

export default function CalculatorView() {
  const location = useLocation();
  const initialState = location.state as any;

  const [waterType, setWaterType] = useState(initialState?.waterType || 'freshwater');
  const [volume, setVolume] = useState<number>(initialState?.volume ? parseInt(initialState.volume) : 100);
  const [aquariumId] = useState<number | null>(initialState?.aquariumId || null);
  const [aquariumName] = useState<string>(initialState?.name || '');
  
  const [species, setSpecies] = useState<any[]>([]);
  const [recommendedSpecies, setRecommendedSpecies] = useState<any[]>([]);
  
  // Array of {species_id: number, quantity: number}
  const [selectedSpecies, setSelectedSpecies] = useState<{species_id: number, quantity: number}[]>(
    initialState?.species ? initialState.species : (initialState?.speciesId ? [{ species_id: parseInt(initialState.speciesId), quantity: 1 }] : [])
  );
  
  const [analysis, setAnalysis] = useState<any>(null);

  const { token } = useAuth();
  const navigate = useNavigate();

  const [isInitialMount, setIsInitialMount] = useState(true);

  // Reset selected species when water type changes
  useEffect(() => {
    if (isInitialMount && (initialState?.speciesId || initialState?.species)) {
      setIsInitialMount(false);
      return;
    }
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
        current_species: selectedSpecies
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
        species: selectedSpecies
      });
      setAnalysis(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateSpeciesQuantity = (id: number, delta: number) => {
    setSelectedSpecies(prev => {
      const existing = prev.find(s => s.species_id === id);
      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty <= 0) {
          return prev.filter(s => s.species_id !== id);
        }
        return prev.map(s => s.species_id === id ? { ...s, quantity: newQty } : s);
      } else if (delta > 0) {
        return [...prev, { species_id: id, quantity: delta }];
      }
      return prev;
    });
  };

  const handleSave = async () => {
    const aquariumData = {
      name: aquariumName || `Mój zbiornik ${volume}L`,
      water_type: waterType,
      volume,
      species: selectedSpecies
    };

    if (token) {
      try {
        if (aquariumId) {
          const res = await api.put(`/aquariums/${aquariumId}`, aquariumData);
          navigate(`/report/${res.data.id}`);
        } else {
          const res = await api.post('/aquariums/', aquariumData);
          navigate(`/report/${res.data.id}`);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      localStorage.setItem('pendingAquarium', JSON.stringify(aquariumData));
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-primary mb-4 flex items-center justify-center gap-3">
            <Fish className="w-10 h-10" /> AquaMatch Konfigurator
          </h1>
          <p className="text-lg text-muted-foreground">Zaprojektuj swój idealny zbiornik. Zobacz ocenę surową i rekomendacje na żywo!</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          
          <div className="xl:col-span-1 space-y-6">
            <AquariumParametersForm 
              waterType={waterType} 
              setWaterType={setWaterType} 
              volume={volume} 
              setVolume={setVolume} 
            />
            
            <LiveReportPanel analysis={analysis} />
            
            <button 
                onClick={handleSave}
                disabled={selectedSpecies.length === 0}
                className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {token ? (aquariumId ? 'Zaktualizuj akwarium' : 'Zapisz do Biblioteki') : 'Zaloguj się, aby Zapisać'}
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

          <div className="xl:col-span-1 h-full">
            <SelectedFishesColumn 
              selectedSpecies={selectedSpecies}
              speciesDetails={species}
              updateSpeciesQuantity={updateSpeciesQuantity}
            />
          </div>

          <div className="xl:col-span-2 space-y-6">
            <SpeciesList 
              species={species} 
              recommendedSpecies={recommendedSpecies} 
              selectedSpecies={selectedSpecies} 
              updateSpeciesQuantity={updateSpeciesQuantity} 
            />
          </div>

        </div>
      </div>
    </div>
  );
}

