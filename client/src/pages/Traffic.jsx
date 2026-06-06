import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Map, Activity, Gauge, AlertOctagon } from 'lucide-react';
import axios from 'axios';

const fetchTraffic = () => axios.get('/api/traffic').then(r => r.data);

const statusConfig = {
  green: { label: 'Clear', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', bar: 'bg-emerald-500', dot: 'bg-emerald-400' },
  yellow: { label: 'Moderate', badge: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30', bar: 'bg-yellow-500', dot: 'bg-yellow-400' },
  red: { label: 'Heavy', badge: 'bg-red-500/15 text-red-400 border-red-500/30', bar: 'bg-red-500', dot: 'bg-red-400' },
};

export default function Traffic() {
  const { data: roads, isLoading, error } = useQuery({
    queryKey: ['traffic'],
    queryFn: fetchTraffic,
    refetchInterval: 30000,
  });

  if (error) return <div className="text-red-400 p-8 text-center">Failed to load traffic data.</div>;

  const summary = roads ? {
    clear: roads.filter(r => r.status === 'green').length,
    moderate: roads.filter(r => r.status === 'yellow').length,
    heavy: roads.filter(r => r.status === 'red').length,
  } : null;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Traffic Monitor</h1>
          <p className="text-slate-400 mt-1">Live congestion levels across major city routes.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Auto-refreshes every 30s
        </div>
      </div>

      {/* Summary badges */}
      {summary && (
        <div className="flex flex-wrap gap-3">
          <span className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> {summary.clear} Clear
          </span>
          <span className="flex items-center gap-2 text-sm text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-yellow-400" /> {summary.moderate} Moderate
          </span>
          <span className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-red-400" /> {summary.heavy} Heavy
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {isLoading
          ? [...Array(4)].map((_, i) => <div key={i} className="bg-slate-800 rounded-xl border border-slate-700 h-40 animate-pulse" />)
          : roads?.map(road => {
            const cfg = statusConfig[road.status] || statusConfig.green;
            return (
              <div key={road._id} className="bg-slate-800 rounded-xl border border-slate-700 p-5 hover:border-slate-600 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                      <Map size={17} className="text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-100">{road.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
                        <Activity size={11} /> Live
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.badge}`}>{cfg.label}</span>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Congestion</span>
                      <span className="font-bold text-slate-200">{road.congestion}%</span>
                    </div>
                    <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full ${cfg.bar} rounded-full transition-all duration-1000`} style={{ width: `${road.congestion}%` }} />
                    </div>
                  </div>

                  <div className="flex gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Gauge size={12} /> {road.speed} km/h avg speed
                    </span>
                    {road.incidents > 0 && (
                      <span className="flex items-center gap-1 text-red-400">
                        <AlertOctagon size={12} /> {road.incidents} incident{road.incidents > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
