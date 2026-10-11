import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Award,
  ChevronRight,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { api } from '../services/api';
import { StoredInterviewSession } from '../types';

export const MockInterviewPage: React.FC = () => {
  const { profile, userId } = useProfile();

  const [role, setRole] = useState(profile?.targetRole || 'Full Stack Software Engineer');
  const [level, setLevel] = useState('Junior');
  const [interviewType, setInterviewType] = useState<'technical' | 'behavioral' | 'mixed'>('technical');

  const [session, setSession] = useState<StoredInterviewSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  // Web Speech API Voice States
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  // Initialize Speech Recognition
  const recognitionRef = React.useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setUserAnswer(prev => prev + ' ' + transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Speech-to-text recognition is not supported in this browser. Please type your response.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Speech recognition start error:', err);
      }
    }
  };

  const speakQuestion = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStartInterview = async () => {
    setIsStarting(true);
    try {
      const res = await api.startInterview(role, level, interviewType, userId);
      setSession(res.session);
      setCurrentQuestionIndex(0);
      setUserAnswer('');
    } catch (err: any) {
      alert(err.message || 'Failed to start interview');
    } finally {
      setIsStarting(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!session || !userAnswer.trim()) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setIsSubmitting(true);
    try {
      const currentQ = session.questions[currentQuestionIndex];
      const res = await api.submitInterviewAnswer(session.id, currentQ.id, userAnswer.trim());

      // Update local question evaluation
      const updatedQuestions = [...session.questions];
      updatedQuestions[currentQuestionIndex] = {
        ...currentQ,
        userAnswer: userAnswer.trim(),
        evaluation: res.evaluation
      };

      setSession({ ...session, questions: updatedQuestions });
    } catch (err: any) {
      alert(err.message || 'Failed to submit answer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = async () => {
    if (!session) return;
    if (currentQuestionIndex + 1 < session.questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setUserAnswer('');
      if (isSpeaking && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
    } else {
      // Finalize session
      const res = await api.evaluateInterview(session.id);
      setSession(res.session);
    }
  };

  const currentQuestion = session?.questions[currentQuestionIndex];
  const isFinished = session?.completedAt !== undefined;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 text-left">
      {/* Header */}
      <div className="doppelrand-shell">
        <div className="doppelrand-core p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/25 flex items-center justify-center shadow-inner">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-amber-300 text-[10px] font-mono tracking-wider uppercase mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>REAL-TIME STAR SIMULATOR</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white font-display">AI Mock Interview Simulator</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Practice role-specific technical and behavioral STAR questions with real-time speech and rubric evaluation.
              </p>
            </div>
          </div>

          {session && (
            <button
              onClick={() => setSession(null)}
              className="px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/10 rounded-full text-xs font-mono flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>New Session</span>
            </button>
          )}
        </div>
      </div>

      {/* Configuration & Start Setup */}
      {!session && (
        <div className="doppelrand-shell">
          <div className="doppelrand-core p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
              <div>
                <label className="block text-slate-300 font-mono text-[11px] uppercase tracking-wider mb-2">TARGET ROLE</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500/60 cursor-pointer font-sans"
                >
                  <option value="Full Stack Software Engineer">Full Stack Software Engineer</option>
                  <option value="AI / Machine Learning Engineer">AI / Machine Learning Engineer</option>
                  <option value="Cloud & DevOps Platform Engineer">Cloud & DevOps Platform Engineer</option>
                  <option value="Data Analyst & Analytics Engineer">Data Analyst & Analytics Engineer</option>
                  <option value="Technical Product Manager">Technical Product Manager</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-mono text-[11px] uppercase tracking-wider mb-2">SENIORITY TIER</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-3.5 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500/60 cursor-pointer font-sans"
                >
                  <option value="Junior">Junior / Entry Level (0-2 yrs)</option>
                  <option value="Mid">Mid-Level (2-5 yrs)</option>
                  <option value="Senior">Senior Lead (5+ yrs)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-mono text-[11px] uppercase tracking-wider mb-2">INTERVIEW FORMAT</label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value as any)}
                  className="w-full px-3.5 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500/60 cursor-pointer font-sans"
                >
                  <option value="technical">Technical & System Architecture</option>
                  <option value="behavioral">Behavioral (STAR Framework)</option>
                  <option value="mixed">Mixed (Technical + Behavioral)</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-xs text-slate-400 space-y-2 font-mono">
              <div className="font-semibold text-slate-200 uppercase tracking-wide">EVALUATION PROTOCOL:</div>
              <ul className="list-disc pl-5 space-y-1 text-slate-400">
                <li>Receives 3 tailored questions sequenced one at a time.</li>
                <li>Voice answering via Web Speech API or typing directly into the terminal.</li>
                <li>Answers graded on Relevance, Technical Correctness, and STAR Structure.</li>
                <li>Instant constructive coaching advice and exemplar model answers provided.</li>
              </ul>
            </div>

            <button
              onClick={handleStartInterview}
              disabled={isStarting}
              className="btn-nested-spring group w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition shadow-[0_8px_25px_rgba(79,70,229,0.35)]"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isStarting ? 'Preparing Technical Questions...' : 'Start Mock Interview Session'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* Active Question Simulator View */}
      {session && !isFinished && currentQuestion && (
        <div className="space-y-6">
          {/* Progress Tracker */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
            <span>QUESTION 0{currentQuestionIndex + 1} OF 0{session.questions.length}</span>
            <span className="font-semibold text-indigo-400 uppercase tracking-wider">{currentQuestion.category}</span>
          </div>

          {/* Question Box */}
          <div className="doppelrand-shell">
            <div className="doppelrand-core p-6 sm:p-8 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide">
                  INTERVIEWER PROMPT
                </span>
                <h2 className="text-lg font-bold text-white leading-relaxed">
                  {currentQuestion.questionText}
                </h2>
              </div>

              {/* TTS Listen Button */}
              <button
                onClick={() => speakQuestion(currentQuestion.questionText)}
                className={`p-2.5 rounded-xl border transition ${
                  isSpeaking
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
                title="Listen to interviewer speak question aloud"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Answer Input Area (Only if not yet evaluated) */}
            {!currentQuestion.evaluation && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Your Response:</span>
                  <div className="flex items-center gap-2">
                    {/* Voice Mic Button */}
                    <button
                      type="button"
                      onClick={toggleMic}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                        isListening
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      }`}
                    >
                      {isListening ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{isListening ? 'Listening (Speak now)...' : 'Use Voice Input'}</span>
                    </button>
                  </div>
                </div>

                <textarea
                  rows={6}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Speak through your microphone or type your structured answer here..."
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed font-mono"
                />

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Word count: {userAnswer.trim().split(/\s+/).filter(Boolean).length}</span>
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={isSubmitting || !userAnswer.trim()}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-lg shadow-indigo-600/30"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isSubmitting ? 'Evaluating Response...' : 'Submit Answer for Rubric Evaluation'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Immediate Evaluation Feedback Card */}
            {currentQuestion.evaluation && (
              <div className="mt-6 p-6 bg-slate-950 border border-indigo-500/30 rounded-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-400">
                      RUBRIC EVALUATION RESULT
                    </span>
                    <h3 className="text-base font-bold text-white">Answer Score Card</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-indigo-400">
                      {currentQuestion.evaluation.score}/100
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                    <div className="text-[10px] text-slate-400">Relevance</div>
                    <div className="text-sm font-bold text-white">{currentQuestion.evaluation.relevanceScore}%</div>
                  </div>
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                    <div className="text-[10px] text-slate-400">Technical Domain</div>
                    <div className="text-sm font-bold text-white">{currentQuestion.evaluation.technicalScore}%</div>
                  </div>
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                    <div className="text-[10px] text-slate-400">Clarity & STAR</div>
                    <div className="text-sm font-bold text-white">{currentQuestion.evaluation.clarityScore}%</div>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="text-slate-300 font-semibold">Coach Feedback:</div>
                  <p className="text-slate-400 leading-relaxed">{currentQuestion.evaluation.feedback}</p>
                </div>

                {/* Exemplar model answer */}
                <div className="p-4 bg-indigo-950/30 border border-indigo-500/20 rounded-xl space-y-1.5 text-xs">
                  <div className="text-[11px] font-bold text-indigo-300">Exemplar Model Response:</div>
                  <p className="text-slate-300 italic font-mono text-[11px] leading-relaxed">
                    "{currentQuestion.evaluation.exemplarAnswer}"
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleNextQuestion}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-lg shadow-indigo-600/30"
                  >
                    <span>{currentQuestionIndex + 1 < session.questions.length ? 'Next Question' : 'Complete Interview & View Report'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      )}

      {/* Final Session Completed Report Card */}
      {session && isFinished && (
        <div className="doppelrand-shell">
          <div className="doppelrand-core p-8 sm:p-12 space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/25 shadow-inner">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">Interview Simulation Complete</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto font-mono">
                ROLE: <span className="text-white font-semibold">{session.role}</span> ({session.level} Tier)
              </p>
            </div>

            <div className="p-6 bg-black/40 border border-white/10 rounded-2xl max-w-sm mx-auto">
              <div className="text-4xl font-extrabold text-indigo-400 font-mono tabular-nums">
                {session.overallScore}/100
              </div>
              <div className="text-xs text-slate-400 font-mono mt-1 uppercase tracking-wider">READINESS INDEX</div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              {session.summaryFeedback}
            </p>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setSession(null)}
                className="btn-nested-spring px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-xs font-semibold transition shadow-[0_8px_25px_rgba(79,70,229,0.35)]"
              >
                Start Another Practice Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
