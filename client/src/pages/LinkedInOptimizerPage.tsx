import React, { useState } from 'react';
import { Share2, Sparkles, Copy, Check, User, ArrowRight } from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { api } from '../services/api';

export const LinkedInOptimizerPage: React.FC = () => {
  const { profile, userId } = useProfile();

  const [isGenerating, setIsGenerating] = useState(false);
  const [brandingResult, setBrandingResult] = useState<{
    headline: string;
    about: string;
    projectHighlights: string[];
    networkingPitch: string;
  } | null>(null);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await api.optimizeBranding({
        name: profile?.name,
        targetRole: profile?.targetRole,
        skills: profile?.skills,
        bio: profile?.careerGoals,
        userId
      });
      setBrandingResult(res.branding);
    } catch (err: any) {
      alert(err.message || 'Failed to generate branding suite');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 text-left">
      {/* Header */}
      <div className="doppelrand-shell">
        <div className="doppelrand-core p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-400 border border-violet-500/25 flex items-center justify-center shadow-inner">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-violet-300 text-[10px] font-mono tracking-wider uppercase mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                <span>EXECUTIVE BRANDING SUITE</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white font-display">LinkedIn & Professional Branding</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Transform your profile headline, About section, and recruiter networking pitches into high-conversion assets.
              </p>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="btn-nested-spring px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-full text-xs font-semibold flex items-center gap-1.5 transition shadow-[0_4px_16px_rgba(79,70,229,0.35)] shrink-0 font-mono"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'Synthesizing...' : 'Generate Assets'}</span>
          </button>
        </div>
      </div>

      {!brandingResult && (
        <div className="doppelrand-shell">
          <div className="doppelrand-core p-12 text-center space-y-4">
            <Share2 className="w-12 h-12 text-slate-600 mx-auto" />
            <h2 className="text-lg font-bold text-white font-display">Ready to Elevate Your Professional Brand</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Synthesize tailored LinkedIn headlines, a compelling narrative About summary, and direct hiring manager outreach templates.
            </p>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="btn-nested-spring px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-xs font-semibold transition shadow-md font-mono"
            >
              {isGenerating ? 'Synthesizing...' : 'Generate Assets Now'}
            </button>
          </div>
        </div>
      )}

      {brandingResult && (
        <div className="space-y-6">
          {/* Card 1: Headline */}
          <div className="doppelrand-shell">
            <div className="doppelrand-core p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white font-display">High-Impact LinkedIn Headline</h3>
                <button
                  onClick={() => copyToClipboard(brandingResult.headline, 'headline')}
                  className="px-3 py-1 bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/10 rounded-full text-xs font-mono flex items-center gap-1 transition"
                >
                  {copiedKey === 'headline' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'headline' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-xs text-white font-mono leading-relaxed">
                {brandingResult.headline}
              </div>
            </div>
          </div>

          {/* Card 2: About Section */}
          <div className="doppelrand-shell">
            <div className="doppelrand-core p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white font-display">Engaging 'About' Story</h3>
                <button
                  onClick={() => copyToClipboard(brandingResult.about, 'about')}
                  className="px-3 py-1 bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/10 rounded-full text-xs font-mono flex items-center gap-1 transition"
                >
                  {copiedKey === 'about' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'about' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                {brandingResult.about}
              </div>
            </div>
          </div>

          {/* Card 3: Networking Outreach Pitch */}
          <div className="doppelrand-shell">
            <div className="doppelrand-core p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white font-display">Direct Recruiter Outreach Note</h3>
                <button
                  onClick={() => copyToClipboard(brandingResult.networkingPitch, 'pitch')}
                  className="px-3 py-1 bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/10 rounded-full text-xs font-mono flex items-center gap-1 transition"
                >
                  {copiedKey === 'pitch' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'pitch' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-xs text-slate-200 whitespace-pre-wrap font-mono leading-relaxed">
                {brandingResult.networkingPitch}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
