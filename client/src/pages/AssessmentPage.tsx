import React, { useState } from 'react';
import { PieChart, Sparkles, CheckCircle, ArrowRight, Compass } from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { api } from '../services/api';

export const AssessmentPage: React.FC = () => {
  const { setActiveTab } = useProfile();

  const [ratings, setRatings] = useState<Record<string, number>>({
    building: 4,
    analytical: 5,
    helping: 3,
    business: 3,
    creative: 2,
    operational: 3
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<{
    topDimensions: Array<{ dim: string; score: number }>;
    suggestedRoleTrack: string;
    rationale: string;
    disclaimer: string;
  } | null>(null);

  const dimensionQuestions = [
    {
      id: 'building',
      title: 'Building & Hands-On Engineering',
      desc: 'Writing code, constructing web APIs, prototyping software, and building working applications from scratch.'
    },
    {
      id: 'analytical',
      title: 'Analytical & Mathematical Problem Solving',
      desc: 'Debugging complex anomalies, statistical modeling, algorithmic optimization, and working with large data sets.'
    },
    {
      id: 'helping',
      title: 'Helping, Mentoring & Teaching',
      desc: 'Assisting teammates, explaining technical concepts, writing documentation, and prioritizing user empathy.'
    },
    {
      id: 'business',
      title: 'Business Strategy & Product Leadership',
      desc: 'Defining product roadmaps, aligning user stories with commercial goals, and coordinating cross-functional squads.'
    },
    {
      id: 'creative',
      title: 'Creative Design & Visual Expression',
      desc: 'Designing intuitive user interfaces, wireframing in Figma, typography, and visual brand experiences.'
    },
    {
      id: 'operational',
      title: 'Operational Stability & Infrastructure',
      desc: 'Automating deployment pipelines, managing cloud servers, guaranteeing 99.99% uptime, and hardening security.'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.submitAssessment(ratings);
      setAssessmentResult(res);
    } catch (err: any) {
      alert(err.message || 'Failed to submit assessment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 text-left">
      {/* Header */}
      <div className="doppelrand-shell">
        <div className="doppelrand-core p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-400 border border-pink-500/25 flex items-center justify-center shadow-inner">
              <PieChart className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-pink-300 text-[10px] font-mono tracking-wider uppercase mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
                <span>PSYCHOMETRIC ALIGNMENT</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white font-display">Career Interest & Persona Assessment</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Transparent 6-dimension task preference model mapping your natural strengths to high-fit engineering roles.
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="doppelrand-shell">
        <div className="doppelrand-core p-6 sm:p-8 space-y-6">
          <div className="space-y-4">
            {dimensionQuestions.map((q) => (
              <div key={q.id} className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white font-display">{q.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{q.desc}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-mono font-bold text-indigo-400 tabular-nums">
                      RATING: {ratings[q.id]}/5
                    </span>
                  </div>
                </div>

                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={ratings[q.id]}
                  onChange={(e) => setRatings({ ...ratings, [q.id]: Number(e.target.value) })}
                  className="w-full accent-indigo-500 mt-1"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>1 - Minimal Preference</span>
                  <span>3 - Moderate Alignment</span>
                  <span>5 - Core Passion</span>
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-nested-spring group w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition shadow-[0_8px_25px_rgba(79,70,229,0.35)] font-mono"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSubmitting ? 'Evaluating Profile Dimensions...' : 'Compute Career Alignment Matrix'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </form>

      {/* Results View */}
      {assessmentResult && (
        <div className="doppelrand-shell">
          <div className="doppelrand-core p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wide">
                  ASSESSMENT RESULTS
                </span>
                <h2 className="text-lg font-bold text-white font-display">Suggested Primary Career Track</h2>
              </div>
              <div className="px-3.5 py-1.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-mono font-bold">
                {assessmentResult.suggestedRoleTrack}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {assessmentResult.rationale}
            </p>

            <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-[11px] font-mono text-slate-400 italic">
              {assessmentResult.disclaimer}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="btn-nested-spring px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-xs font-mono font-semibold flex items-center gap-1.5 transition shadow-sm"
              >
                <span>Explore Roles on Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
