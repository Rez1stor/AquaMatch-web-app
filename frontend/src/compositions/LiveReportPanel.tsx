import React from 'react';
import { Info, ShieldAlert, AlertTriangle, Fish } from 'lucide-react';

interface SpeciesDetail {
  id: number;
  name: string;
  quantity: number;
  total_bioload: number;
  percentage_of_tank: number;
}

interface LiveReportPanelProps {
  analysis: {
    compatibility_score: number;
    total_bioload: number;
    capacity: number;
    warnings: Array<{ type: string; message: string }>;
    species_details?: SpeciesDetail[];
    recommended_parameters?: {
      ph: string;
      temperature: string;
      salinity: string;
      food: string;
    };
  } | null;
}

export default function LiveReportPanel({ analysis }: LiveReportPanelProps) {
  if (!analysis) return null;

  return (
    <div className="bg-card rounded-xl shadow-lg border border-border p-6 animate-fadeIn">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Info className="text-primary"/> Raport Na Żywo</h2>
      
      <div className="mb-6 flex flex-col items-center">
        <div className="relative">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted" />
            <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" 
              strokeDasharray={377} 
              style={{ strokeDashoffset: 377 - (377 * analysis.compatibility_score) / 100, transition: 'stroke-dashoffset 1s ease-in-out, stroke 0.5s ease-in-out' }} 
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
        <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
          <div className={`h-2.5 rounded-full transition-all duration-700 ease-in-out ${analysis.total_bioload > analysis.capacity ? 'bg-destructive' : 'bg-primary'}`} style={{ width: `${Math.min(100, (analysis.total_bioload / analysis.capacity) * 100)}%` }}></div>
        </div>
      </div>

      {analysis.warnings.length > 0 && (
        <div className="space-y-2 mt-4 mb-6">
          {analysis.warnings.map((w, idx) => (
            <div key={idx} className={`p-3 rounded-lg text-sm flex items-start ${w.type === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-yellow-50 text-yellow-800'}`}>
              {w.type === 'error' ? <ShieldAlert className="w-5 h-5 mr-2 shrink-0" /> : <AlertTriangle className="w-5 h-5 mr-2 shrink-0" />}
              <span>{w.message}</span>
            </div>
          ))}
        </div>
      )}

      {analysis.recommended_parameters && (
        <div className="mt-4 mb-6 bg-primary/5 rounded-xl border border-primary/20 p-4">
          <h3 className="font-bold text-sm text-primary mb-3">Zalecane Parametry</h3>
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li className="flex justify-between border-b border-primary/10 pb-1">
              <span className="font-medium text-foreground">Temperatura:</span> 
              <span>{analysis.recommended_parameters.temperature}</span>
            </li>
            <li className="flex justify-between border-b border-primary/10 pb-1">
              <span className="font-medium text-foreground">pH:</span> 
              <span>{analysis.recommended_parameters.ph}</span>
            </li>
            <li className="flex justify-between border-b border-primary/10 pb-1">
              <span className="font-medium text-foreground">Zasolenie:</span> 
              <span>{analysis.recommended_parameters.salinity}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium text-foreground">Pokarm:</span> 
              <span>{analysis.recommended_parameters.food}</span>
            </li>
          </ul>
        </div>
      )}

      {analysis.species_details && analysis.species_details.length > 0 && (
        <div className="mt-6 border-t border-border pt-4">
          <h3 className="font-bold mb-3 text-sm text-muted-foreground flex items-center gap-2">
            <Fish className="w-4 h-4" /> Szczegółowe obciążenie
          </h3>
          <div className="space-y-3">
            {analysis.species_details.map(sd => (
              <div key={sd.id} className="text-sm">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{sd.name} (x{sd.quantity})</span>
                  <span className="text-muted-foreground">{sd.total_bioload}L</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primary/60 h-1.5 rounded-full transition-all duration-700 ease-in-out" style={{ width: `${Math.min(100, sd.percentage_of_tank)}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
