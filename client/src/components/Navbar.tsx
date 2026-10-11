import React from 'react';
import {
  Compass,
  FileText,
  MessageSquare,
  MapPin,
  Mic,
  Briefcase,
  Share2,
  PieChart,
  User,
  Globe,
  Home,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useProfile } from '../context/ProfileContext';
import { SupportedLanguage } from '../i18n/translations';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, profile } = useProfile();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: t.nav.dashboard, icon: Home },
    { id: 'resume', label: t.nav.resumeAnalyzer, icon: FileText },
    { id: 'counselor', label: t.nav.counselor, icon: MessageSquare },
    { id: 'roadmap', label: t.nav.roadmap, icon: MapPin },
    { id: 'interview', label: t.nav.mockInterview, icon: Mic },
    { id: 'jobs', label: t.nav.jobs, icon: Briefcase },
    { id: 'branding', label: t.nav.branding, icon: Share2 },
    { id: 'assessment', label: t.nav.assessment, icon: PieChart },
  ];

  return (
    <div className="sticky top-3 z-50 px-3 sm:px-6 max-w-7xl mx-auto w-full transition-all">
      <header className="glass-island rounded-2xl sm:rounded-full px-3 sm:px-5 py-2 transition-all">
        <div className="flex items-center justify-between">
          {/* Logo with machined hardware badge */}
          <div
            onClick={() => setActiveTab('landing')}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 border border-indigo-500/30 flex items-center justify-center shadow-inner group-hover:border-indigo-400/60 transition-all duration-300 group-hover:scale-105">
              <Compass className="w-4 h-4 text-indigo-400 group-hover:rotate-45 transition-transform duration-500" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-sm font-extrabold tracking-tight text-white font-display">CareerPilot</span>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">v2.5</span>
              </div>
              <p className="text-[9px] font-mono tracking-widest text-slate-400 uppercase mt-0.5 hidden sm:block">AUTONOMOUS INTELLIGENCE</p>
            </div>
          </div>

          {/* Desktop Navigation - Pill Bar */}
          <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1 p-1 bg-white/[0.02] border border-white/5 rounded-full shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1 px-2.5 xl:px-3 py-1.5 rounded-full text-[11px] xl:text-xs font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-[0_2px_12px_rgba(79,70,229,0.4)] font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 opacity-80 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Utility: Language & Profile & Mobile Toggle */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Language dropdown */}
            <div className="relative flex items-center bg-white/[0.04] border border-white/10 rounded-full px-2.5 py-1 transition hover:border-white/20">
              <Globe className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="bg-transparent text-xs font-mono font-medium text-slate-200 focus:outline-none cursor-pointer pr-1"
              >
                <option value="en" className="bg-[#0D1017] text-white">EN</option>
                <option value="te" className="bg-[#0D1017] text-white">తెలుగు</option>
                <option value="hi" className="bg-[#0D1017] text-white">हिन्दी</option>
              </select>
            </div>

            {/* Profile Avatar / Onboarding Shortcut */}
            <button
              onClick={() => setActiveTab('onboarding')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-200 cursor-pointer ${
                activeTab === 'onboarding'
                  ? 'border-indigo-500/50 bg-indigo-500/15 text-white shadow-sm'
                  : 'border-white/10 bg-white/[0.03] text-slate-300 hover:text-white hover:border-white/25'
              }`}
            >
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline max-w-[85px] truncate font-sans">
                {profile ? profile.name : t.nav.onboarding}
              </span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white rounded-full bg-white/[0.04] border border-white/10 hover:border-white/20 transition cursor-pointer"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 text-indigo-400" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 px-3 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.06] bg-white/[0.02]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>
    </div>
  );
};

