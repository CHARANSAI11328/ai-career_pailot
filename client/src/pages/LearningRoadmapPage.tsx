import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  BookOpen,
  Code,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Trophy
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { api } from '../services/api';

export const LearningRoadmapPage: React.FC = () => {
  const { roadmap, setRoadmap, profile, resume, userId } = useProfile();

  const [targetRoleId, setTargetRoleId] = useState(roadmap?.targetRole || 'fullstack_developer');
  const [weeklyHours, setWeeklyHours] = useState(roadmap?.weeklyHours || 12);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Find missing skills from active resume or profile
      const missing = resume?.jobComparison?.missingCriticalSkills || ['TypeScript', 'Docker', 'PostgreSQL', 'CI/CD'];
      const res = await api.generateRoadmap(targetRoleId, missing, weeklyHours, userId);
      setRoadmap(res.roadmap);
    } catch (err: any) {
      alert(err.message || 'Failed to generate roadmap');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleWeekCompletion = async (weekNumber: number, currentStatus: boolean) => {
    try {
      const res = await api.updateRoadmapProgress(weekNumber, !currentStatus, userId);
      setRoadmap(res.roadmap);
    } catch (err) {
      console.warn('Failed to update week status:', err);
    }
  };

  const completedWeeks = roadmap?.weeks.filter(w => w.isCompleted).length || 0;
  const totalWeeks = roadmap?.weeks.length || 4;
  const progressPct = Math.round((completedWeeks / totalWeeks) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8 text-left">
      {/* Header */}
      <div className="doppelrand-shell">
        <div className="doppelrand-core p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center justify-center shadow-inner">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-emerald-300 text-[10px] font-mono tracking-wider uppercase mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>DYNAMIC CURRICULUM GRAPH</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white font-display">Personalized Learning Roadmap</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Ordered milestone progression bridging your verified skill gaps with practical portfolio deliverables.
              </p>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="btn-nested-spring px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-full text-xs font-semibold flex items-center gap-1.5 transition shadow-[0_4px_16px_rgba(79,70,229,0.35)] shrink-0 font-mono"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'Synthesizing...' : 'Regenerate Roadmap'}</span>
          </button>
        </div>
      </div>

      {/* Configuration Controls Bar */}
      <div className="doppelrand-shell">
        <div className="doppelrand-core p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div>
            <label className="block text-slate-300 font-mono text-[11px] uppercase tracking-wider mb-2">TARGET CAREER TRACK</label>
            <select
              value={targetRoleId}
              onChange={(e) => setTargetRoleId(e.target.value)}
              className="w-full px-3.5 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500/60 cursor-pointer font-sans"
            >
              <option value="fullstack_developer">Full Stack Software Engineer</option>
              <option value="ai_ml_engineer">AI / Machine Learning Engineer</option>
              <option value="cloud_devops_engineer">Cloud & DevOps Platform Engineer</option>
              <option value="data_analyst">Data Analyst & Analytics Engineer</option>
              <option value="product_manager">Technical Product Manager</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-mono text-[11px] uppercase tracking-wider mb-2">
              WEEKLY PACE: <span className="text-indigo-400 font-bold tabular-nums">{weeklyHours}h/week</span>
            </label>
            <input
              type="range"
              min={4}
              max={30}
              step={2}
              value={weeklyHours}
              onChange={(e) => setWeeklyHours(Number(e.target.value))}
              className="w-full accent-indigo-500 mt-2"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-mono text-[11px] uppercase tracking-wider mb-2">COMPLETION PROGRESS</label>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="font-bold text-emerald-400 font-mono tabular-nums shrink-0">{progressPct}%</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 mt-1 block">
              {completedWeeks} of {totalWeeks} weekly milestones achieved
            </span>
          </div>
        </div>
      </div>

      {/* If No Roadmap Generated Yet */}
      {!roadmap && (
        <div className="doppelrand-shell">
          <div className="doppelrand-core p-12 text-center space-y-4">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white font-display">No Active Roadmap Found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Generate a tailored 4-week progression mapping verified resources to your current skill profile.
            </p>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="btn-nested-spring px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-xs font-semibold transition shadow-md font-mono"
            >
              {isGenerating ? 'Synthesizing...' : 'Generate Roadmap Now'}
            </button>
          </div>
        </div>
      )}

      {/* Active Roadmap Timeline */}
      {roadmap && (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base font-bold text-white flex items-center gap-2 font-display">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Milestone Schedule: {roadmap.targetRoleTitle}</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">{roadmap.weeklyHours} hours/week</span>
          </div>

          <div className="space-y-4">
            {roadmap.weeks.map((week) => (
              <div
                key={week.weekNumber}
                className="doppelrand-shell"
              >
                <div className={`doppelrand-core p-6 space-y-4 transition ${
                  week.isCompleted ? 'bg-emerald-950/10' : ''
                }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleWeekCompletion(week.weekNumber, week.isCompleted)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center border transition ${
                        week.isCompleted
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-slate-600 hover:border-emerald-400 text-transparent'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <div>
                      <h3 className={`text-sm font-bold ${week.isCompleted ? 'text-emerald-400 line-through' : 'text-white'}`}>
                        {week.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">{week.description}</p>
                    </div>
                  </div>

                  {/* Focus skills chips */}
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {week.focusSkills.map((sk) => (
                      <span
                        key={sk}
                        className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-md text-[11px] font-medium"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Practical Milestone Project Deliverable */}
                <div className="mt-4 p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <Code className="w-3.5 h-3.5" />
                    <span>Hands-On Project Milestone: {week.projectTask.title}</span>
                  </div>
                  <p className="text-xs text-slate-300">{week.projectTask.description}</p>
                  <div className="text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-300">Deliverable: </span>
                    {week.projectTask.deliverable}
                  </div>
                </div>

                {/* Curated Resources */}
                <div className="mt-4 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                    Verified Learning Resources:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {week.resources.map((res, idx) => (
                      <a
                        key={idx}
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/40 rounded-xl transition flex flex-col justify-between group"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-indigo-300 font-semibold">
                            <span>{res.provider}</span>
                            <span className="text-emerald-400">{res.cost}</span>
                          </div>
                          <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition line-clamp-2">
                            {res.title}
                          </h4>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-700/40">
                          <span>{res.type}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-white" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
      )}
    </div>
  );
};
