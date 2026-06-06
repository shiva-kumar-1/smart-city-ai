import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CarFront, CheckCircle2, TrafficCone, ShieldAlert, Construction, Activity, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const fetchDashboard = () => axios.get('/api/dashboard').then(r => r.data);

function StatCard({ title, value, sub, icon: Icon, colorClass }) {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 hover:border-slate-600 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-slate-400 font-medium">{title}</span>
        <div className={`p-2 rounded-lg bg-slate-700/60 ${colorClass}`}>
          <Icon size={16} />
        </div>
      </div>
      <div className="text-3xl font-bold text-slate-100">{value ?? '—'}</div>
      <div className="text-xs text-slate-500 mt-1">{sub}</div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { data, isLoading, error } = useQuery({ queryKey: ['dashboard'], queryFn: fetchDashboard, refetchInterval: 30000 });

  if (error) return <div className="text-red-400 p-8 text-center">Failed to load dashboard data. Ensure backend is running.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">City Overview</h1>
          <p className="text-slate-400 mt-1">Welcome back, <span className="text-blue-400">{user?.name}</span>. Real-time city operations.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Live Data
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-slate-800 rounded-xl border border-slate-700 p-5 animate-pulse h-32" />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="Total Parking Slots"
              value={data?.totalSlots}
              sub="Across all zones"
              icon={CarFront}
              colorClass="text-blue-400"
            />
            <StatCard
              title="Available Parking"
              value={<span className="text-emerald-400">{data?.availableSlots}</span>}
              sub={`${data?.occupancyRate}% occupied`}
              icon={CheckCircle2}
              colorClass="text-emerald-400"
            />
            <StatCard
              title="Traffic Status"
              value={<span className={data?.trafficStatus === 'Heavy' ? 'text-red-400' : data?.trafficStatus === 'Moderate' ? 'text-yellow-400' : 'text-emerald-400'}>{data?.trafficStatus}</span>}
              sub={`Avg congestion: ${data?.avgCongestion}%`}
              icon={TrafficCone}
              colorClass="text-yellow-400"
            />
            <StatCard
              title="Active Incidents"
              value={<span className="text-red-400">{data?.activeIncidents}</span>}
              sub={`${data?.pendingRoadReports} road reports pending`}
              icon={ShieldAlert}
              colorClass="text-red-400"
            />
          </div>

          {/* Quick summary row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
              <div className="flex items-center gap-3 mb-3">
                <Activity size={18} className="text-blue-400" />
                <span className="font-semibold text-slate-200">Roads Monitored</span>
              </div>
              <div className="text-4xl font-bold text-slate-100">{data?.totalRoads}</div>
              <p className="text-xs text-slate-500 mt-1">Active monitoring points</p>
            </div>
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
              <div className="flex items-center gap-3 mb-3">
                <Construction size={18} className="text-amber-400" />
                <span className="font-semibold text-slate-200">Road Reports</span>
              </div>
              <div className="text-4xl font-bold text-amber-400">{data?.pendingRoadReports}</div>
              <p className="text-xs text-slate-500 mt-1">Awaiting review</p>
            </div>
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle size={18} className="text-orange-400" />
                <span className="font-semibold text-slate-200">Parking Occupancy</span>
              </div>
              <div className="text-4xl font-bold text-slate-100">{data?.occupancyRate}%</div>
              <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${data?.occupancyRate > 80 ? 'bg-red-500' : data?.occupancyRate > 60 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                  style={{ width: `${data?.occupancyRate}%` }}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
