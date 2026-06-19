import React from 'react';
import { Droplets } from 'lucide-react';

interface AquariumParametersFormProps {
  waterType: string;
  setWaterType: (type: string) => void;
  volume: number;
  setVolume: (vol: number) => void;
}

export default function AquariumParametersForm({
  waterType,
  setWaterType,
  volume,
  setVolume
}: AquariumParametersFormProps) {
  return (
    <div className="bg-card rounded-xl shadow-lg border border-border p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Droplets className="text-primary"/> 1. Parametry
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Typ wody</label>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => setWaterType('freshwater')}
              className={`py-3 px-1 text-sm sm:text-base border rounded-lg text-center transition-colors font-medium ${waterType === 'freshwater' ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'}`}
            >
              Słodkowodne
            </button>
            <button 
              onClick={() => setWaterType('saltwater')}
              className={`py-3 px-1 text-sm sm:text-base border rounded-lg text-center transition-colors font-medium ${waterType === 'saltwater' ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'}`}
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
  );
}
