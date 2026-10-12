import React, { useState } from 'react';
import { ApiKeyModal } from './components/ApiKeyModal';
import { DemoBanner } from './components/DemoBanner';
import { Navbar } from './components/Navbar';
import { LanguageProvider } from './context/LanguageContext';
import { ProfileProvider, useProfile } from './context/ProfileContext';
import { AssessmentPage } from './pages/AssessmentPage';
import { CounselorPage } from './pages/CounselorPage';
import { DashboardPage } from './pages/DashboardPage';
import { JobMarketPage } from './pages/JobMarketPage';
import { JudgeDemoPage } from './pages/JudgeDemoPage';
import { LandingPage } from './pages/LandingPage';
import { LearningRoadmapPage } from './pages/LearningRoadmapPage';
import { LinkedInOptimizerPage } from './pages/LinkedInOptimizerPage';
import { MockInterviewPage } from './pages/MockInterviewPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { ResumeAnalyzerPage } from './pages/ResumeAnalyzerPage';

const MainContent: React.FC<{ onOpenKeyModal: () => void }> = ({ onOpenKeyModal }) => {
  const { activeTab, setActiveTab } = useProfile();

  const renderPage = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage />;
      case 'onboarding':
        return <OnboardingPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'resume':
        return <ResumeAnalyzerPage />;
      case 'counselor':
        return <CounselorPage />;
      case 'roadmap':
        return <LearningRoadmapPage />;
      case 'interview':
        return <MockInterviewPage />;
      case 'jobs':
        return <JobMarketPage />;
      case 'branding':
        return <LinkedInOptimizerPage />;
      case 'assessment':
        return <AssessmentPage />;
      case 'judgeDemo':
        return <JudgeDemoPage onOpenKeyModal={onOpenKeyModal} />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#060709] text-slate-100 selection:bg-indigo-600 selection:text-white">
      {/* Unified Screen-Fitted Sticky Navigation Header */}
      <div className="sticky top-0 z-50 w-full bg-[#07090E]/95 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
        <DemoBanner onOpenKeyModal={onOpenKeyModal} />
        <Navbar onOpenKeyModal={onOpenKeyModal} />
      </div>
      <main className="flex-1">
        {renderPage()}
      </main>

      {/* Titanium Hardware Footer */}
      <footer className="border-t border-white/[0.08] bg-[#080A0F] py-10 px-4 sm:px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <span className="font-extrabold text-slate-200 font-display">CareerPilot AI</span>
            <span className="text-white/20">•</span>
            <span className="text-slate-400 font-mono text-[11px]">AUTONOMOUS CAREER RADAR // v2.5</span>
          </div>

          <div className="flex items-center space-x-5 text-xs font-mono">
            <button
              onClick={() => setActiveTab('judgeDemo')}
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition"
            >
              JUDGE TOUR
            </button>
            <button
              onClick={onOpenKeyModal}
              className="text-slate-400 hover:text-slate-200 transition"
            >
              KEY CONFIG
            </button>
            <span className="text-slate-600 hidden md:inline">Google DeepMind Hackathon Edition</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);

  return (
    <LanguageProvider>
      <ProfileProvider>
        <MainContent onOpenKeyModal={() => setIsKeyModalOpen(true)} />
        <ApiKeyModal isOpen={isKeyModalOpen} onClose={() => setIsKeyModalOpen(false)} />
      </ProfileProvider>
    </LanguageProvider>
  );
}
