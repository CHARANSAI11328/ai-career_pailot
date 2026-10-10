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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-lg">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Job Market Intelligence</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Curated verified opportunities with personalized match scoring against your active resume.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSavedOnly(!showSavedOnly)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              showSavedOnly
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>{showSavedOnly ? 'Showing Saved Jobs' : 'View Saved Jobs'}</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <form onSubmit={handleSearchSubmit} className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by role, company, or technology (e.g. React, Python)..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <select
            value={workMode}
            onChange={(e) => setWorkMode(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
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
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="All">All Experience</option>
            <option value="Entry">Entry Level</option>
            <option value="Mid">Mid Level</option>
            <option value="Senior">Senior Level</option>
          </select>

          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition shrink-0"
          >
            Filter
          </button>
        </div>
      </form>

      {/* Jobs Grid */}
      <div className="space-y-4">
        {loading && (
          <div className="py-12 text-center text-xs text-slate-400">
            Scanning job market intelligence...
          </div>
        )}

        {!loading && jobs.length === 0 && (
          <div className="py-12 text-center text-xs text-slate-400 bg-slate-900/60 rounded-3xl border border-slate-800">
            No matching job listings found for this query.
          </div>
        )}

        {!loading && jobs.map((job) => (
          <div
            key={job.id}
            className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl hover:border-indigo-500/40 transition space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-base font-bold text-white hover:text-indigo-300 transition">
                    {job.title}
                  </h2>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {job.workMode}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-slate-300 font-semibold">
                    <Building className="w-3.5 h-3.5 text-slate-500" />
                    {job.company}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {job.location}
                  </span>
                  <span className="text-emerald-400 font-semibold">
                    {job.salaryRange.currency} {job.salaryRange.min.toLocaleString()} – {job.salaryRange.max.toLocaleString()} / {job.salaryRange.period}
                  </span>
                </div>
              </div>

              {/* Match Score Badge */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-2xl font-black text-indigo-400">
                    {job.matchPercentage}%
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">Your Match</span>
                </div>

                <button
                  onClick={() => toggleSave(job.id)}
                  className={`p-2.5 rounded-xl border transition ${
                    job.isSaved
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
                  }`}
                  title={job.isSaved ? 'Remove from saved' : 'Save opportunity'}
                >
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Fit explanation */}
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>{job.fitExplanation}</span>
            </div>

            {/* Required Skills & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-[11px] text-slate-500 mr-1">Required:</span>
                {job.matchedSkillsList.map(s => (
                  <span key={s} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-md text-[11px]">
                    ✓ {s}
                  </span>
                ))}
                {job.missingSkillsList.map(s => (
                  <span key={s} className="px-2 py-0.5 bg-slate-800 text-slate-400 border border-slate-700 rounded-md text-[11px]">
                    + {s}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={job.applicationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                >
                  <span>Apply on Employer Site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
