import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  Globe,
  Award,
  RefreshCw,
  Compass,
  Zap,
  Cpu
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useProfile } from '../context/ProfileContext';
import { SupportedLanguage } from '../i18n/translations';
import { api } from '../services/api';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const CounselorPage: React.FC = () => {
  const { profile, userId, aiStatus } = useProfile();
  const { language, setLanguage } = useLanguage();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello ${profile?.name || 'there'}! I am your **CareerPilot AI Counselor**.\n\nI can help you evaluate career paths, design portfolio projects, bridge skill gaps, and explore salary trends. What career question or transition can I help you navigate today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const res = await api.chatCounselor(textToSend, history, userId, language);

      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        content: res.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content: `Error contacting AI Counselor: ${err.message || 'Please try again.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const quickPrompts = [
    'How do I transition into AI / Machine Learning?',
    'What are current salary benchmarks for my role in 2025-2026?',
    'Suggest an industry-grade portfolio capstone project',
    'Compare Full Stack Developer vs Cloud DevOps Engineer'
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6 text-left">
      {/* Header Cockpit */}
      <div className="doppelrand-shell">
        <div className="doppelrand-core p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400 shadow-inner">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white font-display">
                  Interactive Career Counselor
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/25 uppercase">
                  {aiStatus?.isLive ? 'Gemini 2.5 Flash' : 'Heuristic Engine'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time strategic career mentoring grounded in your active profile, skills, and industry signals.
              </p>
            </div>
          </div>

          {/* Language selector */}
          <div className="flex items-center space-x-2 bg-white/[0.04] border border-white/10 px-3 py-1.5 rounded-full text-xs font-mono">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">LANGUAGE:</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer pr-1"
            >
              <option value="en" className="bg-[#0D1017]">English</option>
              <option value="te" className="bg-[#0D1017]">తెలుగు (Telugu)</option>
              <option value="hi" className="bg-[#0D1017]">हिन्दी (Hindi)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Chat Messages Viewport (Doppelrand container) */}
      <div className="doppelrand-shell">
        <div className="doppelrand-core p-6 h-[540px] overflow-y-auto space-y-4">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold shadow-sm ${
                    isUser
                      ? 'bg-indigo-600'
                      : 'bg-white/[0.06] border border-white/10 text-indigo-400'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-2xl rounded-2xl px-4 py-3 text-xs leading-relaxed transition-all duration-200 ${
                    isUser
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-black/40 border border-white/[0.08] text-slate-100 shadow-inner'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.content}</div>
                  <div
                    className={`text-[10px] font-mono mt-2 text-right ${
                      isUser ? 'text-indigo-200' : 'text-slate-400'
                    }`}
                  >
                    {m.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isSending && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-indigo-400 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 bg-black/40 border border-white/[0.08] rounded-2xl text-xs text-slate-300 flex items-center gap-2 font-mono">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                <span>Counselor is synthesizing response...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Suggested prompt chips */}
      <div className="flex flex-wrap gap-2 items-center px-1">
        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span>SUGGESTED QUERIES:</span>
        </span>
        {quickPrompts.map((q) => (
          <button
            key={q}
            onClick={() => handleSend(q)}
            disabled={isSending}
            className="px-3 py-1 bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 rounded-full text-xs font-mono transition active:scale-95"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Message input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-2"
      >
        <div className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about salary benchmarks, role transitions, learning roadmaps, or interview tips..."
            className="w-full px-5 py-3.5 bg-black/40 border border-white/10 focus:border-indigo-500/70 rounded-full text-xs text-white placeholder-slate-400 focus:outline-none transition shadow-inner font-sans"
          />
        </div>

        <button
          type="submit"
          disabled={isSending || !input.trim()}
          className="btn-nested-spring px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-full text-xs font-semibold flex items-center gap-2 transition shadow-[0_4px_16px_rgba(79,70,229,0.35)]"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};

