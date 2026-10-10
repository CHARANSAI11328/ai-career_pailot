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
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <DemoBanner onOpenKeyModal={onOpenKeyModal} />
      <Navbar />
      <main className="flex-1">
        {renderPage()}
      </main>

      {/* Professional Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-400">CareerPilot AI</span>
            <span>•</span>
            <span>Next-Gen Career Counselor, Resume Analyzer & Career Intelligence</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveTab('judgeDemo')}
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition"
            >
              Judge Tour
            </button>
            <button
              onClick={onOpenKeyModal}
              className="text-slate-400 hover:text-slate-300 transition"
            >
              AI Settings
            </button>
            <span className="text-slate-600">Built for Google DeepMind Hackathon</span>
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
