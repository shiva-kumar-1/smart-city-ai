import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Construction, Upload, AlertTriangle, CheckCircle2, Clock,
  MapPin, Brain, ChevronDown, Image, X, Filter, Shield,
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'wouter';

const fetchReports = (params) => axios.get('/api/road-damage', { params }).then(r => r.data);
const fetchStats = () => axios.get('/api/road-damage/stats').then(r => r.data);

const severityConfig = {
  low: { label: 'Low', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  medium: { label: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  high: { label: 'High', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  critical: { label: 'Critical', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
};

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'text-slate-400' },
  under_review: { label: 'Under Review', icon: Brain, color: 'text-blue-400' },
  in_progress: { label: 'In Progress', icon: Construction, color: 'text-yellow-400' },
  resolved: { label: 'Resolved', icon: CheckCircle2, color: 'text-emerald-400' },
};

const damageTypes = ['pothole', 'crack', 'subsidence', 'flooding', 'debris', 'other'];

function ReportForm({ onSuccess }) {
  const [form, setForm] = useState({ location: '', damageType: 'pothole', severity: 'medium', description: '' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef();
  const qc = useQueryClient();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.location) { setError('Location is required'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('image', image);
      await axios.post('/api/road-damage', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm({ location: '', damageType: 'pothole', severity: 'medium', description: '' });
      setImage(null); setPreview(null);
      qc.invalidateQueries(['road-damage']);
      qc.invalidateQueries(['dashboard']);
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 rounded-xl border border-slate-700 p-6 space-y-4">
      <h2 className="font-semibold text-slate-100 flex items-center gap-2">
        <Construction size={18} className="text-amber-400" /> Submit Road Damage Report
      </h2>

      {error && <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs text-slate-400 mb-1.5">Location / Address *</label>
          <div className="relative">
            <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={form.location}
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              placeholder="E.g. MG Road near City Mall, Hyderabad"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-9 pr-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Damage Type *</label>
          <select
            value={form.damageType}
            onChange={e => setForm(f => ({ ...f, damageType: e.target.value }))}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2.5 text-slate-100 focus:outline-none focus:border-blue-500 text-sm capitalize"
          >
            {damageTypes.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Severity *</label>
          <select
            value={form.severity}
            onChange={e => setForm(f => ({ ...f, severity: e.target.value }))}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2.5 text-slate-100 focus:outline-none focus:border-blue-500 text-sm"
          >
            {Object.entries(severityConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs text-slate-400 mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            rows={2}
            placeholder="Describe the damage in detail..."
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm resize-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs text-slate-400 mb-1.5">Upload Photo (optional, max 5MB)</label>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          {preview ? (
            <div className="relative inline-block">
              <img src={preview} alt="preview" className="h-32 rounded-lg object-cover border border-slate-600" />
              <button type="button" onClick={() => { setImage(null); setPreview(null); fileRef.current.value = ''; }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white">
                <X size={12} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current.click()}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg text-slate-300 text-sm transition-colors"
            >
              <Image size={16} /> Choose Photo
            </button>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-900 font-semibold rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
      >
        {loading ? 'Submitting…' : <><Upload size={16} /> Submit Report with AI Analysis</>}
      </button>
    </form>
  );
}

function ReportCard({ report, isAdmin, onStatusChange }) {
  const sev = severityConfig[report.severity] || severityConfig.low;
  const sta = statusConfig[report.status] || statusConfig.pending;
  const StatIcon = sta.icon;

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MapPin size={14} className="text-slate-500" />
            <span className="text-sm font-medium text-slate-100">{report.location}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="capitalize">{report.damageType}</span>
            <span>·</span>
            <span>by {report.reportedBy?.name}</span>
            <span>·</span>
            <span>{new Date(report.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${sev.bg} ${sev.color} ${sev.border}`}>
            {sev.label}
          </span>
          <span className={`flex items-center gap-1 text-xs ${sta.color}`}>
            <StatIcon size={11} /> {sta.label}
          </span>
        </div>
      </div>

      {report.description && (
        <p className="text-xs text-slate-400 bg-slate-900/50 rounded-lg px-3 py-2">{report.description}</p>
      )}

      {report.imageUrl && (
        <img src={report.imageUrl} alt="damage" className="w-full h-40 object-cover rounded-lg border border-slate-700" />
      )}

      {report.aiAnalysis && (
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3 space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold">
            <Brain size={13} /> AI Analysis — {report.aiAnalysis.confidence}% confidence
          </div>
          <ul className="text-xs text-slate-400 space-y-0.5 pl-4 list-disc">
            {report.aiAnalysis.detectedIssues?.map((issue, i) => <li key={i}>{issue}</li>)}
          </ul>
          <p className="text-xs text-amber-400">{report.aiAnalysis.recommendedAction}</p>
        </div>
      )}

      {isAdmin && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Update status:</span>
          <select
            value={report.status}
            onChange={e => onStatusChange(report._id, e.target.value)}
            className="bg-slate-700 border border-slate-600 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none"
          >
            {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      )}
    </div>
  );
}

export default function RoadDamage() {
  const { user, isAdmin } = useAuth();
  const [, navigate] = useLocation();
  const [filter, setFilter] = useState({ status: '', severity: '' });
  const [showForm, setShowForm] = useState(false);
  const qc = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['road-damage', filter],
    queryFn: () => fetchReports(filter),
    enabled: !!user,
  });

  const { data: stats } = useQuery({
    queryKey: ['road-damage-stats'],
    queryFn: fetchStats,
    enabled: isAdmin,
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => axios.put(`/api/road-damage/${id}/status`, { status }).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries(['road-damage']); qc.invalidateQueries(['road-damage-stats']); },
  });

  if (!user) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Road Damage Detection</h1>
          <p className="text-slate-400 mt-1">AI-powered road damage reporting system.</p>
        </div>
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-10 text-center">
          <Construction size={40} className="text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-100 mb-2">Sign in to Report Road Damage</h2>
          <p className="text-slate-400 text-sm mb-4">Help your city by reporting potholes, cracks, and other road issues.</p>
          <button onClick={() => navigate('/auth')} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-sm">
            Sign In / Register
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-2">
            <Construction size={28} className="text-amber-400" /> Road Damage Detection
          </h1>
          <p className="text-slate-400 mt-1">AI-powered pothole and road damage reporting.</p>
        </div>
        <button
          onClick={() => setShowForm(s => !s)}
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-lg font-semibold text-sm transition-colors shrink-0"
        >
          <Upload size={16} /> {showForm ? 'Cancel' : 'Report Damage'}
        </button>
      </div>

      {/* Admin stats */}
      {isAdmin && stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Total', value: stats.total, color: 'text-slate-100' },
            { label: 'Pending', value: stats.pending, color: 'text-slate-400' },
            { label: 'In Progress', value: stats.inProgress, color: 'text-yellow-400' },
            { label: 'Resolved', value: stats.resolved, color: 'text-emerald-400' },
            { label: 'Critical', value: stats.critical, color: 'text-red-400' },
          ].map(s => (
            <div key={s.label} className="bg-slate-800 rounded-xl border border-slate-700 p-4 text-center">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {showForm && <ReportForm onSuccess={() => setShowForm(false)} />}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Filter size={14} /> Filter:
        </div>
        <select
          value={filter.status}
          onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
        >
          <option value="">All Statuses</option>
          {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select
          value={filter.severity}
          onChange={e => setFilter(f => ({ ...f, severity: e.target.value }))}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
        >
          <option value="">All Severities</option>
          {Object.entries(severityConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {/* Reports list */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-slate-800 rounded-xl border border-slate-700 h-48 animate-pulse" />)}
        </div>
      ) : error ? (
        <div className="text-red-400 text-center py-8">Failed to load reports.</div>
      ) : data?.reports?.length === 0 ? (
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-10 text-center">
          <Construction size={32} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500">No reports found. Be the first to report road damage!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {data?.reports?.map(report => (
            <ReportCard
              key={report._id}
              report={report}
              isAdmin={isAdmin}
              onStatusChange={(id, status) => updateStatus.mutate({ id, status })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
