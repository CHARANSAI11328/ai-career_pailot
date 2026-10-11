import React, { useState, useEffect, useRef } from 'react';
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
  Award,
  Zap,
  ChevronRight,
  Check,
  PlayCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useProfile } from '../context/ProfileContext';

export const LandingPage: React.FC = () => {
  const { setActiveTab, loadDemoProfile } = useProfile();
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Interactive HUD state for hero preview
  const [activeHudRole, setActiveHudRole] = useState<'swe' | 'ml'>('swe');
  const [hudBulletOptimized, setHudBulletOptimized] = useState(false);

  // Subtle interactive particle constellation in hero background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes
    const particleCount = 35;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.5 + 0.5,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      // Draw points
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(165, 180, 252, 0.45)';
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative text-left space-y-24 pb-24 overflow-hidden">
      {/* Cinematic Hero Section */}
      <section className="relative pt-8 sm:pt-16 pb-12 overflow-hidden">
        {/* Ambient Canvas Layer */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none opacity-40 z-0"
        />

        {/* Ambient light gradient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Asymmetrical Typography & Action System */}
            <div className="lg:col-span-7 space-y-6">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-indigo-300 text-[11px] font-mono tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                <span>AUTONOMOUS TALENT INTELLIGENCE // v2.5</span>
              </div>

              {/* Massive Display Heading */}
              <h1 className="text-4xl sm:text-6xl xl:text-[4rem] font-extrabold text-white tracking-tight leading-[1.08] font-display">
                Precision career moves, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-indigo-100 to-slate-400">
                  governed by data.
                </span>
              </h1>

              {/* Subtitle / Value proposition */}
              <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                Stop relying on generic LLM advice. Inspect deterministic ATS rubrics, quantify accomplishments with the Google XYZ framework, and execute personalized learning roadmaps with verified labor market intelligence.
              </p>

              {/* Button-in-Button CTA Architecture */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('judgeDemo')}
                  className="btn-nested-spring group relative inline-flex items-center gap-3 pl-6 pr-2.5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-[0_8px_25px_rgba(79,70,229,0.4)]"
                >
                  <Award className="w-4 h-4 text-indigo-200" />
                  <span>Launch Judge Tour</span>
                  <span className="w-8 h-8 rounded-full bg-white/15 group-hover:bg-white/25 flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('resume')}
                  className="btn-nested-spring inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/10 hover:border-white/20 text-sm font-medium transition"
                >
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span>Audit Resume</span>
                </button>

                <button
                  onClick={() => setActiveTab('counselor')}
                  className="btn-nested-spring inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/10 hover:border-white/20 text-sm font-medium transition"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>AI Counselor</span>
                </button>
              </div>

              {/* Concentric Double-Bezel Quick Selector for Evaluators */}
              <div className="pt-4 max-w-lg">
                <div className="doppelrand-shell">
                  <div className="doppelrand-core p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="font-mono text-[11px] text-slate-400">INSTANT EVALUATION:</span>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => loadDemoProfile('demo_fullstack')}
                        className="flex-1 sm:flex-initial px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-indigo-300 border border-indigo-500/25 text-xs font-mono transition text-center"
                      >
                        Priya (SWE)
                      </button>
                      <button
                        onClick={() => loadDemoProfile('demo_ai_ml')}
                        className="flex-1 sm:flex-initial px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-emerald-300 border border-emerald-500/25 text-xs font-mono transition text-center"
                      >
                        Alex (AI/ML)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive Telemetry Card (Hardware HUD) */}
            <div className="lg:col-span-5">
              <div className="doppelrand-shell">
                <div className="doppelrand-core p-5 sm:p-6 space-y-5">
                  {/* Card Hardware Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-mono text-xs font-semibold text-slate-200 uppercase tracking-wider">
                        LIVE TELEMETRY COCKPIT
                      </span>
                    </div>
                    <div className="flex items-center bg-black/40 rounded-full p-0.5 border border-white/10 text-[10px] font-mono">
                      <button
                        onClick={() => setActiveHudRole('swe')}
                        className={`px-2 py-0.5 rounded-full transition ${activeHudRole === 'swe' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                      >
                        SWE
                      </button>
                      <button
                        onClick={() => setActiveHudRole('ml')}
                        className={`px-2 py-0.5 rounded-full transition ${activeHudRole === 'ml' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                      >
                        AI/ML
                      </button>
                    </div>
                  </div>

                  {/* Score Dial & Metrics Cluster */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">OVERALL ATS MATCH</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
                          {activeHudRole === 'swe' ? '92' : '88'}
                        </span>
                        <span className="text-xs text-emerald-400 font-mono font-medium">/ 100</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-400 h-full rounded-full transition-all duration-700"
                          style={{ width: activeHudRole === 'swe' ? '92%' : '88%' }}
                        />
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">KEYWORD ALIGNMENT</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
                          {activeHudRole === 'swe' ? '94%' : '86%'}
                        </span>
                        <span className="text-xs text-indigo-400 font-mono font-medium">+14%</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-400 h-full rounded-full transition-all duration-700"
                          style={{ width: activeHudRole === 'swe' ? '94%' : '86%' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Interactive Google XYZ Transformer Preview */}
                  <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-indigo-400" />
                        GOOGLE XYZ REWRITER TELEMETRY
                      </span>
                      <button
                        onClick={() => setHudBulletOptimized(!hudBulletOptimized)}
                        className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
                      >
                        {hudBulletOptimized ? 'View Raw' : 'Simulate Rewrite'}
                      </button>
                    </div>

                    <div className="text-xs leading-relaxed transition-all duration-300">
                      {hudBulletOptimized ? (
                        <div className="text-emerald-300 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                          <span className="font-semibold">Optimized:</span> "Decreased p99 payment latency by 42% for 1.2M daily users by designing a distributed Redis cache in Go."
                        </div>
                      ) : (
                        <div className="text-slate-300 bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                          <span className="text-slate-500 font-semibold">Raw:</span> "Worked on backend payment system performance improvements using Go and Redis."
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hardware Telemetry Specs */}
                  <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <div className="flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-indigo-400" />
                      <span>Gemini 2.5 Flash Flash Engine</span>
                    </div>
                    <span className="text-emerald-400 font-semibold">LATENCY: 320ms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Telemetry Indicator Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-white tabular-nums">6-Part</span>
            <p className="text-xs font-mono text-slate-400 mt-1 uppercase">Deterministic ATS Rubric</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-white tabular-nums">&lt; 400ms</span>
            <p className="text-xs font-mono text-slate-400 mt-1 uppercase">Client-Side Parser Latency</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-white tabular-nums">3 Languages</span>
            <p className="text-xs font-mono text-slate-400 mt-1 uppercase">EN, Telugu, Hindi Voice</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-white tabular-nums">0 B</span>
            <p className="text-xs font-mono text-slate-400 mt-1 uppercase">Permanent Cloud Storage</p>
          </div>
        </div>
      </section>

      {/* Asymmetrical Bento Architecture Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-indigo-400 mb-1">
              PLATFORM CAPABILITIES
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
              Engineered for genuine career breakthroughs.
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md">
            Every feature connects deterministically into a single feedback loop—from raw resume parsing to real-time voice interviews.
          </p>
        </div>

        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Bento Card 1 (Span 7): Deep Resume & ATS Analyzer */}
          <div
            onClick={() => setActiveTab('resume')}
            className="lg:col-span-7 doppelrand-shell cursor-pointer group"
          >
            <div className="doppelrand-core p-6 sm:p-8 flex flex-col justify-between h-full space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10 uppercase">
                    PARSER ENGINE
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white font-display group-hover:text-indigo-300 transition flex items-center gap-2">
                    <span>Deterministic Resume & ATS Audit</span>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition" />
                  </h3>
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                    Evaluates formatting stability, keyword coverage, and section completeness across PDF, DOCX, and TXT files. Converts passive duty statements into high-impact Google XYZ achievement bullets with quantifiable metrics.
                  </p>
                </div>
              </div>

              {/* Visual preview strip inside Bento 1 */}
              <div className="bg-black/40 border border-white/5 rounded-xl p-4 grid grid-cols-3 gap-3 text-center text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">PARSED SKILLS</span>
                  <span className="text-emerald-400 font-bold text-sm">28 Extracted</span>
                </div>
                <div className="border-x border-white/10 px-2">
                  <span className="text-slate-400 block text-[10px]">FORMAT SAFETY</span>
                  <span className="text-indigo-400 font-bold text-sm">100% Clean</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">QUANTIFIABLE</span>
                  <span className="text-amber-400 font-bold text-sm">8 Detected</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Card 2 (Span 5): Gemini Career Counselor */}
          <div
            onClick={() => setActiveTab('counselor')}
            className="lg:col-span-5 doppelrand-shell cursor-pointer group"
          >
            <div className="doppelrand-core p-6 sm:p-8 flex flex-col justify-between h-full space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10 uppercase">
                    MULTILINGUAL AI
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white font-display group-hover:text-purple-300 transition flex items-center gap-2">
                    <span>Conversational AI Counselor</span>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition" />
                  </h3>
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                    Personalized mentoring powered by Google Gemini 2.5 Flash. Ask nuanced career pivot dilemmas, salary benchmark questions, and role requirements in English, Telugu, or Hindi.
                  </p>
                </div>
              </div>

              {/* Speech Matrix wave simulation */}
              <div className="bg-black/40 border border-white/5 rounded-xl p-3.5 flex items-center justify-between text-xs font-mono text-purple-300">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  <span>Interactive Audio & Text</span>
                </div>
                <span className="text-[10px] text-slate-400">EN // తె // हि</span>
              </div>
            </div>
          </div>

          {/* Bento Card 3 (Span 5): Interactive Mock Interview */}
          <div
            onClick={() => setActiveTab('interview')}
            className="lg:col-span-5 doppelrand-shell cursor-pointer group"
          >
            <div className="doppelrand-core p-6 sm:p-8 flex flex-col justify-between h-full space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition">
                    <Mic className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10 uppercase">
                    STAR METHOD ENGINE
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white font-display group-hover:text-amber-300 transition flex items-center gap-2">
                    <span>Voice Mock Interview Simulator</span>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition" />
                  </h3>
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                    Practice role-specific technical and behavioral interviews using browser Web Speech recognition. Receive instantaneous rubric grading, structure feedback, and STAR rephrase prompts.
                  </p>
                </div>
              </div>

              <div className="bg-black/40 border border-white/5 rounded-xl p-3.5 flex items-center justify-between text-xs font-mono text-amber-300">
                <div className="flex items-center gap-2">
                  <PlayCircle className="w-4 h-4 text-amber-400" />
                  <span>Real-time voice capture</span>
                </div>
                <span className="text-emerald-400 font-bold">STAR Graded</span>
              </div>
            </div>
          </div>

          {/* Bento Card 4 (Span 7): Learning Roadmap & Skill Radar */}
          <div
            onClick={() => setActiveTab('roadmap')}
            className="lg:col-span-7 doppelrand-shell cursor-pointer group"
          >
            <div className="doppelrand-core p-6 sm:p-8 flex flex-col justify-between h-full space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10 uppercase">
                    CURRICULUM GRAPH
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white font-display group-hover:text-emerald-300 transition flex items-center gap-2">
                    <span>Dynamic Learning Roadmap & Milestone Graph</span>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition" />
                  </h3>
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                    Transforms quantified skill deficiencies into week-by-week actionable tracks with prerequisite dependencies, verified open course links (Coursera, MDN, edX), and resume-ready capstone portfolio project prompts.
                  </p>
                </div>
              </div>

              {/* Progress visual */}
              <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
                <span className="text-slate-400">Sample Path: Distributed Systems in Go</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  8 Weeks • 4 Capstones
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two-Column Asymmetrical Engineering Philosophy */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="doppelrand-shell">
          <div className="doppelrand-core p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <div className="text-[11px] font-mono uppercase tracking-widest text-indigo-400">
                  ARCHITECTURAL PLEDGE
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                  Zero Hallucinations. <br />
                  Zero Hidden Prompts.
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Unlike black-box career apps that hallucinate scores, CareerPilot implements transparent client-side NLP evaluation routines alongside Google Gemini 2.5 Flash reasoning.
                </p>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>Deterministic Rubrics</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Transparent formula breakdowns for ATS scoring, action verb densities, and format safety.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <ShieldCheck className="w-4 h-4" />
                    <span>In-Memory Parsing</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Your resume text is parsed in memory. Raw documents are never stored or retained permanently on disk.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                    <TrendingUp className="w-4 h-4" />
                    <span>Real Labor Benchmarks</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Salary bands and tech hiring percentiles aligned to real-world engineering market tiers.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <Award className="w-4 h-4" />
                    <span>Instant Evaluation</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Preloaded high-fidelity developer profiles ready for instant 1-click test evaluations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-5xl mx-auto px-4 text-center">
        <div className="p-8 sm:p-12 rounded-[2rem] bg-gradient-to-b from-indigo-950/40 to-black/60 border border-indigo-500/20 relative overflow-hidden space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono uppercase">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Ready for Review</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            Experience the complete platform now.
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Walk through the curated Judge Tour or test your own resume and interview skills against real criteria.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('judgeDemo')}
              className="btn-nested-spring group inline-flex items-center gap-3 pl-6 pr-2.5 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-[0_8px_25px_rgba(79,70,229,0.4)]"
            >
              <span>Start Judge Demo Tour</span>
              <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>
            <button
              onClick={() => setActiveTab('resume')}
              className="px-6 py-3 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/10 text-sm font-medium transition"
            >
              Upload Sample Resume
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

