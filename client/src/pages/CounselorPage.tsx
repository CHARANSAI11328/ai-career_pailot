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
  Compass
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
    'What are current 2025-2026 salary benchmarks for my role?',
    'Suggest an industry-grade portfolio capstone project',
    'Compare Full Stack Developer vs Cloud DevOps Engineer'
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-lg">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white rounded-2xl shadow-lg shadow-purple-600/30">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Interactive AI Career Counselor</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {aiStatus?.isLive ? 'Gemini 2.5 Flash' : 'Heuristic Engine'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Personalized career guidance grounded in your active skills, education, and constraints.
            </p>
          </div>
        </div>

        {/* Language selector */}
        <div className="flex items-center space-x-2 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-xl text-xs">
          <Globe className="w-4 h-4 text-slate-400" />
          <span className="text-slate-400">Response Language:</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
            className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
          >
            <option value="en" className="bg-slate-900">English</option>
            <option value="te" className="bg-slate-900">తెలుగు (Telugu)</option>
            <option value="hi" className="bg-slate-900">हिन्दी (Hindi)</option>
          </select>
        </div>
      </div>

      {/* Chat messages viewport */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 h-[520px] overflow-y-auto space-y-4 shadow-xl">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white text-xs font-bold ${
                  isUser ? 'bg-indigo-600' : 'bg-purple-600'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-2xl rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800/90 border border-slate-700 text-slate-100'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>
                <div
                  className={`text-[10px] mt-1.5 text-right ${
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
            <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 bg-slate-800/90 border border-slate-700 rounded-2xl text-xs text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              <span>Counselor is synthesizing guidance...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested prompt chips */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-purple-400" />
          <span>Quick queries:</span>
        </span>
        {quickPrompts.map((q) => (
          <button
            key={q}
            onClick={() => handleSend(q)}
            disabled={isSending}
            className="px-2.5 py-1 bg-slate-800/70 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 rounded-lg text-xs transition"
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
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about roles, roadmaps, interview prep, or career transitions..."
          className="flex-1 px-4 py-3 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none"
        />

        <button
          type="submit"
          disabled={isSending || !input.trim()}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-indigo-600/30"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
