import React, { useState } from 'react';
import {
  Award,
  CheckCircle,
  Play,
  ArrowRight,
  RefreshCw,
  Sparkles,
  FileText,
  Briefcase,
  MapPin,
  Mic,
  Compass,
  Key,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext';

interface JudgeDemoPageProps {
  onOpenKeyModal: () => void;
}

export const JudgeDemoPage: React.FC<JudgeDemoPageProps> = ({ onOpenKeyModal }) => {
  const { loadDemoProfile, resetDemoData, setActiveTab, profile, resume, roadmap, aiStatus } = useProfile();
  const [selectedProfileId, setSelectedProfileId] = useState<'demo_fullstack' | 'demo_ai_ml'>('demo_fullstack');
  const [loading, setLoading] = useState(false);

  const handleLaunchSimulation = async () => {
    setLoading(true);
    try {
      await loadDemoProfile(selectedProfileId);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      num: 1,
      title: 'Synthesize Career Profile',
      desc: 'Initializes candidate education, years of experience, target role, and preferred working arrangements.',
      status: profile ? 'completed' : 'pending',
      actionTab: 'onboarding'
    },
    {
      num: 2,
      title: 'Resume Ingestion & Deterministic ATS Audit',
      desc: 'Parses document sections, extracts verified skills, computes 6-part heuristic score & flags weak verbs.',
      status: resume ? 'completed' : 'pending',
      actionTab: 'resume'
    },
    {
      num: 3,
      title: 'Job Description Comparison & Gap Analysis',
      desc: 'Compares resume directly with target posting (Nexus Cloud or Cognitive Dynamics) to pinpoint missing critical skills.',
      status: resume?.jobComparison ? 'completed' : 'pending',
      actionTab: 'resume'
    },
    {
      num: 4,
      title: 'Personalized 4-Week Learning Roadmap',
      desc: 'Orders weekly milestones respecting prerequisite logic and attaches verified learning resources with practical deliverables.',
      status: roadmap ? 'completed' : 'pending',
      actionTab: 'roadmap'
    },
    {
      num: 5,
      title: 'AI Mock Interview Simulator',
      desc: 'Interactive 1-by-1 question flow supporting speech-to-text voice input and STAR framework evaluation.',
      status: 'ready',
      actionTab: 'interview'
    },
    {
      num: 6,
      title: 'Job Market Matching',
      desc: 'Curated real-world listings with individual match percentage computed against candidate verified skills.',
      status: 'ready',
      actionTab: 'jobs'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10 text-left">
      {/* Header Cockpit */}
      <div className="doppelrand-shell">
        <div className="doppelrand-core p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400 shadow-inner">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-indigo-500/15 text-indigo-300 border border-indigo-500/25 mb-1 uppercase tracking-wider">
                  EVALUATION WORKFLOW FOR HACKATHON JUDGES
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                  Guided End-to-End Simulation Tour
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenKeyModal}
                className="px-3.5 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-indigo-300 border border-indigo-500/25 rounded-full text-xs font-mono flex items-center gap-1.5 transition"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Configure Gemini Key</span>
              </button>

              {profile && (
                <button
                  onClick={resetDemoData}
                  className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/25 rounded-full text-xs font-mono flex items-center gap-1.5 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Demo</span>
                </button>
              )}
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
            Welcome, Judges! Experience the connected career intelligence pipeline in a single click without configuring external credentials. This tour loads a complete synthetic candidate profile, executes ATS parsing, performs job-description gap detection, synthesizes a learning roadmap, and prepares mock interviews.
          </p>

          {/* Engine status indicator */}
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono">
            <span className="text-slate-400">EXECUTION ENGINE:</span>
            {aiStatus?.isLive ? (
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Google Gemini 2.5 Flash Online
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Deterministic Heuristic Engine (Offline Guarantee)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Profile Selector & 1-Click Launch */}
      <div className="doppelrand-shell">
        <div className="doppelrand-core p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono uppercase tracking-wider text-slate-300 font-bold">
              STEP 1: SELECT CANDIDATE PERSONA
            </h2>
            <span className="text-xs font-mono text-slate-400">1-CLICK SYNTHETIC INGESTION</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setSelectedProfileId('demo_fullstack')}
              className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
                selectedProfileId === 'demo_fullstack'
                  ? 'bg-indigo-600/10 border-indigo-500/60 shadow-[0_4px_20px_rgba(79,70,229,0.2)]'
                  : 'bg-black/30 border-white/[0.06] hover:border-white/15'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-indigo-400">SOFTWARE ENGINEERING</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-400">1 Year Exp</span>
              </div>
              <h3 className="text-base font-bold text-white font-display">Priya Sharma</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                B.Tech CS graduate targeting Full Stack Software Engineer. Skills in React, TypeScript, Node.js, and PostgreSQL.
              </p>
            </div>

            <div
              onClick={() => setSelectedProfileId('demo_ai_ml')}
              className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
                selectedProfileId === 'demo_ai_ml'
                  ? 'bg-purple-600/10 border-purple-500/60 shadow-[0_4px_20px_rgba(168,85,247,0.2)]'
                  : 'bg-black/30 border-white/[0.06] hover:border-white/15'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-purple-400">ARTIFICIAL INTELLIGENCE</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-400">M.S. Graduate</span>
              </div>
              <h3 className="text-base font-bold text-white font-display">Alex Chen</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                M.S. Data Science graduate targeting AI/ML Engineer. Skills in Python, PyTorch, Scikit-Learn, and LLM Fine-tuning.
              </p>
            </div>
          </div>

          <button
            onClick={handleLaunchSimulation}
            disabled={loading}
            className="btn-nested-spring group w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-full text-xs font-semibold flex items-center justify-center gap-2 shadow-[0_8px_25px_rgba(79,70,229,0.35)]"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{loading ? 'Executing Evaluation Pipeline...' : '1-Click Launch: Load Profile & Run End-to-End Analysis'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Connected 6-Step Pipeline Checklist */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono uppercase tracking-wider text-slate-300 font-bold px-1">
          STEP 2: PIPELINE EXECUTION PHASES
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {steps.map((step) => (
            <div
              key={step.num}
              className={`p-5 rounded-2xl border transition-all duration-300 ${
                step.status === 'completed'
                  ? 'bg-black/40 border-emerald-500/30'
                  : 'bg-black/20 border-white/[0.06]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-slate-400">PHASE 0{step.num}</span>
                {step.status === 'completed' ? (
                  <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400">
                    <CheckCircle className="w-3.5 h-3.5" /> SYNTHESIZED
                  </span>
                ) : (
                  <span className="text-[11px] font-mono text-slate-500">STANDBY</span>
                )}
              </div>

              <h3 className="text-sm font-bold text-white mb-1 font-display">{step.title}</h3>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">{step.desc}</p>

              <button
                onClick={() => setActiveTab(step.actionTab)}
                className="text-xs font-mono font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
              >
                <span>OPEN IN {step.actionTab.toUpperCase()}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

