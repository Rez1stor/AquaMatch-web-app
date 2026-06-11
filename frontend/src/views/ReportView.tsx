import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';

export default function ReportView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [aquarium, setAquarium] = useState<any>(null);
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const aqRes = await api.get(`/aquariums/${id}`);
      setAquarium(aqRes.data);
      
      const analyzeRes = await api.post('/aquariums/analyze', {
        water_type: aqRes.data.water_type,
        volume: aqRes.data.volume,
        species_ids: aqRes.data.species.map((s: any) => s.id)
      });
      setReport(analyzeRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!aquarium || !report) return <div className="flex justify-center items-center h-screen">Ładowanie...</div>;

  const bioloadPercentage = Math.min((report.total_bioload / report.capacity) * 100, 100);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-aqua-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Powrót do kokpitu
        </button>

        <div className="bg-white rounded-xl shadow-lg border border-aqua-100 overflow-hidden">
          <div className="bg-aqua-600 px-6 py-8 text-white">
            <h1 className="text-3xl font-bold">{aquarium.name}</h1>
            <p className="mt-2 text-aqua-100">Moduł Raportowania - Wyniki analizy</p>
          </div>

          <div className="p-8 space-y-8">
            
            {/* Score */}
            <div className="flex flex-col md:flex-row gap-8 items-center justify-between bg-gray-50 p-6 rounded-xl border border-gray-100">
              <div className="text-center md:text-left">
                <h3 className="text-lg font-medium text-gray-500">Compatibility Score</h3>
                <div className="mt-1 flex items-baseline justify-center md:justify-start">
                  <span className={`text-5xl font-extrabold ${report.compatibility_score >= 80 ? 'text-green-500' : report.compatibility_score >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                    {report.compatibility_score}
                  </span>
                  <span className="ml-1 text-xl font-medium text-gray-500">/100</span>
                </div>
              </div>
              
              <div className="flex-1 w-full max-w-md">
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span className="text-gray-500">Obciążenie biologiczne</span>
                  <span className={report.total_bioload > report.capacity ? 'text-red-500 font-bold' : 'text-gray-900'}>
                    {report.total_bioload} L / {report.capacity} L
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${report.total_bioload > report.capacity ? 'bg-red-500' : report.total_bioload > report.capacity * 0.8 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                    style={{ width: `${bioloadPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Warnings */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Lista ostrzeżeń</h3>
              {report.warnings.length === 0 ? (
                <div className="flex items-center bg-green-50 p-4 rounded-lg border border-green-200">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  <p className="text-green-800 font-medium">Brak ostrzeżeń. Obsada jest idealnie dobrana!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {report.warnings.map((w: any, idx: number) => (
                    <div key={idx} className={`flex items-start p-4 rounded-lg border ${w.type === 'error' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}`}>
                      <AlertTriangle className={`w-6 h-6 mr-3 flex-shrink-0 ${w.type === 'error' ? 'text-red-500' : 'text-yellow-500'}`} />
                      <p className={`font-medium ${w.type === 'error' ? 'text-red-800' : 'text-yellow-800'}`}>{w.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Species List */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Wybrane gatunki ({aquarium.species.length})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {aquarium.species.map((sp: any) => (
                  <div key={sp.id} className="flex items-center p-3 border rounded-lg bg-white">
                    <img src={sp.image_url} alt={sp.name} className="w-12 h-12 rounded bg-gray-100 object-cover mr-3" />
                    <div>
                      <p className="font-medium text-sm text-gray-900">{sp.name}</p>
                      <p className="text-xs text-gray-500">Bioload: {sp.bioload}L</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
