import React, { useState } from 'react';
import { Award, Sparkles, RefreshCw, Key, ArrowRight, Activity, ChevronUp, ChevronDown } from 'lucide-react';
import { useProfile } from '../context/ProfileContext';

interface DemoBannerProps {
  onOpenKeyModal: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ onOpenKeyModal }) => {
  const { aiStatus, loadDemoProfile, resetDemoData, setActiveTab, profile } = useProfile();
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return (
      <div className="w-full bg-[#06080D]/90 border-b border-white/[0.05] px-4 py-1 text-[11px] flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${aiStatus?.isLive ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${aiStatus?.isLive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          </span>
          <span className="font-mono text-[10px] text-slate-300">
            {aiStatus?.isLive ? 'Gemini 2.5 Flash Online' : 'Heuristic Engine Active'}
          </span>
        </div>
        <button
          onClick={() => setIsDismissed(false)}
          className="text-indigo-400 hover:text-indigo-300 text-[10px] font-mono flex items-center gap-1 transition"
        >
          <span>Show Evaluation HUD</span>
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#06080D]/95 border-b border-white/[0.06] text-xs select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        {/* Left: Status and Evaluation badge */}
        <div className="flex items-center space-x-2.5 shrink-0">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/25 tracking-wide">
            <Award className="w-3 h-3 text-indigo-400 shrink-0" />
            <span>EVALUATION HUD</span>
          </span>

          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${aiStatus?.isLive ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${aiStatus?.isLive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            </span>
            <span className="font-mono text-[10px] sm:text-[11px] text-slate-300 hidden md:inline">
              {aiStatus?.isLive ? 'Gemini 2.5 Flash Online' : 'Heuristic Engine Active'}
            </span>
          </div>
        </div>

        {/* Right: Presets, Tour, Key, Reset */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('judgeDemo')}
            className="px-2.5 py-0.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-semibold text-[10px] sm:text-[11px] flex items-center gap-1 transition-all shadow-[0_2px_8px_rgba(79,70,229,0.3)] active:scale-95 shrink-0"
          >
            <Sparkles className="w-3 h-3 shrink-0" />
            <span>Judge Tour</span>
            <ArrowRight className="w-3 h-3 shrink-0 hidden sm:inline" />
          </button>

          <div className="hidden sm:flex items-center gap-1 bg-white/[0.03] border border-white/10 rounded-full p-0.5">
            <span className="text-[10px] font-mono text-slate-400 px-1.5">Presets:</span>
            <button
              onClick={() => loadDemoProfile('demo_fullstack')}
              className="px-2 py-0.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-full font-medium text-[10px] transition shrink-0"
              title="Load Priya Sharma (SWE)"
            >
              Priya
            </button>
            <button
              onClick={() => loadDemoProfile('demo_ai_ml')}
              className="px-2 py-0.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-full font-medium text-[10px] transition shrink-0"
              title="Load Alex Chen (AI/ML)"
            >
              Alex
            </button>
          </div>

          <button
            onClick={onOpenKeyModal}
            className="px-2 sm:px-2.5 py-0.5 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 rounded-full transition flex items-center gap-1 text-[10px] sm:text-[11px] font-mono shrink-0"
            title="Configure Custom Gemini API Key"
          >
            <Key className="w-3 h-3 text-indigo-400 shrink-0" />
            <span className="hidden sm:inline">API Key</span>
          </button>

          {profile && (
            <button
              onClick={resetDemoData}
              className="px-2 py-0.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 rounded-full transition flex items-center gap-1 text-[10px] sm:text-[11px] font-mono shrink-0"
              title="Reset profile & data"
            >
              <RefreshCw className="w-3 h-3 shrink-0" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 text-slate-500 hover:text-slate-300 transition shrink-0"
            title="Minimize Evaluation HUD"
            aria-label="Minimize HUD"
          >
            <ChevronUp className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};


