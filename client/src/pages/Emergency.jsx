import React from 'react';
import { MapPin, PhoneCall, ShieldAlert, Stethoscope, Flame, Siren } from 'lucide-react';

const services = [
  { id: 'hospital', name: 'Hospitals', desc: 'Emergency medical care and trauma centers.', query: 'hospital near me', Icon: Stethoscope, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  { id: 'police', name: 'Police Stations', desc: 'Law enforcement and public safety.', query: 'police station near me', Icon: ShieldAlert, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { id: 'fire', name: 'Fire Stations', desc: 'Fire rescue and hazardous material response.', query: 'fire station near me', Icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  { id: 'ambulance', name: 'Ambulance Services', desc: 'Emergency medical transport and paramedics.', query: 'ambulance service near me', Icon: Siren, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
];

export default function Emergency() {
  const openMaps = (q) => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`, '_blank');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
          <span className="relative flex h-3.5 w-3.5 mt-0.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500" />
          </span>
          Emergency Services
        </h1>
        <p className="text-slate-400 mt-1">Quick access to essential city emergency services.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {services.map(({ id, name, desc, query, Icon, color, bg, border }) => (
          <div key={id} className={`bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-slate-600 transition-colors flex flex-col sm:flex-row`}>
            <div className={`flex items-center justify-center p-6 sm:p-8 ${bg} border-b sm:border-b-0 sm:border-r ${border}`}>
              <Icon size={44} className={color} />
            </div>
            <div className="p-5 flex flex-col justify-between flex-1">
              <div className="mb-4">
                <h3 className="font-semibold text-lg text-slate-100 mb-1">{name}</h3>
                <p className="text-sm text-slate-400">{desc}</p>
              </div>
              <button
                onClick={() => openMaps(query)}
                className="flex items-center gap-2 self-start py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
              >
                <MapPin size={15} /> Find on Maps
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-6 rounded-xl border border-red-500/20 bg-red-500/5 text-center">
        <PhoneCall size={28} className="mx-auto text-red-400 mb-2" />
        <h2 className="text-xl font-bold text-slate-100 mb-1">Life-threatening emergency?</h2>
        <p className="text-2xl font-bold text-red-400 tracking-widest">DIAL 112 / 100 / 101</p>
        <p className="text-slate-500 text-sm mt-2">Police: 100 · Fire: 101 · Ambulance: 108 · National Emergency: 112</p>
      </div>
    </div>
  );
}
