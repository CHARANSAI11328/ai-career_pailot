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
  ShieldCheck
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
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 text-left">
      {/* Header */}
      <div className="p-8 bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/30 rounded-3xl space-y-4 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-600/30">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-1">
                EVALUATION WORKFLOW FOR HACKATHON JUDGES
              </div>
              <h1 className="text-2xl font-black text-white">
                Guided End-to-End Simulation Tour
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenKeyModal}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Configure Live Gemini Key</span>
            </button>

            {profile && (
              <button
                onClick={resetDemoData}
                className="px-3.5 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Demo Data</span>
              </button>
            )}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Welcome, Judges! Experience the connected career intelligence pipeline in a single click without configuring external credentials. This tour loads a complete synthetic candidate profile, executes ATS parsing, performs job-description gap detection, synthesizes a learning roadmap, and prepares mock interviews.
        </p>

        {/* Engine status indicator */}
        <div className="pt-2 flex items-center gap-2 text-xs font-medium">
          <span className="text-slate-400">Current AI Execution Engine:</span>
          {aiStatus?.isLive ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
              ● Live Google Gemini 2.5 Flash API
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
              ● Deterministic NLP Heuristic Engine (Offline Guarantee)
            </span>
          )}
        </div>
      </div>

      {/* Profile Selector & 1-Click Launch */}
      <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
        <h2 className="text-base font-bold text-white">Select Synthetic Demonstration Profile:</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() => setSelectedProfileId('demo_fullstack')}
            className={`p-5 rounded-2xl border cursor-pointer transition ${
              selectedProfileId === 'demo_fullstack'
                ? 'bg-indigo-950/30 border-indigo-500 shadow-lg shadow-indigo-950/50'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-400">Software Engineering Track</span>
              <span className="text-[10px] text-slate-400">1 Year Exp</span>
            </div>
            <h3 className="text-base font-bold text-white">Priya Sharma</h3>
            <p className="text-xs text-slate-400 mt-1">
              B.Tech CS graduate targeting Full Stack Software Engineer. Skills in React, JavaScript, and Node.js.
            </p>
          </div>

          <div
            onClick={() => setSelectedProfileId('demo_ai_ml')}
            className={`p-5 rounded-2xl border cursor-pointer transition ${
              selectedProfileId === 'demo_ai_ml'
                ? 'bg-purple-950/30 border-purple-500 shadow-lg shadow-purple-950/50'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-400">Artificial Intelligence Track</span>
              <span className="text-[10px] text-slate-400">Graduate Degree</span>
            </div>
            <h3 className="text-base font-bold text-white">Alex Chen</h3>
            <p className="text-xs text-slate-400 mt-1">
              M.S. in Data Science graduate targeting AI/ML Engineer. Skills in Python, PyTorch, and Scikit-Learn.
            </p>
          </div>
        </div>

        <button
          onClick={handleLaunchSimulation}
          disabled={loading}
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-xl shadow-indigo-600/30"
        >
          <Play className="w-4 h-4" />
          <span>{loading ? 'Initializing Simulation Pipeline...' : '1-Click Launch: Load Profile & Run End-to-End Analysis'}</span>
        </button>
      </div>

      {/* Connected 6-Step Pipeline Checklist */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white">Interactive Workflow Pipeline:</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {steps.map((step) => (
            <div
              key={step.num}
              className={`p-5 rounded-2xl border transition ${
                step.status === 'completed'
                  ? 'bg-slate-900/90 border-emerald-500/40'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400">Step {step.num}</span>
                {step.status === 'completed' ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                    <CheckCircle className="w-3.5 h-3.5" /> Active
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-slate-500">Ready</span>
                )}
              </div>

              <h3 className="text-sm font-bold text-white mb-1">{step.title}</h3>
              <p className="text-xs text-slate-400 mb-3">{step.desc}</p>

              <button
                onClick={() => setActiveTab(step.actionTab)}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
              >
                <span>Inspect in {step.actionTab.toUpperCase()}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
