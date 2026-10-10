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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">AI Engine Configuration</h3>
            <p className="text-xs text-slate-400">Google Gemini API Settings</p>
          </div>
        </div>

        {/* Current status */}
        <div className="mb-4 p-3.5 rounded-xl border bg-slate-800/80 border-slate-700/80">
          <div className="flex items-center justify-between text-xs font-semibold mb-1">
            <span className="text-slate-400">Active Engine:</span>
            <span className={aiStatus?.isLive ? 'text-emerald-400 flex items-center gap-1' : 'text-amber-400 flex items-center gap-1'}>
              {aiStatus?.isLive ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              {aiStatus?.provider === 'gemini-live' ? 'Live Gemini 2.5 Flash' : 'Deterministic Heuristic Engine'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">{aiStatus?.notes}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Enter Custom Gemini API Key
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Key is stored only in local storage during this session and never transmitted to third parties.
            </p>
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-400">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-400">
              {successMsg}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 rounded-xl transition"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !inputKey.trim()}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl flex items-center gap-1.5 transition shadow-lg shadow-indigo-600/30"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isSubmitting ? 'Verifying...' : 'Save & Activate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
