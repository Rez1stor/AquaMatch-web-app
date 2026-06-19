import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Droplets, Beaker, Fish, ArrowRight, ShieldCheck, Activity, Database } from 'lucide-react';

export default function LandingView() {
  const navigate = useNavigate();
  const [waterType, setWaterType] = useState('freshwater');
  const [volume, setVolume] = useState<number | string>(100);
  const [speciesList, setSpeciesList] = useState<any[]>([]);
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string>('');

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const res = await api.get(`/species/?water_type=${waterType}`);
        setSpeciesList(res.data);
        if (res.data.length > 0) {
          setSelectedSpeciesId(res.data[0].id.toString());
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSpecies();
  }, [waterType]);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedVolume = parseInt(volume.toString()) || 0;
    if (parsedVolume < 10) {
      alert("Pojemność akwarium musi wynosić co najmniej 10 litrów.");
      return;
    }
    navigate('/calculator', { 
      state: { 
        waterType, 
        volume: parsedVolume, 
        speciesId: selectedSpeciesId 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <div className="relative bg-foreground overflow-hidden">
        <div className="absolute inset-0 bg-primary/10 mix-blend-multiply pointer-events-none"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10 flex flex-col lg:flex-row items-center gap-12">
          
          <div className="flex-1 text-center lg:text-left space-y-8 animate-fadeIn">
            <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tight leading-tight">
              Twój zbiornik.<br/>
              <span className="text-primary">Zaprojektowany</span> bezbłędnie.
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              Inteligentny kalkulator obsady akwarium, który analizuje parametry wody, poziom bioloadu oraz agresję międzygatunkową. Zbuduj bezpieczny ekosystem w kilka minut.
            </p>
          </div>

          <div className="flex-1 w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border p-8 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              Szybki Start
            </h3>
            <form onSubmit={handleStart} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-muted-foreground mb-2 flex items-center gap-2">
                  <Droplets className="w-4 h-4" /> Typ wody
                </label>
                <select 
                  value={waterType} 
                  onChange={e => setWaterType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-input-background focus:ring-2 focus:ring-primary outline-none transition-all"
                >
                  <option value="freshwater">Słodkowodne (Freshwater)</option>
                  <option value="saltwater">Słonowodne (Saltwater)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-muted-foreground mb-2 flex items-center gap-2">
                  <Beaker className="w-4 h-4" /> Pojemność (Litry)
                </label>
                <input 
                  type="number" 
                  value={volume}
                  onChange={e => setVolume(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-input-background focus:ring-2 focus:ring-primary outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Wpisz pojemność (np. 100)"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-muted-foreground mb-2 flex items-center gap-2">
                  <Fish className="w-4 h-4" /> Twoja pierwsza rybka
                </label>
                <select 
                  value={selectedSpeciesId} 
                  onChange={e => setSelectedSpeciesId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-input-background focus:ring-2 focus:ring-primary outline-none transition-all"
                  required
                >
                  <option value="" disabled>Wybierz gatunek...</option>
                  {speciesList.map(sp => (
                    <option key={sp.id} value={sp.id}>{sp.name}</option>
                  ))}
                </select>
              </div>

              <button 
                type="submit"
                className="w-full py-4 mt-2 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-primary/20"
              >
                Skonfiguruj Akwarium <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* About Section */}
      <div className="flex-1 py-20 bg-background text-foreground">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl font-bold text-foreground">Czym jest AquaMatch?</h2>
            <p className="text-muted-foreground text-lg">
              Tworzenie akwarium to sztuka poszukiwania balansu. Nasze oprogramowanie działa jak wirtualny biolog morski. Obliczamy chemię wody, zapotrzebowanie przestrzenne oraz przewidujemy zachowanie poszczególnych gatunków, aby ustrzec Cię przed kosztownymi błędami.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-2xl border border-border shadow-md">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary mb-4">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Kalkulator Bioload</h3>
              <p className="text-muted-foreground">W czasie rzeczywistym obliczamy obciążenie biologiczne zbiornika. Dowiesz się, kiedy system filtracji przestanie wyrabiać z procesem azotowym.</p>
            </div>

            <div className="bg-card p-6 rounded-2xl border border-border shadow-md">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">System Ostrzeżeń</h3>
              <p className="text-muted-foreground">Ostrzeżemy Cię przed połączeniem ryb terytorialnych, agresywnych czy drapieżników ze zbyt drobnymi rybkami ławicowymi, by uniknąć tragedii.</p>
            </div>

            <div className="bg-card p-6 rounded-2xl border border-border shadow-md">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary mb-4">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Katalog Gatunków</h3>
              <p className="text-muted-foreground">Potężna baza danych dla akwarystów słodkowodnych i morskich z rekomendacjami optymalnych parametrów wody.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
