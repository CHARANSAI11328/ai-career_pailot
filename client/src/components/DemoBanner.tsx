import React from 'react';
import { Award, Sparkles, RefreshCw, Key, ArrowRight } from 'lucide-react';
import { useProfile } from '../context/ProfileContext';

interface DemoBannerProps {
  onOpenKeyModal: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ onOpenKeyModal }) => {
  const { aiStatus, loadDemoProfile, resetDemoData, setActiveTab, profile } = useProfile();

  return (
    <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border-b border-indigo-500/20 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Award className="w-3 h-3 text-indigo-400" /> Hackathon Judge Mode
          </span>
          <span className="text-slate-300 hidden sm:inline">
            {aiStatus?.isLive ? (
              <span className="text-emerald-400 font-medium">● Connected to Live Gemini 2.5 Flash</span>
            ) : (
              <span className="text-amber-400 font-medium">● Heuristic Engine Active (Zero-config offline mode)</span>
            )}
          </span>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('judgeDemo')}
            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold flex items-center gap-1 transition shadow-sm"
          >
            <Sparkles className="w-3 h-3" />
            <span>Judge Demo Tour</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <button
            onClick={() => loadDemoProfile('demo_fullstack')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition"
            title="Load Priya Sharma (Full Stack Engineer)"
          >
            Priya (SWE)
          </button>

          <button
            onClick={() => loadDemoProfile('demo_ai_ml')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition"
            title="Load Alex Chen (AI/ML Engineer)"
          >
            Alex (AI/ML)
          </button>

          <button
            onClick={onOpenKeyModal}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 rounded-lg transition flex items-center gap-1"
            title="Configure Custom Gemini API Key"
          >
            <Key className="w-3 h-3" />
            <span>API Key</span>
          </button>

          {profile && (
            <button
              onClick={resetDemoData}
              className="px-2 py-1 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 rounded-lg transition flex items-center gap-1"
              title="Reset all profile, resume, and roadmap records"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
