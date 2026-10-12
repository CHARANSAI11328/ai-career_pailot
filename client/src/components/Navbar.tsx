import React, { useState, useRef, useEffect } from 'react';
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
  Sparkles,
  ChevronDown,
  Layers,
  Key,
  Award
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useProfile } from '../context/ProfileContext';
import { SupportedLanguage } from '../i18n/translations';

interface NavbarProps {
  onOpenKeyModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenKeyModal }) => {
  const { activeTab, setActiveTab, profile, loadDemoProfile } = useProfile();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close "More" dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary 5 tools (always visible on desktop)
  const primaryNavItems = [
    { id: 'dashboard', label: t.nav.dashboard, icon: Home },
    { id: 'resume', label: t.nav.resumeAnalyzer, icon: FileText },
    { id: 'counselor', label: t.nav.counselor, icon: MessageSquare },
    { id: 'roadmap', label: t.nav.roadmap, icon: MapPin },
    { id: 'interview', label: t.nav.mockInterview, icon: Mic },
  ];

  // Secondary tools (housed under sleek "More" dropdown on desktop to prevent overflow)
  const secondaryNavItems = [
    {
      id: 'jobs',
      label: t.nav.jobs,
      icon: Briefcase,
      desc: 'Market salary & real-time role telemetry',
    },
    {
      id: 'branding',
      label: t.nav.branding,
      icon: Share2,
      desc: 'AI LinkedIn profile & headline optimizer',
    },
    {
      id: 'assessment',
      label: t.nav.assessment,
      icon: PieChart,
      desc: 'Interactive psychometric & skill fit quiz',
    },
  ];

  // Check if active tab is inside secondary items
  const activeSecondaryItem = secondaryNavItems.find((item) => item.id === activeTab);
  const isSecondaryActive = Boolean(activeSecondaryItem);

  return (
    <header className="w-full bg-[#080A0F]/95 backdrop-blur-xl border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
          {/* Brand Logo */}
          <div
            onClick={() => {
              setActiveTab('landing');
              setMobileMenuOpen(false);
            }}
            className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer group select-none shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/25 to-indigo-600/10 border border-indigo-500/30 flex items-center justify-center shadow-inner group-hover:border-indigo-400/60 transition-all duration-300 group-hover:scale-105">
              <Compass className="w-4 h-4 text-indigo-400 group-hover:rotate-45 transition-transform duration-500" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-base sm:text-lg font-extrabold tracking-tight text-white font-display">
                  CareerPilot
                </span>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                  v2.5
                </span>
              </div>
              <p className="text-[9px] font-mono tracking-widest text-slate-400 uppercase mt-0.5 hidden xl:block">
                AUTONOMOUS INTELLIGENCE
              </p>
            </div>
          </div>

          {/* Desktop Navigation Bar (Primary Items + Sleek More Dropdown) */}
          <nav className="hidden lg:flex items-center space-x-1 p-1 bg-white/[0.02] border border-white/5 rounded-full shadow-inner">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-[0_2px_12px_rgba(79,70,229,0.4)] font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 opacity-80 shrink-0" />
                  <span className="whitespace-nowrap">{item.label}</span>
                </button>
              );
            })}

            {/* "More Tools" Dropdown Container */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer shrink-0 ${
                  isSecondaryActive
                    ? 'bg-indigo-600/25 border border-indigo-500/40 text-indigo-200 font-semibold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Layers className="w-3.5 h-3.5 opacity-80 shrink-0" />
                <span className="whitespace-nowrap">
                  {isSecondaryActive ? activeSecondaryItem?.label : 'More'}
                </span>
                <ChevronDown
                  className={`w-3 h-3 opacity-70 transition-transform duration-200 ${
                    moreDropdownOpen ? 'rotate-180 text-indigo-400' : ''
                  }`}
                />
              </button>

              {/* Glassmorphism Dropdown Menu */}
              {moreDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#0B0E17]/95 backdrop-blur-2xl border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.8)] p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1">
                  <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                    Career Acceleration
                  </div>
                  {secondaryNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setMoreDropdownOpen(false);
                        }}
                        className={`w-full flex items-start space-x-3 p-2.5 rounded-xl text-left transition cursor-pointer ${
                          isActive
                            ? 'bg-indigo-600/20 border border-indigo-500/30 text-white'
                            : 'hover:bg-white/[0.05] text-slate-300 hover:text-white'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                            isActive
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'bg-white/[0.04] border border-white/5 text-slate-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white leading-tight">
                            {item.label}
                          </p>
                          <p className="text-[11px] text-slate-400 leading-tight mt-0.5 truncate">
                            {item.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Right Utilities: Language, Profile, Mobile Toggle */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Language Selector */}
            <div className="relative flex items-center bg-white/[0.04] border border-white/10 rounded-full px-2.5 py-1 transition hover:border-white/20">
              <Globe className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="bg-transparent text-xs font-mono font-medium text-slate-200 focus:outline-none cursor-pointer pr-1"
                aria-label="Select language"
              >
                <option value="en" className="bg-[#0D1017] text-white">
                  EN
                </option>
                <option value="te" className="bg-[#0D1017] text-white">
                  తెలుగు
                </option>
                <option value="hi" className="bg-[#0D1017] text-white">
                  हिन्दी
                </option>
              </select>
            </div>

            {/* Career Profile Shortcut */}
            <button
              onClick={() => setActiveTab('onboarding')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-200 cursor-pointer shrink-0 ${
                activeTab === 'onboarding'
                  ? 'border-indigo-500/50 bg-indigo-500/15 text-white shadow-sm'
                  : 'border-white/10 bg-white/[0.03] text-slate-300 hover:text-white hover:border-white/25'
              }`}
              title="Career Profile & Onboarding"
            >
              <User className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="hidden sm:inline max-w-[100px] truncate font-sans">
                {profile ? profile.name : t.nav.onboarding}
              </span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white rounded-full bg-white/[0.04] border border-white/10 hover:border-white/20 transition cursor-pointer shrink-0"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 text-indigo-400" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer Overlay (< lg) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-auto z-50 bg-[#07090E]/98 backdrop-blur-2xl border-b border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.9)] max-h-[85vh] overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="px-4 py-5 space-y-5">
            {/* Core Tools Section */}
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-semibold mb-2">
                Core AI Tools
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {primaryNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer text-left ${
                        isActive
                          ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                          : 'text-slate-300 hover:text-white hover:bg-white/[0.06] bg-white/[0.02]'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Career Acceleration Section */}
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-semibold mb-2">
                Career Acceleration
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                {secondaryNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer text-left ${
                        isActive
                          ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                          : 'text-slate-300 hover:text-white hover:bg-white/[0.06] bg-white/[0.02]'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Evaluation & Quick Presets Section */}
            <div className="pt-3 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Quick Evaluation Demo
                </span>
                <button
                  onClick={() => {
                    setActiveTab('judgeDemo');
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-semibold text-xs flex items-center gap-1.5 transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Launch Judge Tour</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    loadDemoProfile('demo_fullstack');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 px-3 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded-xl text-xs font-mono text-slate-300 text-center transition"
                >
                  Load Priya (SWE)
                </button>
                <button
                  onClick={() => {
                    loadDemoProfile('demo_ai_ml');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 px-3 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded-xl text-xs font-mono text-slate-300 text-center transition"
                >
                  Load Alex (AI/ML)
                </button>
                {onOpenKeyModal && (
                  <button
                    onClick={() => {
                      onOpenKeyModal();
                      setMobileMenuOpen(false);
                    }}
                    className="p-2 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded-xl text-indigo-400 transition"
                    title="API Key Configuration"
                  >
                    <Key className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};


