import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Fuel, MapPin, ExternalLink, Zap } from 'lucide-react';
import axios from 'axios';

const fetchStations = () => axios.get('/api/fuelstations').then(r => r.data);

const typeLabel = { petrol_diesel: 'Petrol & Diesel', ev_charging: 'EV Charging', petrol_diesel_ev: 'Petrol, Diesel & EV' };
const typeColor = {
  petrol_diesel: 'bg-orange-500/10 text-orange-400',
  ev_charging: 'bg-emerald-500/10 text-emerald-400',
  petrol_diesel_ev: 'bg-blue-500/10 text-blue-400',
};

export default function FuelStations() {
  const { data: stations, isLoading, error } = useQuery({ queryKey: ['fuelstations'], queryFn: fetchStations });
  const openMaps = (q) => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`, '_blank');

  if (error) return <div className="text-red-400 p-8 text-center">Failed to load fuel stations.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Fuel & EV Stations</h1>
        <p className="text-slate-400 mt-1">Find nearby petrol pumps and EV charging points.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading
          ? [...Array(6)].map((_, i) => <div key={i} className="bg-slate-800 rounded-xl border border-slate-700 h-44 animate-pulse" />)
          : stations?.map(station => (
            <div key={station.id} className="bg-slate-800 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors flex flex-col overflow-hidden">
              <div className="p-5 flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="p-2.5 rounded-lg bg-blue-500/10">
                    {station.type === 'ev_charging' ? <Zap size={20} className="text-emerald-400" /> : <Fuel size={20} className="text-blue-400" />}
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${typeColor[station.type] || 'bg-slate-700 text-slate-300'}`}>
                    {typeLabel[station.type] || station.type}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 leading-tight">{station.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{station.brand}</p>
                </div>
                <div className="flex items-start gap-1.5 text-sm text-slate-400">
                  <MapPin size={14} className="mt-0.5 shrink-0" />
                  <span>{station.address}</span>
                </div>
              </div>
              <div className="p-4 border-t border-slate-700 bg-slate-700/20">
                <button
                  onClick={() => openMaps(station.mapsQuery)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
                >
                  Open in Maps <ExternalLink size={14} />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
