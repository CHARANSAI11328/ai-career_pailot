import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  Globe,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
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
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setInput(prev => (prev ? prev + ' ' : '') + transcript);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, [language]);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-US';
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Speech recognition start failed:', err);
      }
    }
  };

  const speakText = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);
    setSpeakingMessageId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isSending) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

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

  // Lightweight markdown formatter
  const renderFormattedMessage = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-2 chat-prose">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1" />;

          // Bullet list items
          if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
            const itemText = line.trim().replace(/^[-*]\s+/, '');
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                <span dangerouslySetInnerHTML={{ __html: formatInline(itemText) }} />
              </div>
            );
          }

          // Numbered items
          const numMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
          if (numMatch) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="font-mono text-[10px] text-indigo-400 font-bold shrink-0 mt-0.5">{numMatch[1]}.</span>
                <span dangerouslySetInnerHTML={{ __html: formatInline(numMatch[2]) }} />
              </div>
            );
          }

          return (
            <p key={idx} dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
          );
        })}
      </div>
    );
  };

  const formatInline = (str: string) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="font-mono text-indigo-300 bg-white/10 px-1 py-0.5 rounded text-[11px]">$1</code>');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6 text-left">
      {/* Header Cockpit */}
      <div className="doppelrand-shell">
        <div className="doppelrand-core p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400 shadow-inner shrink-0">
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
          <div className="flex items-center space-x-2 bg-white/[0.04] border border-white/10 px-3 py-1.5 rounded-full text-xs font-mono shrink-0">
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
            const isSpeakingThis = speakingMessageId === m.id;

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
                  className={`max-w-2xl rounded-2xl px-5 py-4 text-xs leading-relaxed transition-all duration-200 ${
                    isUser
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-black/50 border border-white/[0.08] text-slate-100 shadow-inner'
                  }`}
                >
                  {isUser ? (
                    <div className="whitespace-pre-wrap">{m.content}</div>
                  ) : (
                    renderFormattedMessage(m.content)
                  )}

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5 text-[10px] font-mono">
                    {!isUser ? (
                      <button
                        onClick={() => speakText(m.id, m.content)}
                        className={`flex items-center gap-1 transition ${
                          isSpeakingThis ? 'text-indigo-300 font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                        title="Listen aloud"
                      >
                        {isSpeakingThis ? <VolumeX className="w-3 h-3 text-indigo-400" /> : <Volume2 className="w-3 h-3" />}
                        <span>{isSpeakingThis ? 'Stop Audio' : 'Listen Aloud'}</span>
                      </button>
                    ) : <span />}

                    <span className={isUser ? 'text-indigo-200' : 'text-slate-500'}>
                      {m.timestamp}
                    </span>
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
                <span>Counselor is synthesizing strategic guidance...</span>
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
            className="px-3 py-1 bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 rounded-full text-xs font-mono transition active:scale-95 cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Message input bar with Voice Support */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-2"
      >
        <div className="flex-1 relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about salary benchmarks, role transitions, learning roadmaps, or interview tips..."
            className="w-full pl-5 pr-12 py-3.5 bg-black/40 border border-white/10 focus:border-indigo-500/70 rounded-full text-xs text-white placeholder-slate-500 focus:outline-none transition shadow-inner font-sans"
          />

          {/* Voice Microphone Toggle */}
          <button
            type="button"
            onClick={toggleMic}
            className={`absolute right-3.5 p-1.5 rounded-full transition cursor-pointer ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title="Speak query with microphone"
          >
            {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>
        </div>

        <button
          type="submit"
          disabled={isSending || !input.trim()}
          className="btn-nested-spring px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-full text-xs font-semibold flex items-center gap-2 transition shadow-[0_4px_16px_rgba(79,70,229,0.35)] cursor-pointer"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};

