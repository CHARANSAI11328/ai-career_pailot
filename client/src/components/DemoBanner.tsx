import React from 'react';
import { Award, Sparkles, RefreshCw, Key, ArrowRight, Activity } from 'lucide-react';
import { useProfile } from '../context/ProfileContext';

interface DemoBannerProps {
  onOpenKeyModal: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ onOpenKeyModal }) => {
  const { aiStatus, loadDemoProfile, resetDemoData, setActiveTab, profile } = useProfile();

  return (
    <div className="bg-[#060709]/95 backdrop-blur-md border-b border-white/[0.08] px-3 sm:px-6 py-1.5 text-xs select-none relative z-40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/25">
            <Award className="w-3 h-3 text-indigo-400" /> EVALUATION HUD
          </span>
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${aiStatus?.isLive ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${aiStatus?.isLive ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </span>
            <span className="font-mono text-[11px] text-slate-300 hidden md:inline">
              {aiStatus?.isLive ? 'Gemini 2.5 Flash Online' : 'Heuristic Engine Active'}
            </span>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('judgeDemo')}
            className="group px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-semibold text-[11px] flex items-center gap-1.5 transition-all shadow-[0_2px_8px_rgba(79,70,229,0.3)] active:scale-95"
          >
            <Sparkles className="w-3 h-3" />
            <span>Judge Tour</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <div className="flex items-center gap-1 bg-white/[0.03] border border-white/10 rounded-full p-0.5">
            <span className="text-[10px] font-mono text-slate-400 px-2 hidden sm:inline">Presets:</span>
            <button
              onClick={() => loadDemoProfile('demo_fullstack')}
              className="px-2.5 py-0.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-full font-medium text-[11px] transition"
              title="Load Priya Sharma (SWE)"
            >
              Priya (SWE)
            </button>
            <button
              onClick={() => loadDemoProfile('demo_ai_ml')}
              className="px-2.5 py-0.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-full font-medium text-[11px] transition"
              title="Load Alex Chen (AI/ML)"
            >
              Alex (AI/ML)
            </button>
          </div>

          <button
            onClick={onOpenKeyModal}
            className="px-2.5 py-1 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 rounded-full transition flex items-center gap-1.5 text-[11px] font-mono"
            title="Configure Custom Gemini API Key"
          >
            <Key className="w-3 h-3 text-indigo-400" />
            <span>API Key</span>
          </button>

          {profile && (
            <button
              onClick={resetDemoData}
              className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 rounded-full transition flex items-center gap-1 text-[11px] font-mono"
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

