import React, { useState } from 'react';
import {
  FileText,
  Upload,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Download,
  Trash2,
  Briefcase,
  ChevronRight,
  Edit3,
  Check,
  X,
  RefreshCw,
  Eye,
  FileCode,
  ShieldAlert
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { api } from '../services/api';
import { JobDescriptionComparisonResult } from '../types';

export const ResumeAnalyzerPage: React.FC = () => {
  const { resume, setResume, userId } = useProfile();

  const [activeSubTab, setActiveSubTab] = useState<'audit' | 'jobMatch' | 'editor'>('audit');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [pasteMode, setPasteMode] = useState(false);
  const [pastedText, setPastedText] = useState('');

  // Job comparison state
  const [jobDescriptionInput, setJobDescriptionInput] = useState('');
  const [isComparing, setIsComparing] = useState(false);
  const [jobComparisonResult, setJobComparisonResult] = useState<JobDescriptionComparisonResult | null>(null);

  // Bullet rewriter state
  const [selectedBullet, setSelectedBullet] = useState('');
  const [isRewriting, setIsRewriting] = useState(false);
  const [rewriteSuggestion, setRewriteSuggestion] = useState<{
    original: string;
    suggested: string;
    impactExplanation: string;
  } | null>(null);

  // Editable text state for export
  const [editableResumeText, setEditableResumeText] = useState(resume?.rawText || '');

  React.useEffect(() => {
    if (resume) {
      setEditableResumeText(resume.rawText);
    }
  }, [resume]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');
    try {
      const res = await api.uploadResume(file, userId);
      setResume(res.resume);
      setEditableResumeText(res.resume.rawText);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload and parse resume.');
    } finally {
      setIsUploading(false);
    }
  };

  const handlePasteSubmit = async () => {
    if (!pastedText.trim() || pastedText.length < 50) {
      setUploadError('Please paste at least 50 characters of resume content.');
      return;
    }

    setIsUploading(true);
    setUploadError('');
    try {
      const res = await api.analyzeResumeText(pastedText, userId);
      setResume(res.resume);
      setEditableResumeText(res.resume.rawText);
      setPasteMode(false);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to analyze text.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCompareJob = async () => {
    if (!jobDescriptionInput.trim() || jobDescriptionInput.length < 30) {
      alert('Please paste a job description of at least 30 characters.');
      return;
    }

    setIsComparing(true);
    try {
      const res = await api.compareJobDescription(resume?.id, resume?.rawText || editableResumeText, jobDescriptionInput);
      setJobComparisonResult(res.comparison);
    } catch (err: any) {
      alert(err.message || 'Failed to compare job description.');
    } finally {
      setIsComparing(false);
    }
  };

  const handleRewriteBullet = async () => {
    if (!selectedBullet.trim()) return;
    setIsRewriting(true);
    try {
      const res = await api.suggestBulletEdit(selectedBullet);
      setRewriteSuggestion(res);
    } catch (err: any) {
      alert(err.message || 'Failed to generate bullet rewrite');
    } finally {
      setIsRewriting(false);
    }
  };

  const applyRewriteToResume = () => {
    if (!rewriteSuggestion) return;
    const updated = editableResumeText.replace(rewriteSuggestion.original, rewriteSuggestion.suggested);
    setEditableResumeText(updated);
    alert('Applied revision to resume text!');
    setRewriteSuggestion(null);
    setSelectedBullet('');
  };

  const handleDeleteResume = async () => {
    if (!resume) return;
    if (confirm('Are you sure you want to permanently delete your resume and extracted data?')) {
      await api.deleteResume(resume.id);
      setResume(null);
      setEditableResumeText('');
      setJobComparisonResult(null);
    }
  };

  const handleExportText = () => {
    const blob = new Blob([editableResumeText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Tailored_Resume_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintPdf = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Resume - CareerPilot AI</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.5; color: #111; max-width: 800px; margin: 40px auto; padding: 0 20px; white-space: pre-wrap; }
              @media print { body { margin: 20px; } }
            </style>
          </head>
          <body>${editableResumeText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-indigo-400" />
            <span>Resume Analyzer & ATS Audit</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Deterministic heuristic audit, verifiable skill extraction, job description gap analysis, and Google XYZ bullet editor.
          </p>
        </div>

        {resume && (
          <button
            onClick={handleDeleteResume}
            className="px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            title="Permanently delete all resume records for privacy"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Resume Data</span>
          </button>
        )}
      </div>

      {/* Upload Zone (if no resume or user wants to re-upload) */}
      {!resume && (
        <div className="p-8 sm:p-12 bg-slate-900/90 border-2 border-dashed border-slate-700 hover:border-indigo-500/60 rounded-3xl text-center space-y-4 transition">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/20">
            <Upload className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">Upload Your Resume to Begin</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              Supports <span className="text-indigo-300 font-semibold">PDF, DOCX, and TXT</span> files up to 5MB. Files are analyzed securely in-memory and never permanently stored.
            </p>
          </div>

          {uploadError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 max-w-md mx-auto">
              {uploadError}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <label className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-lg shadow-indigo-600/30 flex items-center gap-2">
              <Upload className="w-4 h-4" />
              <span>{isUploading ? 'Parsing Document...' : 'Choose File (PDF / Word / TXT)'}</span>
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>

            <button
              onClick={() => setPasteMode(!pasteMode)}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition"
            >
              {pasteMode ? 'Cancel Paste' : 'Or Paste Text Directly'}
            </button>
          </div>

          {/* Paste Raw Text Area */}
          {pasteMode && (
            <div className="max-w-2xl mx-auto pt-4 space-y-3 text-left">
              <textarea
                rows={8}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste your plain text resume content here..."
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
              />
              <button
                onClick={handlePasteSubmit}
                disabled={isUploading || pastedText.length < 50}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/30"
              >
                {isUploading ? 'Analyzing Text...' : 'Analyze Pasted Resume Text'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main Analysis Workspace */}
      {resume && (
        <div className="space-y-6">
          {/* Sub-Navigation Tabs */}
          <div className="flex border-b border-slate-800 space-x-4">
            <button
              onClick={() => setActiveSubTab('audit')}
              className={`pb-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition ${
                activeSubTab === 'audit'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Full ATS Audit & Rubric ({resume.heuristicScore.overall}/100)</span>
            </button>

            <button
              onClick={() => setActiveSubTab('jobMatch')}
              className={`pb-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition ${
                activeSubTab === 'jobMatch'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Target Job Comparison & Gap Detector</span>
            </button>

            <button
              onClick={() => setActiveSubTab('editor')}
              className={`pb-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition ${
                activeSubTab === 'editor'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>Google XYZ Bullet Rewriter & Export</span>
            </button>
          </div>

          {/* TAB 1: ATS AUDIT & SCORING RUBRIC */}
          {activeSubTab === 'audit' && (
            <div className="space-y-6">
              {/* Overall Score Banner */}
              <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                <div className="flex items-center space-x-6">
                  <div className="relative w-24 h-24 rounded-full flex items-center justify-center bg-slate-950 border-4 border-indigo-500/40 shadow-inner">
                    <span className="text-3xl font-black text-white">
                      {resume.heuristicScore.overall}
                    </span>
                    <span className="absolute bottom-2 text-[10px] text-slate-400">/ 100</span>
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-1">
                      HEURISTIC ATS RUBRIC ASSESSMENT
                    </div>
                    <h2 className="text-xl font-bold text-white">
                      {resume.heuristicScore.overall >= 80 ? 'Strong Interview Readiness' : resume.heuristicScore.overall >= 60 ? 'Moderate Foundation with Actionable Gaps' : 'Needs Substantive Optimization'}
                    </h2>
                    <p className="text-xs text-slate-400 max-w-lg mt-0.5">
                      This score reflects measurable attributes: section completeness, quantifiable metrics density, active verb strength, and ATS layout readability.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveSubTab('editor')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Rewrite Bullets</span>
                  </button>
                  <label className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition">
                    <span>Re-upload File</span>
                    <input type="file" accept=".pdf,.docx,.txt" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* 6 Rubric Score Bars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-semibold">Section Completeness (20%)</span>
                    <span className="text-indigo-400 font-bold">{resume.heuristicScore.sectionCompleteness}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${resume.heuristicScore.sectionCompleteness}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">Summary, Experience, Education, Skills, Projects.</p>
                </div>

                <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-semibold">Quantifiable Impact (20%)</span>
                    <span className="text-purple-400 font-bold">{resume.heuristicScore.quantifiableImpact}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${resume.heuristicScore.quantifiableImpact}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">Presence of %, multipliers ($X, 3x), user counts.</p>
                </div>

                <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-semibold">Action Verbs Strength (15%)</span>
                    <span className="text-blue-400 font-bold">{resume.heuristicScore.actionVerbs}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${resume.heuristicScore.actionVerbs}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">Strong verbs vs weak passive phrases.</p>
                </div>

                <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-semibold">Readability & Length (15%)</span>
                    <span className="text-emerald-400 font-bold">{resume.heuristicScore.readability}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${resume.heuristicScore.readability}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">Word count density and bullet formatting.</p>
                </div>

                <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-semibold">Skill Density (15%)</span>
                    <span className="text-amber-400 font-bold">{resume.heuristicScore.skillDensity}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${resume.heuristicScore.skillDensity}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">{resume.extractedSkills.length} verified technologies mapped.</p>
                </div>

                <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-semibold">ATS Formatting Safety (15%)</span>
                    <span className="text-teal-400 font-bold">{resume.heuristicScore.atsFormatting}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${resume.heuristicScore.atsFormatting}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">Contact info presence, single-column parsing.</p>
                </div>
              </div>

              {/* Strengths & Critical Issues Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-3">
                  <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Identified Resume Strengths</span>
                  </h3>
                  <div className="space-y-2">
                    {resume.feedback.strengths.map((str, idx) => (
                      <div key={idx} className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-xs text-slate-300 flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{str}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Critical Issues & Actionable Fixes */}
                <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-3">
                  <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Actionable Improvements</span>
                  </h3>
                  <div className="space-y-2">
                    {resume.feedback.criticalIssues.map((iss, idx) => (
                      <div key={idx} className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl text-xs text-slate-300 flex items-start gap-2">
                        <ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{iss}</span>
                      </div>
                    ))}
                    {resume.feedback.improvements.map((imp, idx) => (
                      <div key={`imp_${idx}`} className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-slate-300 space-y-1">
                        <div className="font-semibold text-indigo-300">Section: {imp.section.toUpperCase()}</div>
                        <div>Fix: {imp.suggestedFix}</div>
                        <div className="text-[11px] text-slate-400 italic">Reason: {imp.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Extracted Skills Tag Cloud */}
              <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-indigo-400" />
                  <span>Verified Skills Extracted from Document ({resume.extractedSkills.length})</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {resume.extractedSkills.map((sk) => (
                    <span
                      key={sk}
                      className="px-3 py-1 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: JOB DESCRIPTION COMPARISON */}
          {activeSubTab === 'jobMatch' && (
            <div className="space-y-6">
              <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-4">
                <div>
                  <h2 className="text-base font-bold text-white">Compare Resume with Target Job Description</h2>
                  <p className="text-xs text-slate-400">
                    Paste any job post to detect exact missing keywords, required skill alignment, and tailoring suggestions.
                  </p>
                </div>

                <textarea
                  rows={6}
                  value={jobDescriptionInput}
                  onChange={(e) => setJobDescriptionInput(e.target.value)}
                  placeholder="Paste target job description (e.g. Nexus Cloud Technologies - Junior Full Stack Engineer)..."
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />

                <button
                  onClick={handleCompareJob}
                  disabled={isComparing || jobDescriptionInput.length < 30}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-lg shadow-indigo-600/30"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isComparing ? 'Running Match Analysis...' : 'Compare Against My Resume'}</span>
                </button>
              </div>

              {jobComparisonResult && (
                <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-6 shadow-xl">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div>
                      <h3 className="text-lg font-bold text-white">{jobComparisonResult.jobTitle}</h3>
                      <p className="text-xs text-slate-400">Target Role Match Breakdown</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black text-indigo-400">{jobComparisonResult.matchPercentage}%</div>
                      <span className="text-[10px] text-slate-400 font-medium">Job Alignment Score</span>
                    </div>
                  </div>

                  {/* Skills lists */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Matched */}
                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl space-y-2">
                      <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Matched Required Skills ({jobComparisonResult.matchedSkills.length})</span>
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {jobComparisonResult.matchedSkills.map(s => (
                          <span key={s} className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-medium">
                            ✓ {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Missing */}
                    <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl space-y-2">
                      <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Missing Priority Skills ({jobComparisonResult.missingCriticalSkills.length})</span>
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {jobComparisonResult.missingCriticalSkills.map(s => (
                          <span key={s} className="px-2.5 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-medium">
                            + {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Tailoring Advice */}
                  <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-2xl space-y-2">
                    <h4 className="text-xs font-bold text-indigo-300">Tailoring & Preparation Advice:</h4>
                    <div className="space-y-1">
                      {jobComparisonResult.tailoringAdvice.map((adv, idx) => (
                        <div key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                          <span className="text-indigo-400 font-bold">•</span>
                          <span>{adv}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: GOOGLE XYZ BULLET REWRITER & EXPORT */}
          {activeSubTab === 'editor' && (
            <div className="space-y-6">
              {/* Bullet point enhancer */}
              <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-4">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>Google XYZ Bullet Point Enhancer</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Rewrite passive duties into authoritative results: <span className="text-indigo-300 font-semibold">"Accomplished [X] as measured by [Y], by doing [Z]"</span>.
                  </p>
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    value={selectedBullet}
                    onChange={(e) => setSelectedBullet(e.target.value)}
                    placeholder="e.g. Developed responsive client dashboard pages using React and Tailwind CSS."
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={handleRewriteBullet}
                      disabled={isRewriting || !selectedBullet.trim()}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-indigo-600/30"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isRewriting ? 'Generating Revision...' : 'Generate High-Impact Rewrite'}</span>
                    </button>
                  </div>
                </div>

                {/* Rewrite comparison card */}
                {rewriteSuggestion && (
                  <div className="mt-4 p-5 bg-slate-950 border border-indigo-500/30 rounded-2xl space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase">Original</span>
                        <p className="text-slate-300 font-mono text-[11px]">{rewriteSuggestion.original}</p>
                      </div>

                      <div className="p-3 bg-indigo-950/40 border border-indigo-500/40 rounded-xl space-y-1">
                        <span className="text-[11px] font-bold text-indigo-400 uppercase">Suggested Google XYZ Rewrite</span>
                        <p className="text-white font-mono text-[11px] font-semibold">{rewriteSuggestion.suggested}</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 italic">
                      Why it works: {rewriteSuggestion.impactExplanation}
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={applyRewriteToResume}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept & Apply to Resume Text</span>
                      </button>

                      <button
                        onClick={() => setRewriteSuggestion(null)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Full Resume Text Editor & Export */}
              <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-base font-bold text-white">Interactive Resume Document Editor</h2>
                    <p className="text-xs text-slate-400">Edit, review revisions, and export clean formatted documents.</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleExportText}
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <Download className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Export TXT</span>
                    </button>

                    <button
                      onClick={handlePrintPdf}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Print / Export PDF</span>
                    </button>
                  </div>
                </div>

                <textarea
                  rows={14}
                  value={editableResumeText}
                  onChange={(e) => setEditableResumeText(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
