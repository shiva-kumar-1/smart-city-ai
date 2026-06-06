import React from 'react';
import { Info, Bot, CloudSun, Construction, Cpu, Layers, Database, Shield, Zap } from 'lucide-react';

const tech = [
  { label: 'React + Vite', desc: 'Fast modern frontend with hot reload', icon: Zap, color: 'text-blue-400 bg-blue-500/10' },
  { label: 'Node.js + Express', desc: 'Robust REST API backend', icon: Cpu, color: 'text-emerald-400 bg-emerald-500/10' },
  { label: 'MongoDB + Mongoose', desc: 'NoSQL database with schema validation', icon: Database, color: 'text-green-400 bg-green-500/10' },
  { label: 'JWT Auth', desc: 'Secure token-based authentication', icon: Shield, color: 'text-purple-400 bg-purple-500/10' },
];

const scope = [
  { icon: Bot, label: 'AI City Assistant', color: 'text-indigo-400 bg-indigo-500/10', desc: 'Intelligent chatbot to help citizens navigate city services using natural language.' },
  { icon: CloudSun, label: 'Weather Integration', color: 'text-sky-400 bg-sky-500/10', desc: 'Predictive models correlating severe weather events with traffic and emergency dispatch.' },
  { icon: Construction, label: 'Real ML Road Detection', color: 'text-amber-400 bg-amber-500/10', desc: 'Computer vision model from YOLO/TensorFlow deployed for actual pothole detection from images.' },
];

export default function About() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Info size={30} />
        </div>
        <h1 className="text-4xl font-bold text-slate-100">About SmartCity</h1>
        <p className="text-lg text-slate-400 mt-2 max-w-2xl mx-auto">A centralized, real-time command center for modern urban administration.</p>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-blue-600 to-blue-400" />
        <div className="p-6">
          <h2 className="font-bold text-xl text-slate-100 flex items-center gap-2 mb-4">
            <Layers size={20} className="text-blue-400" /> Project Overview
          </h2>
          <div className="space-y-3 text-slate-400 leading-relaxed text-sm">
            <p>The SmartCity Dashboard provides city administrators and citizens with real-time, actionable insights into critical urban infrastructure. Current capabilities include traffic monitoring, smart parking management, AI-assisted road damage detection, fuel station locator, and emergency services.</p>
            <p>Built with a full-stack MERN architecture — MongoDB for persistence, Express for REST APIs, React for an interactive UI, and Node.js for the server layer — featuring JWT-based authentication with role-based access (Citizen / Admin).</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2 mb-5">
          <Cpu size={22} className="text-blue-400" /> Tech Stack
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tech.map(({ label, desc, icon: Icon, color }) => (
            <div key={label} className="bg-slate-800 rounded-xl border border-slate-700 p-4">
              <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center mb-3`}><Icon size={18} /></div>
              <h3 className="font-semibold text-slate-100 text-sm">{label}</h3>
              <p className="text-xs text-slate-500 mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2 mb-5">
          <Cpu size={22} className="text-blue-400" /> Future Scope
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {scope.map(({ icon: Icon, label, color, desc }) => (
            <div key={label} className="bg-slate-800 rounded-xl border border-slate-700 p-5 hover:border-slate-600 transition-colors">
              <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}><Icon size={20} /></div>
              <h3 className="font-semibold text-slate-100 mb-2">{label}</h3>
              <p className="text-sm text-slate-400">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
