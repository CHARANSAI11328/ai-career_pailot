import React, { useState } from 'react';
import { Key, CheckCircle, AlertTriangle, X, Sparkles } from 'lucide-react';
import { useProfile } from '../context/ProfileContext';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const { aiStatus, setApiKey } = useProfile();
  const [inputKey, setInputKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) return;
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await setApiKey(inputKey.trim());
      setSuccessMsg('API Key successfully saved! Live Gemini AI mode activated.');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update API key');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="doppelrand-shell max-w-md w-full">
        <div className="doppelrand-core p-6 sm:p-7 relative text-left space-y-5">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1 text-slate-400 hover:text-white rounded-full bg-white/[0.04] hover:bg-white/[0.1] transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400 shadow-inner">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">AI Engine Configuration</h3>
              <p className="text-xs text-slate-400 font-mono">Google Gemini API Credentials</p>
            </div>
          </div>

          {/* Current status */}
          <div className="p-3.5 rounded-xl border bg-black/40 border-white/[0.08] space-y-1">
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="text-slate-400 uppercase">ACTIVE ENGINE:</span>
              <span className={aiStatus?.isLive ? 'text-emerald-400 flex items-center gap-1 font-semibold' : 'text-amber-400 flex items-center gap-1 font-semibold'}>
                {aiStatus?.isLive ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                {aiStatus?.provider === 'gemini-live' ? 'Live Gemini 2.5 Flash' : 'Deterministic Heuristic'}
              </span>
            </div>
            <p className="text-xs text-slate-400">{aiStatus?.notes}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                ENTER CUSTOM GEMINI API KEY
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed font-sans">
                Stored strictly in client-side localStorage (<code className="text-slate-300">careerpilot_gemini_key</code>) and never committed to Git.
              </p>
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 font-mono">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-mono">
                {successMsg}
              </div>
            )}

            <div className="flex justify-end space-x-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-mono font-medium text-slate-400 hover:text-white bg-white/[0.04] rounded-full transition"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !inputKey.trim()}
                className="btn-nested-spring px-5 py-2 text-xs font-mono font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 rounded-full flex items-center gap-1.5 transition shadow-[0_4px_16px_rgba(79,70,229,0.35)]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isSubmitting ? 'Verifying...' : 'Save & Activate'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
