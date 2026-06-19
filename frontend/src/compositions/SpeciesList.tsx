import React, { useState } from 'react';
import { Search, CheckCircle2, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Species {
  id: number;
  name: string;
  scientific_name: string;
  bioload: number;
  tags: string;
  image_url: string;
}

interface RecommendedSpecies extends Species {
  compatibility_percentage?: number;
}

interface SpeciesListProps {
  species: Species[];
  recommendedSpecies: RecommendedSpecies[];
  selectedSpecies: {species_id: number, quantity: number}[];
  updateSpeciesQuantity: (id: number, delta: number) => void;
}

export default function SpeciesList({
  species,
  recommendedSpecies,
  selectedSpecies,
  updateSpeciesQuantity
}: SpeciesListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSpecies = species.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.tags.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getQuantity = (id: number) => {
    return selectedSpecies.find(s => s.species_id === id)?.quantity || 0;
  };

  return (
    <div className="space-y-6">
      {/* Rekomendacje */}
      {recommendedSpecies.length > 0 && (
        <div className="bg-primary/5 rounded-xl border border-primary/20 p-6 animate-fadeIn">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary">
            <CheckCircle2 /> Rekomendowane dla Ciebie (Top {recommendedSpecies.length})
          </h3>
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AnimatePresence>
              {recommendedSpecies.map(sp => (
                <motion.div 
                  key={sp.id} 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col p-3 border border-primary/30 rounded-xl bg-card"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                    <div className="bg-white rounded-lg p-1 mr-3 shrink-0 ring-1 ring-border/50">
                      <img src={sp.image_url} alt={sp.name} className="w-10 h-10 object-contain mix-blend-multiply" referrerPolicy="no-referrer" />
                    </div>
                      <div>
                        <p className="text-sm font-bold truncate max-w-[120px]">{sp.name}</p>
                        <p className="text-xs text-muted-foreground">Bioload: {sp.bioload}L</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => updateSpeciesQuantity(sp.id, 1)}
                      className="p-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {sp.compatibility_percentage !== undefined && (
                    <div className="mt-1">
                      <div className="flex justify-between text-[10px] mb-1 font-bold">
                        <span className="text-muted-foreground">Zgodność:</span>
                        <span className={sp.compatibility_percentage > 80 ? 'text-primary' : sp.compatibility_percentage > 50 ? 'text-yellow-500' : 'text-destructive'}>
                          {sp.compatibility_percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-700 ease-in-out ${sp.compatibility_percentage > 80 ? 'bg-primary' : sp.compatibility_percentage > 50 ? 'bg-yellow-500' : 'bg-destructive'}`} 
                          style={{ width: `${sp.compatibility_percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      )}

      {/* Wybór Obsady */}
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
            const qty = getQuantity(sp.id);
            const isSelected = qty > 0;
            return (
              <div 
                key={sp.id} 
                className={`relative flex flex-col p-4 border rounded-xl transition-all ${isSelected ? 'border-primary bg-primary/5 ring-1 ring-primary/50' : 'border-border hover:border-primary/30 hover:bg-muted/30'}`}
              >
                <div className="flex items-center mb-3">
                  <div className="bg-white rounded-lg p-1 mr-4 shrink-0 ring-1 ring-border/50">
                    <img src={sp.image_url} alt={sp.name} className="w-16 h-16 object-contain mix-blend-multiply" referrerPolicy="no-referrer" />
                  </div>
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
                </div>
                
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
                  <span className="text-xs font-medium text-muted-foreground">Bioload: {sp.bioload}L/szt.</span>
                  
                  {isSelected ? (
                    <span className="text-primary font-bold text-sm flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Dodano ({qty})
                    </span>
                  ) : (
                    <button 
                      onClick={() => updateSpeciesQuantity(sp.id, 1)}
                      className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors text-sm font-bold"
                    >
                      Dodaj
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
