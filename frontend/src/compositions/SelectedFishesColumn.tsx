import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Species {
  id: number;
  name: string;
  scientific_name: string;
  bioload: number;
  image_url: string;
}

interface SelectedFishesColumnProps {
  selectedSpecies: {species_id: number, quantity: number}[];
  speciesDetails: Species[];
  updateSpeciesQuantity: (id: number, delta: number) => void;
}

export default function SelectedFishesColumn({
  selectedSpecies,
  speciesDetails,
  updateSpeciesQuantity
}: SelectedFishesColumnProps) {

  if (selectedSpecies.length === 0) {
    return (
      <div className="bg-card rounded-xl shadow-lg border border-border p-6 h-full flex flex-col items-center justify-center text-center text-muted-foreground min-h-[400px]">
        <div className="w-16 h-16 mb-4 opacity-20 rounded-full border-4 border-dashed flex items-center justify-center">
          +
        </div>
        <p className="font-bold text-lg">Moje Akwarium jest puste</p>
        <p className="text-sm">Kliknij rybę w Katalogu, aby ją tu dodać.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl shadow-lg border border-border p-6 flex flex-col max-h-[800px]">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
        <h2 className="text-xl font-bold text-primary">Moja Obsada</h2>
        <span className="text-sm font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
          Gatunków: {selectedSpecies.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        <AnimatePresence>
          {selectedSpecies.map(item => {
            const sp = speciesDetails.find(s => s.id === item.species_id);
            if (!sp) return null;

            return (
              <motion.div 
                key={item.species_id} 
                layout
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between p-3 border border-border rounded-xl bg-background hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="bg-white rounded-lg p-1 shrink-0 ring-1 ring-border/50">
                    <img src={sp.image_url} alt={sp.name} className="w-10 h-10 object-contain mix-blend-multiply" referrerPolicy="no-referrer" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate" title={sp.name}>{sp.name}</p>
                    <p className="text-xs text-muted-foreground">Bioload: {sp.bioload * item.quantity}L</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1 shrink-0 ml-2">
                  <button 
                    onClick={() => updateSpeciesQuantity(sp.id, -1)}
                    className="p-1.5 hover:bg-destructive/10 text-destructive rounded-md transition-colors"
                  >
                    {item.quantity === 1 ? <Trash2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                  </button>
                  <span className="font-bold text-sm min-w-[20px] text-center">{item.quantity}</span>
                  <button 
                    onClick={() => updateSpeciesQuantity(sp.id, 1)}
                    className="p-1.5 hover:bg-primary/10 text-primary rounded-md transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
