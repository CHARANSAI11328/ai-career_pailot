import React from 'react';
import {
  Compass,
  FileText,
  MessageSquare,
  MapPin,
  Mic,
  Briefcase,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Cpu,
  Layers,
  Award
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useProfile } from '../context/ProfileContext';

export const LandingPage: React.FC = () => {
  const { setActiveTab, loadDemoProfile } = useProfile();
  const { t } = useLanguage();

  return (
    <div className="space-y-16 pb-16 text-left">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Next-Generation Career Intelligence & Counsel</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight sm:leading-none mb-6">
            Make Smarter Career Moves With <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Evidence-Based AI
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 mb-8 leading-relaxed">
            Stop guessing your job prospects. Upload your resume, uncover concrete skill gaps, receive transparent ATS audits, practice mock interviews, and build personalized roadmaps verified by real data.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setActiveTab('judgeDemo')}
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition shadow-xl shadow-indigo-600/30 hover:scale-[1.02]"
            >
              <Award className="w-4 h-4" />
              <span>Launch Judge Demo Tour</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('resume')}
              className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 rounded-xl font-semibold text-sm flex items-center gap-2 transition"
            >
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Analyze My Resume</span>
            </button>

            <button
              onClick={() => setActiveTab('counselor')}
              className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl font-semibold text-sm flex items-center gap-2 transition"
            >
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <span>Chat With AI Counselor</span>
            </button>
          </div>

          {/* Quick Demo Selector for Judges */}
          <div className="mt-10 p-4 bg-slate-900/80 border border-indigo-500/20 rounded-2xl max-w-xl mx-auto text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>1-Click Synthetic Profiles (Instant Test):</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => loadDemoProfile('demo_fullstack')}
                className="px-3 py-1.5 bg-indigo-950 text-indigo-300 hover:bg-indigo-900 rounded-lg border border-indigo-500/30 font-medium transition"
              >
                Priya (SWE)
              </button>
              <button
                onClick={() => loadDemoProfile('demo_ai_ml')}
                className="px-3 py-1.5 bg-purple-950 text-purple-300 hover:bg-purple-900 rounded-lg border border-purple-500/30 font-medium transition"
              >
                Alex (AI/ML)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Connected 3-Step Philosophy */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Built on Three Core Engineering Principles
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Not another chatbot wrapper. An integrated system turning insights into verified career progress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 relative group hover:border-indigo-500/40 transition">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-lg mb-4 border border-indigo-500/20">
              01
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Understand the User</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              We extract evidenced skills, quantify bullet impact, and audit formatting risks across PDF, DOCX, and TXT files using deterministic NLP rubrics.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 relative group hover:border-purple-500/40 transition">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-lg mb-4 border border-purple-500/20">
              02
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Identify the Best Next Move</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Compare your exact profile against target roles and live job descriptions. Calculate explainable match scores without black-box hallucination.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 relative group hover:border-pink-500/40 transition">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center font-bold text-lg mb-4 border border-pink-500/20">
              03
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Turn Decisions into Progress</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Execute structured weekly learning milestones with verified courses, practical portfolio capstones, and real-time voice mock interviews.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Modules Grid */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Comprehensive Suite</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            End-to-End Career Intelligence Platform
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div
            onClick={() => setActiveTab('resume')}
            className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl hover:border-indigo-500/50 hover:bg-slate-800/50 transition cursor-pointer group"
          >
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl w-fit mb-4 group-hover:scale-110 transition">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5 flex items-center justify-between">
              <span>Resume Analyzer & ATS Audit</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition" />
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transparent 6-part heuristic scoring, section completeness, quantifiable metrics detector, and side-by-side Google XYZ bullet rewriter.
            </p>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => setActiveTab('counselor')}
            className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl hover:border-purple-500/50 hover:bg-slate-800/50 transition cursor-pointer group"
          >
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl w-fit mb-4 group-hover:scale-110 transition">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5 flex items-center justify-between">
              <span>AI Career Counselor</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition" />
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Powered by Google Gemini 2.5 Flash. Delivers conversational career guidance, salary benchmarks, and multilingual counseling (EN, Telugu, Hindi).
            </p>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => setActiveTab('roadmap')}
            className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl hover:border-emerald-500/50 hover:bg-slate-800/50 transition cursor-pointer group"
          >
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit mb-4 group-hover:scale-110 transition">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5 flex items-center justify-between">
              <span>Personalized Learning Roadmap</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition" />
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ordered weekly schedule respecting prerequisite dependencies, verified learning resources (Coursera, edX, MDN), and portfolio projects.
            </p>
          </div>

          {/* Card 4 */}
          <div
            onClick={() => setActiveTab('interview')}
            className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl hover:border-amber-500/50 hover:bg-slate-800/50 transition cursor-pointer group"
          >
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl w-fit mb-4 group-hover:scale-110 transition">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5 flex items-center justify-between">
              <span>Voice & Text Mock Interview</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition" />
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Practice role-specific technical and behavioral STAR questions with Web Speech voice answering, TTS speech playback, and rubric grading.
            </p>
          </div>

          {/* Card 5 */}
          <div
            onClick={() => setActiveTab('jobs')}
            className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl hover:border-blue-500/50 hover:bg-slate-800/50 transition cursor-pointer group"
          >
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl w-fit mb-4 group-hover:scale-110 transition">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5 flex items-center justify-between">
              <span>Job Market Intelligence</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition" />
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Curated listings with real-world schemas, personalized match percentage against your resume, and application tracking.
            </p>
          </div>

          {/* Card 6 */}
          <div
            onClick={() => setActiveTab('branding')}
            className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl hover:border-violet-500/50 hover:bg-slate-800/50 transition cursor-pointer group"
          >
            <div className="p-3 bg-violet-500/10 text-violet-400 rounded-xl w-fit mb-4 group-hover:scale-110 transition">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5 flex items-center justify-between">
              <span>LinkedIn & Branding Suite</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-violet-400 transition" />
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate punchy professional headlines, engaging About summaries, and personalized networking messages for hiring managers.
            </p>
          </div>
        </div>
      </section>

      {/* Security & Privacy Section */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Security & Privacy by Design</h3>
              <p className="text-xs text-slate-400">Resumes contain sensitive personal data. We treat them with strict confidentiality.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300 mt-6 pt-6 border-t border-slate-800">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>In-memory document parsing; raw files are never retained permanently on disk.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Full user data deletion controls to permanently erase parsed records anytime.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Transparent algorithmic rubrics: no opaque black boxes or fabricated metrics.</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
