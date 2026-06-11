import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Check, ChevronRight, Search } from 'lucide-react';

export default function AquariumBuilderView() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [waterType, setWaterType] = useState('freshwater');
  const [volume, setVolume] = useState<number>(100);
  
  const [species, setSpecies] = useState<any[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (step === 2) {
      fetchSpecies();
    }
  }, [step, waterType]);

  const fetchSpecies = async () => {
    try {
      const res = await api.get(`/species/?water_type=${waterType}`);
      setSpecies(res.data);
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
    try {
      const res = await api.post('/aquariums/', {
        name,
        water_type: waterType,
        volume,
        species_ids: selectedSpecies
      });
      navigate(`/report/${res.data.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredSpecies = species.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.tags.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
            <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-aqua-500 -z-10 transition-all duration-300 ${step === 1 ? 'w-0' : 'w-full'}`}></div>
            
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-aqua-600 text-white' : 'bg-gray-200 text-gray-500'} font-bold`}>1</div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-aqua-600 text-white' : 'bg-gray-200 text-gray-500'} font-bold`}>2</div>
          </div>
          <div className="flex justify-between mt-2 text-sm font-medium text-gray-500">
            <span>Środowisko</span>
            <span>Obsada</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-aqua-100 p-8">
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-bold text-gray-900">Konfiguracja parametrów środowiska</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nazwa projektu</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-aqua-500 focus:border-aqua-500"
                  placeholder="np. Moja rafa koralowa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Typ wody</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setWaterType('freshwater')}
                    className={`p-4 border rounded-lg text-center transition-colors ${waterType === 'freshwater' ? 'border-aqua-500 bg-aqua-50 text-aqua-700' : 'border-gray-200 hover:border-aqua-300'}`}
                  >
                    Słodkowodne
                  </button>
                  <button 
                    onClick={() => setWaterType('saltwater')}
                    className={`p-4 border rounded-lg text-center transition-colors ${waterType === 'saltwater' ? 'border-aqua-500 bg-aqua-50 text-aqua-700' : 'border-gray-200 hover:border-aqua-300'}`}
                  >
                    Morskie
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pojemność (litry)</label>
                <input 
                  type="number" 
                  value={volume} 
                  onChange={e => setVolume(Number(e.target.value))} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-aqua-500 focus:border-aqua-500"
                  min="10"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  onClick={() => setStep(2)}
                  disabled={!name || volume <= 0}
                  className="flex items-center px-6 py-2 bg-aqua-600 text-white rounded-md hover:bg-aqua-700 disabled:opacity-50 transition-colors"
                >
                  Dalej <ChevronRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-bold text-gray-900">Katalog i wyszukiwarka gatunków</h2>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-aqua-500 focus:border-aqua-500 sm:text-sm"
                  placeholder="Szukaj gatunku lub tagu (np. peaceful)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
                {filteredSpecies.map(sp => {
                  const isSelected = selectedSpecies.includes(sp.id);
                  return (
                    <div 
                      key={sp.id} 
                      onClick={() => toggleSpecies(sp.id)}
                      className={`relative flex items-center p-4 border rounded-xl cursor-pointer transition-all ${isSelected ? 'border-aqua-500 bg-aqua-50 ring-1 ring-aqua-500' : 'border-gray-200 hover:border-aqua-300 hover:bg-gray-50'}`}
                    >
                      <img src={sp.image_url} alt={sp.name} className="w-16 h-16 rounded-lg object-cover mr-4" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{sp.name}</p>
                        <p className="text-xs text-gray-500 italic truncate">{sp.scientific_name}</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {sp.tags.split(',').map((tag: string, i: number) => (
                            <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-800">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 text-aqua-600">
                          <Check className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex justify-between">
                <button 
                  onClick={() => setStep(1)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Wstecz
                </button>
                <button 
                  onClick={handleSave}
                  className="px-6 py-2 bg-aqua-600 text-white rounded-md hover:bg-aqua-700 transition-colors"
                >
                  Zapisz i Analizuj
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
