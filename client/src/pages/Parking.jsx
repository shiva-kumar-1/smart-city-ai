import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CarFront, MapPin, Clock, IndianRupee, Lock } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'wouter';

const fetchParking = () => axios.get('/api/parking').then(r => r.data);
const reserveSlot = (id) => axios.post(`/api/parking/reserve/${id}`).then(r => r.data);
const releaseSlot = (id) => axios.post(`/api/parking/release/${id}`).then(r => r.data);

export default function Parking() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { data: locations, isLoading, error } = useQuery({ queryKey: ['parking'], queryFn: fetchParking, refetchInterval: 20000 });
  const reserve = useMutation({ mutationFn: reserveSlot, onSuccess: () => { qc.invalidateQueries(['parking']); qc.invalidateQueries(['dashboard']); } });
  const release = useMutation({ mutationFn: releaseSlot, onSuccess: () => { qc.invalidateQueries(['parking']); qc.invalidateQueries(['dashboard']); } });

  if (error) return <div className="text-red-400 p-8 text-center">Failed to load parking data.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Parking Management</h1>
        <p className="text-slate-400 mt-1">Monitor availability and reserve slots in real-time.</p>
      </div>

      {!user && (
        <div className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/30 rounded-xl px-5 py-4 text-sm text-blue-300">
          <Lock size={16} /> Sign in to reserve or release parking slots.
          <button onClick={() => navigate('/auth')} className="ml-auto text-blue-400 underline font-medium">Sign in</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading
          ? [...Array(3)].map((_, i) => <div key={i} className="bg-slate-800 rounded-xl border border-slate-700 h-52 animate-pulse" />)
          : locations?.map(loc => {
            const pct = Math.round(((loc.totalSlots - loc.availableSlots) / loc.totalSlots) * 100);
            const full = loc.availableSlots === 0;
            return (
              <div key={loc._id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-slate-600 transition-colors flex flex-col">
                <div className="p-5 flex-1 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <CarFront size={18} className="text-blue-400" />
                        <h3 className="font-semibold text-lg text-slate-100">{loc.name}</h3>
                      </div>
                      <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">{loc.zone}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <MapPin size={12} /> {loc.address}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Occupancy</span>
                      <span className="text-slate-300 font-medium">{pct}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-700 ${full ? 'bg-red-500' : pct > 80 ? 'bg-orange-500' : pct > 60 ? 'bg-yellow-500' : 'bg-emerald-500'}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Available</div>
                      <div className={`text-3xl font-bold ${full ? 'text-red-400' : 'text-emerald-400'}`}>{loc.availableSlots}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Total</div>
                      <div className="text-xl font-semibold text-slate-300">{loc.totalSlots}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Rate</div>
                      <div className="flex items-center gap-0.5 text-slate-300 font-semibold">
                        <IndianRupee size={13} />{loc.pricePerHour}/hr
                      </div>
                    </div>
                  </div>
                </div>

                {user ? (
                  <div className="flex gap-2 p-4 bg-slate-700/30 border-t border-slate-700">
                    <button
                      disabled={full || reserve.isPending}
                      onClick={() => reserve.mutate(loc._id)}
                      className="flex-1 py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
                    >Reserve</button>
                    <button
                      disabled={loc.availableSlots >= loc.totalSlots || release.isPending}
                      onClick={() => release.mutate(loc._id)}
                      className="flex-1 py-2 px-4 rounded-lg bg-slate-600 hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-200 text-sm font-medium transition-colors border border-slate-600"
                    >Release</button>
                  </div>
                ) : (
                  <div className="flex p-4 bg-slate-700/20 border-t border-slate-700">
                    <button onClick={() => navigate('/auth')} className="flex-1 py-2 text-sm text-slate-500 border border-slate-600 rounded-lg hover:text-slate-300 transition-colors">
                      Sign in to reserve
                    </button>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
