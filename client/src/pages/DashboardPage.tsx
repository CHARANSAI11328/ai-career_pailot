import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  FileText,
  MapPin,
  Mic,
  Briefcase,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Award,
  Zap,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useProfile } from '../context/ProfileContext';
import { api } from '../services/api';
import { RoleMatchResult } from '../types';

export const DashboardPage: React.FC = () => {
  const { profile, resume, roadmap, setActiveTab, userId } = useProfile();
  const { t } = useLanguage();

  const [roleMatches, setRoleMatches] = useState<RoleMatchResult[]>([]);
  const [loadingMatches, setLoadingMatches] = useState<boolean>(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoadingMatches(true);
        const skillsToMatch = resume?.extractedSkills || profile?.skills || ['JavaScript', 'React', 'Node.js'];
        const res = await api.getRoleRecommendations(skillsToMatch, userId);
        setRoleMatches(res.recommendations || []);
      } catch (err) {
        console.warn('Failed to load role recommendations:', err);
      } finally {
        setLoadingMatches(false);
      }
    };

    fetchMatches();
  }, [profile, resume]);

  // Derived next action
  const getNextAction = () => {
    if (!resume) {
      return {
        title: 'Upload and Audit Your Resume',
        desc: 'Extract verified skills and receive a transparent ATS scoring audit with quantifiable impact analysis.',
        tab: 'resume',
        actionLabel: 'Upload Resume Now',
        icon: FileText
      };
    }
    if (!roadmap) {
      return {
        title: 'Generate Personalized 4-Week Roadmap',
        desc: `Bridge your identified skill gaps for ${profile?.targetRole || 'Full Stack Software Engineer'} with verified courses and project deliverables.`,
        tab: 'roadmap',
        actionLabel: 'Generate Learning Roadmap',
        icon: MapPin
      };
    }
    return {
      title: 'Practice Role-Specific Mock Interview',
      desc: 'Simulate technical and behavioral STAR questions with real-time speech and rubric feedback.',
      tab: 'interview',
      actionLabel: 'Start Mock Interview',
      icon: Mic
    };
  };

  const nextAction = getNextAction();
  const NextIcon = nextAction.icon;

  const topMatch = roleMatches[0];
  const completedWeeks = roadmap?.weeks.filter(w => w.isCompleted).length || 0;
  const totalWeeks = roadmap?.weeks.length || 4;
  const roadmapPct = Math.round((completedWeeks / totalWeeks) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Top Welcome & Summary Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Career Intelligence Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Welcome back, {profile?.name || 'Candidate'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Targeting <span className="text-indigo-300 font-semibold">{profile?.targetRole || 'Full Stack Software Engineer'}</span> • {profile?.experienceLevel || 'Fresher'}
          </p>
        </div>

        <button
          onClick={() => setActiveTab('onboarding')}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 rounded-xl transition"
        >
          Edit Career Profile
        </button>
      </div>

      {/* Recommended Next Action Banner */}
      <div className="p-6 bg-indigo-900/20 border border-indigo-500/30 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl shadow-indigo-950/40">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-600/30 shrink-0">
            <NextIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 mb-1 border border-indigo-500/30">
              <Zap className="w-3 h-3 text-indigo-400" /> RECOMMENDED NEXT BEST ACTION
            </div>
            <h2 className="text-base font-bold text-white">{nextAction.title}</h2>
            <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">{nextAction.desc}</p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab(nextAction.tab)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-lg shadow-indigo-600/30 shrink-0"
        >
          <span>{nextAction.actionLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Top Role Match */}
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Top Role Match</span>
            <Award className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {topMatch ? `${topMatch.matchScore}%` : '—'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 truncate">
            {topMatch ? topMatch.role.title : 'Configure skills to calculate'}
          </p>
        </div>

        {/* Metric 2: Resume ATS Health */}
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Resume ATS Score</span>
            <FileText className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {resume ? `${resume.heuristicScore.overall}/100` : 'Not Uploaded'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 truncate">
            {resume ? `${resume.extractedSkills.length} skills verified` : 'Upload resume to audit'}
          </p>
        </div>

        {/* Metric 3: Roadmap Progress */}
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Learning Roadmap</span>
            <MapPin className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {roadmap ? `${roadmapPct}%` : '0%'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 truncate">
            {roadmap ? `${completedWeeks} of ${totalWeeks} weeks completed` : 'No active roadmap'}
          </p>
        </div>

        {/* Metric 4: Interview Preparedness */}
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Mock Interview</span>
            <Mic className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">
            Ready
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Voice & text simulation ready
          </p>
        </div>
      </div>

      {/* Main Grid: Role Recommendations & Skills Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recommended Roles List (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <span>Recommended Career Paths</span>
            </h2>
            <span className="text-xs text-slate-400">Ranked by verified skill coverage</span>
          </div>

          <div className="space-y-3">
            {roleMatches.map((match) => (
              <div
                key={match.role.id}
                className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl hover:border-indigo-500/40 transition group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition">
                        {match.role.title}
                      </h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {match.role.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 max-w-xl">
                      {match.role.summary}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xl font-black text-indigo-400">
                      {match.matchScore}%
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">Match Score</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${match.matchScore}%` }}
                  />
                </div>

                {/* Missing priority skills */}
                {match.missingCoreSkills.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-slate-400 text-[11px]">Priority gaps to close:</span>
                    {match.missingCoreSkills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-md text-[11px]"
                      >
                        + {skill}
                      </span>
                    ))}
                    <button
                      onClick={() => setActiveTab('roadmap')}
                      className="ml-auto text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition"
                    >
                      <span>Build Roadmap</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar: Active Resume Summary & Quick Tools */}
        <div className="space-y-6">
          {/* Resume Snapshot */}
          <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" />
              <span>Resume Health Overview</span>
            </h2>

            {resume ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">File Name:</span>
                  <span className="text-white font-medium truncate max-w-[150px]">{resume.fileName}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Impact Metrics:</span>
                  <span className="text-indigo-400 font-semibold">{resume.heuristicScore.quantifiableImpact}%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Active Verbs:</span>
                  <span className="text-indigo-400 font-semibold">{resume.heuristicScore.actionVerbs}%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">ATS Formatting:</span>
                  <span className="text-emerald-400 font-semibold">{resume.heuristicScore.atsFormatting}%</span>
                </div>

                <button
                  onClick={() => setActiveTab('resume')}
                  className="w-full mt-2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
                >
                  View Full Resume Audit & Editor
                </button>
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-400">
                <p className="mb-3">No resume uploaded yet.</p>
                <button
                  onClick={() => setActiveTab('resume')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition"
                >
                  Upload Resume
                </button>
              </div>
            )}
          </div>

          {/* Quick Access Tools */}
          <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Quick Career Tools</span>
            </h2>

            <button
              onClick={() => setActiveTab('counselor')}
              className="w-full p-3 bg-slate-800/60 hover:bg-slate-800 text-left rounded-xl border border-slate-700/60 transition flex items-center justify-between group"
            >
              <div>
                <div className="text-xs font-bold text-white group-hover:text-indigo-300">AI Counselor Chat</div>
                <div className="text-[11px] text-slate-400">Ask career & salary questions</div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
            </button>

            <button
              onClick={() => setActiveTab('interview')}
              className="w-full p-3 bg-slate-800/60 hover:bg-slate-800 text-left rounded-xl border border-slate-700/60 transition flex items-center justify-between group"
            >
              <div>
                <div className="text-xs font-bold text-white group-hover:text-amber-300">Mock Interview</div>
                <div className="text-[11px] text-slate-400">Voice practice & STAR grading</div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400" />
            </button>

            <button
              onClick={() => setActiveTab('jobs')}
              className="w-full p-3 bg-slate-800/60 hover:bg-slate-800 text-left rounded-xl border border-slate-700/60 transition flex items-center justify-between group"
            >
              <div>
                <div className="text-xs font-bold text-white group-hover:text-blue-300">Job Market Matches</div>
                <div className="text-[11px] text-slate-400">Matched with your active skills</div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
            </button>

            <button
              onClick={() => setActiveTab('branding')}
              className="w-full p-3 bg-slate-800/60 hover:bg-slate-800 text-left rounded-xl border border-slate-700/60 transition flex items-center justify-between group"
            >
              <div>
                <div className="text-xs font-bold text-white group-hover:text-purple-300">LinkedIn Optimizer</div>
                <div className="text-[11px] text-slate-400">Generate headline & pitch</div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
