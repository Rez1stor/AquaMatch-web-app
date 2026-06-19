import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, BookOpen, Droplets } from 'lucide-react';

export default function CatalogView() {
  const [species, setSpecies] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [waterTypeFilter, setWaterTypeFilter] = useState<'all' | 'freshwater' | 'saltwater'>('all');

  useEffect(() => {
    fetchSpecies();
  }, []);

  const fetchSpecies = async () => {
    try {
      const res = await api.get('/species/');
      setSpecies(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredSpecies = species.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.tags.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.scientific_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = waterTypeFilter === 'all' || s.water_type === waterTypeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-primary mb-4 flex items-center justify-center gap-3">
            <BookOpen className="w-10 h-10" /> Katalog Gatunków
          </h1>
          <p className="text-lg text-muted-foreground">Przeglądaj pełną bazę wiedzy AquaMatch.</p>
        </div>

        <div className="bg-card rounded-xl shadow-lg border border-border p-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-input bg-input-background rounded-xl text-base focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="Wyszukaj po nazwie lub tagach..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Droplets className="text-muted-foreground" />
            <select 
              className="py-3 px-4 rounded-xl border border-input bg-input-background focus:ring-2 focus:ring-primary outline-none w-full sm:w-auto"
              value={waterTypeFilter}
              onChange={(e) => setWaterTypeFilter(e.target.value as any)}
            >
              <option value="all">Wszystkie wody</option>
              <option value="freshwater">Słodkowodne</option>
              <option value="saltwater">Morskie</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredSpecies.map(sp => (
            <div key={sp.id} className="bg-card rounded-xl shadow-md border border-border overflow-hidden hover:shadow-lg transition-shadow hover:border-primary/50">
              <div className="h-48 overflow-hidden bg-white flex items-center justify-center p-2">
                <img src={sp.image_url} alt={sp.name} className="w-full h-full object-contain mix-blend-multiply hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold truncate" title={sp.name}>{sp.name}</h3>
                <p className="text-sm text-muted-foreground italic mb-3 truncate">{sp.scientific_name}</p>
                <div className="flex justify-between items-center text-sm mb-3">
                  <span className="font-medium text-foreground">Bioload: {sp.bioload}L</span>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${sp.water_type === 'freshwater' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'}`}>
                    {sp.water_type === 'freshwater' ? 'Słodkie' : 'Morskie'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {sp.tags.split(',').map((tag: string, i: number) => (
                    <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {filteredSpecies.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground text-lg">
              Brak gatunków spełniających kryteria wyszukiwania.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
