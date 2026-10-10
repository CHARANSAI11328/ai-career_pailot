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
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-lg">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-violet-500/10 text-violet-400 rounded-2xl border border-violet-500/20">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">LinkedIn & Professional Branding Optimizer</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Transform your profile headline, About section, and recruiter networking pitches into high-conversion assets.
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-indigo-600/30 shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isGenerating ? 'Synthesizing...' : 'Generate Branding Package'}</span>
        </button>
      </div>

      {!brandingResult && (
        <div className="p-12 bg-slate-900/60 border border-slate-800 rounded-3xl text-center space-y-4">
          <Share2 className="w-12 h-12 text-slate-600 mx-auto" />
          <h2 className="text-base font-bold text-white">Ready to Optimize Your Professional Brand</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Click below to generate tailored LinkedIn headlines, a compelling About summary, and recruiter outreach templates.
          </p>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/30"
          >
            {isGenerating ? 'Synthesizing Branding...' : 'Generate Assets Now'}
          </button>
        </div>
      )}

      {brandingResult && (
        <div className="space-y-6">
          {/* Card 1: Headline */}
          <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">High-Impact LinkedIn Headline</h3>
              <button
                onClick={() => copyToClipboard(brandingResult.headline, 'headline')}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
              >
                {copiedKey === 'headline' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'headline' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white font-mono leading-relaxed">
              {brandingResult.headline}
            </div>
          </div>

          {/* Card 2: About Section */}
          <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Engaging 'About' Story</h3>
              <button
                onClick={() => copyToClipboard(brandingResult.about, 'about')}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
              >
                {copiedKey === 'about' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'about' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
              {brandingResult.about}
            </div>
          </div>

          {/* Card 3: Networking Outreach Pitch */}
          <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Cold Recruiter & Manager Outreach Note</h3>
              <button
                onClick={() => copyToClipboard(brandingResult.networkingPitch, 'pitch')}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
              >
                {copiedKey === 'pitch' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'pitch' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-200 whitespace-pre-wrap font-mono leading-relaxed">
              {brandingResult.networkingPitch}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
