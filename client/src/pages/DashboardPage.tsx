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
  ChevronRight,
  Compass,
  Cpu
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      {/* Top Welcome & Summary Header */}
      <div className="doppelrand-shell">
        <div className="doppelrand-core p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-indigo-300 text-[11px] font-mono tracking-wider uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <span>CAREER INTELLIGENCE TELEMETRY</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
              Welcome back, {profile?.name || 'Candidate'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
              TARGET ROLE: <span className="text-indigo-300 font-semibold">{profile?.targetRole || 'Full Stack Software Engineer'}</span> • {profile?.experienceLevel || 'Fresher'}
            </p>
          </div>

          <button
            onClick={() => setActiveTab('onboarding')}
            className="px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono font-medium text-slate-200 border border-white/10 hover:border-white/20 rounded-full transition"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Recommended Next Action Banner */}
      <div className="doppelrand-shell">
        <div className="doppelrand-core p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-gradient-to-r from-indigo-950/20 via-black/40 to-black/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shadow-inner shrink-0">
              <NextIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-indigo-500/15 text-indigo-300 mb-1 border border-indigo-500/25 uppercase">
                <Zap className="w-3 h-3 text-indigo-400" /> RECOMMENDED NEXT ACTION
              </div>
              <h2 className="text-lg font-bold text-white font-display">{nextAction.title}</h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">{nextAction.desc}</p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab(nextAction.tab)}
            className="btn-nested-spring group px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-xs font-semibold flex items-center gap-2 transition shadow-[0_4px_16px_rgba(79,70,229,0.35)] shrink-0"
          >
            <span>{nextAction.actionLabel}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Top Role Match */}
        <div className="doppelrand-shell">
          <div className="doppelrand-core p-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="uppercase tracking-wider">TOP ROLE MATCH</span>
              <Award className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
              {topMatch ? `${topMatch.matchScore}%` : '—'}
            </div>
            <p className="text-[11px] font-mono text-slate-400 truncate">
              {topMatch ? topMatch.role.title : 'Configure skills to calculate'}
            </p>
          </div>
        </div>

        {/* Metric 2: Resume ATS Health */}
        <div className="doppelrand-shell">
          <div className="doppelrand-core p-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="uppercase tracking-wider">ATS HEALTH SCORE</span>
              <FileText className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
              {resume ? `${resume.heuristicScore.overall}/100` : '—'}
            </div>
            <p className="text-[11px] font-mono text-slate-400 truncate">
              {resume ? `${resume.extractedSkills.length} verified skills` : 'Upload resume to audit'}
            </p>
          </div>
        </div>

        {/* Metric 3: Roadmap Progress */}
        <div className="doppelrand-shell">
          <div className="doppelrand-core p-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="uppercase tracking-wider">LEARNING ROADMAP</span>
              <MapPin className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
              {roadmap ? `${roadmapPct}%` : '0%'}
            </div>
            <p className="text-[11px] font-mono text-slate-400 truncate">
              {roadmap ? `${completedWeeks} of ${totalWeeks} weeks done` : 'No active roadmap'}
            </p>
          </div>
        </div>

        {/* Metric 4: Interview Preparedness */}
        <div className="doppelrand-shell">
          <div className="doppelrand-core p-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="uppercase tracking-wider">MOCK INTERVIEW</span>
              <Mic className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
              READY
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              STAR voice simulation active
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Role Recommendations & Skills Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recommended Roles List (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 font-display">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <span>Recommended Career Paths</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">RANKED BY SKILL COVERAGE</span>
          </div>

          <div className="space-y-3">
            {roleMatches.map((match) => (
              <div
                key={match.role.id}
                className="doppelrand-shell group"
              >
                <div className="doppelrand-core p-5 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-bold text-white font-display group-hover:text-indigo-300 transition">
                          {match.role.title}
                        </h3>
                        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">
                          {match.role.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 max-w-xl leading-relaxed">
                        {match.role.summary}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xl font-extrabold text-indigo-400 font-mono tabular-nums">
                        {match.matchScore}%
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">FIT INDEX</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${match.matchScore}%` }}
                    />
                  </div>

                  {/* Missing priority skills */}
                  {match.missingCoreSkills.length > 0 && (
                    <div className="pt-2 border-t border-white/[0.06] flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-slate-400 text-[11px] font-mono">Priority gaps:</span>
                      {match.missingCoreSkills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-full text-[10px] font-mono"
                        >
                          + {skill}
                        </span>
                      ))}
                      <button
                        onClick={() => setActiveTab('roadmap')}
                        className="ml-auto text-[11px] font-mono text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition"
                      >
                        <span>Build Roadmap</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar: Active Resume Summary & Quick Tools */}
        <div className="space-y-6">
          {/* Resume Snapshot */}
          <div className="doppelrand-shell">
            <div className="doppelrand-core p-6 space-y-4">
              <h2 className="text-sm font-mono uppercase tracking-wider text-white flex items-center gap-2 font-bold">
                <FileText className="w-4 h-4 text-purple-400" />
                <span>Resume Health Overview</span>
              </h2>

              {resume ? (
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">File:</span>
                    <span className="text-white font-medium truncate max-w-[150px]">{resume.fileName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Impact Metrics:</span>
                    <span className="text-indigo-400 font-semibold tabular-nums">{resume.heuristicScore.quantifiableImpact}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Active Verbs:</span>
                    <span className="text-indigo-400 font-semibold tabular-nums">{resume.heuristicScore.actionVerbs}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">ATS Formatting:</span>
                    <span className="text-emerald-400 font-semibold tabular-nums">{resume.heuristicScore.atsFormatting}%</span>
                  </div>

                  <button
                    onClick={() => setActiveTab('resume')}
                    className="w-full mt-2 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 text-xs font-mono font-medium rounded-full border border-white/10 transition"
                  >
                    View Resume Audit
                  </button>
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-slate-400 space-y-3 font-mono">
                  <p>No resume ingested yet.</p>
                  <button
                    onClick={() => setActiveTab('resume')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-medium transition"
                  >
                    Upload Resume
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Access Tools */}
          <div className="doppelrand-shell">
            <div className="doppelrand-core p-6 space-y-3">
              <h2 className="text-sm font-mono uppercase tracking-wider text-white flex items-center gap-2 font-bold">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Quick Career Tools</span>
              </h2>

              <button
                onClick={() => setActiveTab('counselor')}
                className="w-full p-3 bg-white/[0.02] hover:bg-white/[0.06] text-left rounded-xl border border-white/5 hover:border-white/10 transition flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-indigo-300 font-display transition">AI Counselor Chat</div>
                  <div className="text-[11px] text-slate-400">Ask career & salary questions</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => setActiveTab('interview')}
                className="w-full p-3 bg-white/[0.02] hover:bg-white/[0.06] text-left rounded-xl border border-white/5 hover:border-white/10 transition flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-indigo-300 font-display transition">Mock Interview</div>
                  <div className="text-[11px] text-slate-400">Voice practice & STAR grading</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => setActiveTab('jobs')}
                className="w-full p-3 bg-white/[0.02] hover:bg-white/[0.06] text-left rounded-xl border border-white/5 hover:border-white/10 transition flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-indigo-300 font-display transition">Job Market Matches</div>
                  <div className="text-[11px] text-slate-400">Matched with your active skills</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => setActiveTab('branding')}
                className="w-full p-3 bg-white/[0.02] hover:bg-white/[0.06] text-left rounded-xl border border-white/5 hover:border-white/10 transition flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-indigo-300 font-display transition">LinkedIn Optimizer</div>
                  <div className="text-[11px] text-slate-400">Generate headline & pitch</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

