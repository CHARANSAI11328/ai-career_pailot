export type SupportedLanguage = 'en' | 'te' | 'hi';

export interface Translations {
  appName: string;
  tagline: string;
  nav: {
    dashboard: string;
    counselor: string;
    resumeAnalyzer: string;
    roadmap: string;
    mockInterview: string;
    jobs: string;
    branding: string;
    assessment: string;
    judgeDemo: string;
    onboarding: string;
  };
  common: {
    save: string;
    cancel: string;
    edit: string;
    delete: string;
    loading: string;
    liveAi: string;
    heuristicMode: string;
    demoNotice: string;
    matchScore: string;
    viewDetails: string;
    getStarted: string;
  };
}

export const TRANSLATIONS: Record<SupportedLanguage, Translations> = {
  en: {
    appName: 'CareerPilot AI',
    tagline: 'AI-Based Career Counselor, Resume Analyzer & Intelligence Platform',
    nav: {
      dashboard: 'Dashboard',
      counselor: 'AI Counselor',
      resumeAnalyzer: 'Resume Analyzer',
      roadmap: 'Learning Roadmap',
      mockInterview: 'Mock Interview',
      jobs: 'Job Market',
      branding: 'LinkedIn Branding',
      assessment: 'Interest Assessment',
      judgeDemo: 'Judge Demo Tour',
      onboarding: 'Career Profile'
    },
    common: {
      save: 'Save Changes',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      loading: 'Analyzing...',
      liveAi: 'Live Gemini AI',
      heuristicMode: 'Heuristic Engine',
      demoNotice: 'Demo Mode Active',
      matchScore: 'Role Match Score',
      viewDetails: 'View Details',
      getStarted: 'Get Started Free'
    }
  },
  te: {
    appName: 'కెరీర్‌పైలట్ AI (CareerPilot AI)',
    tagline: 'AI ఆధారిత కెరీర్ కౌన్సెలర్, రెజ్యూమ్ విశ్లేషణ & ఇంటెలిజెన్స్ ప్లాట్‌ఫామ్',
    nav: {
      dashboard: 'డ్యాష్‌బోర్డ్',
      counselor: 'AI కౌన్సెలర్',
      resumeAnalyzer: 'రెజ్యూమ్ ఎనలైజర్',
      roadmap: 'లెర్నింగ్ రోడ్‌మ్యాప్',
      mockInterview: 'మాక్ ఇంటర్వ్యూ',
      jobs: 'ఉద్యోగ మార్కెట్',
      branding: 'లింక్డ్‌ఇన్ బ్రాండింగ్',
      assessment: 'ఆసక్తుల అంచనా',
      judgeDemo: 'న్యాయనిర్ణేత డెమో టూర్',
      onboarding: 'కెరీర్ ప్రొఫైల్'
    },
    common: {
      save: 'భద్రపరచు',
      cancel: 'రద్దు చేయి',
      edit: 'సవరించు',
      delete: 'తొలగించు',
      loading: 'విశ్లేషిస్తోంది...',
      liveAi: 'లైవ్ జెమినీ AI',
      heuristicMode: 'హ్యూరిస్టిక్ ఇంజిన్',
      demoNotice: 'డెమో మోడ్ యాక్టివ్',
      matchScore: 'ఉద్యోగ సరిపోలిక స్కోరు',
      viewDetails: 'వివరాలు చూడండి',
      getStarted: 'ప్రారంభించండి'
    }
  },
  hi: {
    appName: 'करियरपायलट AI (CareerPilot AI)',
    tagline: 'AI-आधारित करियर काउंसलर, रेज़्यूमे विश्लेषक और करियर इंटेलिजेंस प्लेटफॉर्म',
    nav: {
      dashboard: 'डैशबोर्ड',
      counselor: 'AI काउंसलर',
      resumeAnalyzer: 'रेज़्यूमे विश्लेषक',
      roadmap: 'लर्निंग रोडमैप',
      mockInterview: 'मॉक इंटरव्यू',
      jobs: 'जॉब मार्केट',
      branding: 'लिंक्डइन ब्रांडिंग',
      assessment: 'रुचि मूल्यांकन',
      judgeDemo: 'जज डेमो टूर',
      onboarding: 'करियर प्रोफ़ाइल'
    },
    common: {
      save: 'सुरक्षित करें',
      cancel: 'रद्द करें',
      edit: 'संपादित करें',
      delete: 'हटाएं',
      loading: 'विश्लेषण जारी है...',
      liveAi: 'लाइव जेमिनी AI',
      heuristicMode: 'ह्यूरिस्टिक इंजन',
      demoNotice: 'डेमो मोड सक्रिय',
      matchScore: 'मैच स्कोर',
      viewDetails: 'विवरण देखें',
      getStarted: 'शुरू करें'
    }
  }
};
