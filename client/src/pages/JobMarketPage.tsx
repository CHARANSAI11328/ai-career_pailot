import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Search,
  MapPin,
  Building,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Filter
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { api } from '../services/api';
import { EnrichedJobMatch } from '../types';

export const JobMarketPage: React.FC = () => {
  const { userId, profile, resume } = useProfile();

  const [jobs, setJobs] = useState<EnrichedJobMatch[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [query, setQuery] = useState('');
  const [workMode, setWorkMode] = useState('All');
  const [experienceLevel, setExperienceLevel] = useState('All');
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      if (showSavedOnly) {
        const res = await api.getSavedJobs(userId);
        setJobs(res.jobs);
      } else {
        const res = await api.searchJobs({
          q: query,
          workMode,
          experienceLevel,
          userId
        });
        setJobs(res.jobs);
      }
    } catch (err) {
      console.warn('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [workMode, experienceLevel, showSavedOnly]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const toggleSave = async (jobId: string) => {
    try {
      const res = await api.toggleSaveJob(jobId, userId);
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, isSaved: res.isSaved } : j));
    } catch (err) {
      console.warn('Failed to toggle save job:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      {/* Header */}
      <div className="doppelrand-shell">
        <div className="doppelrand-core p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/25 flex items-center justify-center shadow-inner">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-blue-300 text-[10px] font-mono tracking-wider uppercase mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span>LABOR MARKET TELEMETRY</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white font-display">Job Market Intelligence</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Curated verified opportunities with personalized match scoring against your active resume.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`px-4 py-2 rounded-full text-xs font-mono font-medium flex items-center gap-1.5 transition ${
                showSavedOnly
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/10'
              }`}
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>{showSavedOnly ? 'Showing Saved Jobs' : 'View Saved Jobs'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <form onSubmit={handleSearchSubmit} className="p-4 bg-black/40 border border-white/10 rounded-2xl grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by role, company, or technology (e.g. React, Python)..."
            className="w-full pl-10 pr-3 py-2.5 bg-black/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 font-sans"
          />
        </div>

        <div>
          <select
            value={workMode}
            onChange={(e) => setWorkMode(e.target.value)}
            className="w-full px-3 py-2.5 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500/60 cursor-pointer font-sans"
          >
            <option value="All">All Arrangements</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Onsite">Onsite</option>
          </select>
        </div>

        <div className="flex gap-2">
          <select
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            className="w-full px-3 py-2.5 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500/60 cursor-pointer font-sans"
          >
            <option value="All">All Experience</option>
            <option value="Entry">Entry Level</option>
            <option value="Mid">Mid Level</option>
            <option value="Senior">Senior Level</option>
          </select>

          <button
            type="submit"
            className="btn-nested-spring px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-mono text-xs font-semibold transition shrink-0"
          >
            Filter
          </button>
        </div>
      </form>

      {/* Jobs Grid */}
      <div className="space-y-4">
        {loading && (
          <div className="py-12 text-center text-xs text-slate-400 font-mono">
            Scanning job market intelligence...
          </div>
        )}

        {!loading && jobs.length === 0 && (
          <div className="py-12 text-center text-xs text-slate-400 bg-black/30 rounded-3xl border border-white/10 font-mono">
            No matching job listings found for this query.
          </div>
        )}

        {!loading && jobs.map((job) => (
          <div
            key={job.id}
            className="doppelrand-shell group"
          >
            <div className="doppelrand-core p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-base font-bold text-white font-display group-hover:text-indigo-300 transition">
                      {job.title}
                    </h2>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">
                      {job.workMode}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                    <span className="flex items-center gap-1 text-slate-300 font-semibold">
                      <Building className="w-3.5 h-3.5 text-slate-500" />
                      {job.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {job.location}
                    </span>
                    <span className="text-emerald-400 font-semibold tabular-nums">
                      {job.salaryRange.currency} {job.salaryRange.min.toLocaleString()} – {job.salaryRange.max.toLocaleString()} / {job.salaryRange.period}
                    </span>
                  </div>
                </div>

                {/* Match Score Badge */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-2xl font-extrabold text-indigo-400 font-mono tabular-nums">
                      {job.matchPercentage}%
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">MATCH INDEX</span>
                  </div>

                  <button
                    onClick={() => toggleSave(job.id)}
                    className={`p-2.5 rounded-full border transition ${
                      job.isSaved
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-white/[0.04] text-slate-400 hover:text-white border-white/10'
                    }`}
                    title={job.isSaved ? 'Remove from saved' : 'Save opportunity'}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Fit explanation */}
              <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>{job.fitExplanation}</span>
              </div>

              {/* Required Skills & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/[0.06]">
                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="text-[11px] font-mono text-slate-400 mr-1">Skills:</span>
                  {job.matchedSkillsList.map(s => (
                    <span key={s} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-full text-[10px] font-mono">
                      ✓ {s}
                    </span>
                  ))}
                  {job.missingSkillsList.map(s => (
                    <span key={s} className="px-2 py-0.5 bg-white/5 text-slate-400 border border-white/10 rounded-full text-[10px] font-mono">
                      + {s}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={job.applicationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-nested-spring px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-xs font-mono font-semibold flex items-center gap-1.5 transition shadow-sm"
                  >
                    <span>Apply on Site</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
