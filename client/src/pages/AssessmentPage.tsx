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
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-lg">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-pink-500/10 text-pink-400 rounded-2xl border border-pink-500/20">
            <PieChart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Career Personality & Interest Assessment</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Transparent 6-dimension task preference questionnaire mapping your strengths to high-fit career tracks.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="space-y-6">
          {dimensionQuestions.map((q) => (
            <div key={q.id} className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white">{q.title}</h3>
                  <p className="text-xs text-slate-400">{q.desc}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-indigo-400">Score: {ratings[q.id]}/5</span>
                </div>
              </div>

              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={ratings[q.id]}
                onChange={(e) => setRatings({ ...ratings, [q.id]: Number(e.target.value) })}
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>1 - Minimal Interest</span>
                <span>3 - Moderate Interest</span>
                <span>5 - Passionate / High Interest</span>
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/30"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isSubmitting ? 'Evaluating Profile...' : 'Calculate Career Alignment'}</span>
        </button>
      </form>

      {/* Results View */}
      {assessmentResult && (
        <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide">
                ASSESSMENT RESULTS
              </span>
              <h2 className="text-lg font-bold text-white">Suggested Primary Career Track</h2>
            </div>
            <div className="px-3.5 py-1.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-bold">
              {assessmentResult.suggestedRoleTrack}
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {assessmentResult.rationale}
          </p>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-slate-400 italic">
            {assessmentResult.disclaimer}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            >
              <span>Explore Roles on Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
