import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Fish, Droplets, Trash2 } from 'lucide-react';

export default function DashboardView() {
  const [aquariums, setAquariums] = useState<any[]>([]);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAquariums();
  }, []);

  const fetchAquariums = async () => {
    try {
      const res = await api.get('/aquariums/');
      setAquariums(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteAquarium = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Czy na pewno chcesz usunąć ten zbiornik?')) {
      try {
        await api.delete(`/aquariums/${id}`);
        fetchAquariums();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">


      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Twoje Zbiorniki</h1>
          <button
            onClick={() => navigate('/calculator')}
            className="flex items-center px-4 py-2 bg-aqua-600 text-white rounded-md hover:bg-aqua-700 transition-colors"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Nowy Zbiornik
          </button>
        </div>

        {aquariums.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-aqua-100 p-12 text-center">
            <Fish className="w-16 h-16 mx-auto text-aqua-200 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Brak zbiorników</h3>
            <p className="mt-1 text-gray-500">Rozpocznij projektowanie swojego pierwszego akwarium.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {aquariums.map((aq) => (
              <div key={aq.id} className="bg-white overflow-hidden shadow-sm rounded-xl border border-aqua-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/report/${aq.id}`)}>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">{aq.name}</h3>
                    <div className="flex items-center gap-2">
                      <Droplets className={`w-6 h-6 ${aq.water_type === 'saltwater' ? 'text-blue-500' : 'text-teal-500'}`} />
                      <button onClick={(e) => deleteAquarium(aq.id, e)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <dl className="mt-4 flex flex-col gap-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <dt>Pojemność:</dt>
                      <dd className="font-medium text-gray-900">{aq.volume} L</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Środowisko:</dt>
                      <dd className="font-medium text-gray-900">{aq.water_type === 'saltwater' ? 'Morskie' : 'Słodkowodne'}</dd>
                    </div>
                  </dl>
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <button className="w-full py-2 bg-primary/10 text-primary rounded-md font-medium hover:bg-primary/20 transition-colors">
                      Otwórz akwarium
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
