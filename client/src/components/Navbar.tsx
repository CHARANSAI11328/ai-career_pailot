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
  X
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
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => setActiveTab('landing')}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-white">CareerPilot</span>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">AI</span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block tracking-wide">CAREER INTELLIGENCE</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right utility: Language & Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Language dropdown */}
            <div className="relative flex items-center bg-slate-800/80 border border-slate-700 rounded-xl px-2 py-1">
              <Globe className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer pr-1"
              >
                <option value="en" className="bg-slate-900 text-white">EN</option>
                <option value="te" className="bg-slate-900 text-white">తెలుగు</option>
                <option value="hi" className="bg-slate-900 text-white">हिन्दी</option>
              </select>
            </div>

            {/* Profile Avatar / Onboarding Shortcut */}
            <button
              onClick={() => setActiveTab('onboarding')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                activeTab === 'onboarding'
                  ? 'border-indigo-500 bg-indigo-500/10 text-white'
                  : 'border-slate-700 bg-slate-800/80 text-slate-300 hover:border-slate-600'
              }`}
            >
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline max-w-[100px] truncate">
                {profile ? profile.name : t.nav.onboarding}
              </span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-800 grid grid-cols-2 gap-1.5">
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
                  className={`flex items-center space-x-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
