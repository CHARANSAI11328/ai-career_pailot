import React, { useState, useEffect } from 'react';
import { User, Check, Sparkles, ArrowRight, Save, Plus, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useProfile } from '../context/ProfileContext';
import { UserProfile } from '../types';

export const OnboardingPage: React.FC = () => {
  const { profile, updateProfile, setActiveTab } = useProfile();
  const { t } = useLanguage();

  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    email: '',
    education: 'Bachelor of Technology (B.Tech)',
    fieldOfStudy: 'Computer Science and Engineering',
    experienceLevel: 'Fresher',
    targetRole: 'Full Stack Software Engineer',
    skills: ['JavaScript', 'React', 'Node.js', 'HTML5', 'CSS3', 'Git', 'SQL'],
    preferredLocation: 'Bangalore / Remote',
    workMode: 'Hybrid',
    weeklyHours: 12,
    expectedSalary: '₹8,00,000 - ₹12,00,000 / $80,000 - $110,000',
    careerGoals: 'Secure an impactful software engineering position working on scalable cloud systems.',
    preferredLanguage: 'en'
  });

  const [skillInput, setSkillInput] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleAddSkill = (skill: string) => {
    if (!skill.trim()) return;
    const current = formData.skills || [];
    if (!current.includes(skill.trim())) {
      setFormData({ ...formData, skills: [...current, skill.trim()] });
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const current = formData.skills || [];
    setFormData({ ...formData, skills: current.filter(s => s !== skillToRemove) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setActiveTab('dashboard');
    }, 1200);
  };

  const popularSkills = [
    'React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'Docker',
    'AWS', 'Git', 'Machine Learning', 'Tailwind CSS', 'FastAPI', 'Next.js'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 text-left">
      {/* Header */}
      <div className="doppelrand-shell">
        <div className="doppelrand-core p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 flex items-center justify-center shadow-inner">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-indigo-300 text-[10px] font-mono tracking-wider uppercase mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                <span>CANDIDATE TELEMETRY INITIALIZER</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white font-display">Career Profile & Preferences</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Personalize your career trajectory, target role matches, and customized roadmap.
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="doppelrand-shell">
        <div className="doppelrand-core p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                FULL NAME
              </label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Priya Sharma"
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 font-sans"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                EMAIL ADDRESS (OPTIONAL)
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="priya@example.com"
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 font-sans"
              />
            </div>

            {/* Education Level */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                HIGHEST QUALIFICATION
              </label>
              <input
                type="text"
                value={formData.education || ''}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                placeholder="B.Tech, M.S. Data Science, B.Sc"
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 font-sans"
              />
            </div>

            {/* Field of Study */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                FIELD OF STUDY
              </label>
              <input
                type="text"
                value={formData.fieldOfStudy || ''}
                onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                placeholder="Computer Science, Electronics, Mathematics"
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 font-sans"
              />
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                EXPERIENCE LEVEL
              </label>
              <select
                value={formData.experienceLevel || 'Fresher'}
                onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value as any })}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500/60 cursor-pointer font-sans"
              >
                <option value="Student">Student (Pre-final / Final Year)</option>
                <option value="Fresher">Fresher / Recent Graduate (0 years)</option>
                <option value="1-3 years">Junior Professional (1 - 3 years)</option>
                <option value="3-5 years">Mid-Level Professional (3 - 5 years)</option>
                <option value="5+ years">Senior Professional (5+ years)</option>
              </select>
            </div>

            {/* Target Role */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                TARGET CAREER ROLE
              </label>
              <select
                value={formData.targetRole || 'Full Stack Software Engineer'}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500/60 cursor-pointer font-sans"
              >
                <option value="Full Stack Software Engineer">Full Stack Software Engineer</option>
                <option value="AI / Machine Learning Engineer">AI / Machine Learning Engineer</option>
                <option value="Cloud & DevOps Platform Engineer">Cloud & DevOps Platform Engineer</option>
                <option value="Data Analyst & Analytics Engineer">Data Analyst & Analytics Engineer</option>
                <option value="Technical Product Manager">Technical Product Manager</option>
              </select>
            </div>

            {/* Work Mode */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                WORK ARRANGEMENT
              </label>
              <select
                value={formData.workMode || 'Hybrid'}
                onChange={(e) => setFormData({ ...formData, workMode: e.target.value as any })}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500/60 cursor-pointer font-sans"
              >
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote Only</option>
                <option value="Onsite">Onsite</option>
                <option value="Any">Flexible / Any</option>
              </select>
            </div>

            {/* Weekly Hours */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                WEEKLY AVAILABILITY: <span className="text-indigo-400 font-bold tabular-nums">{formData.weeklyHours}h/week</span>
              </label>
              <input
                type="range"
                min={4}
                max={40}
                step={2}
                value={formData.weeklyHours || 12}
                onChange={(e) => setFormData({ ...formData, weeklyHours: Number(e.target.value) })}
                className="w-full accent-indigo-500 mt-2"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-1">
                <span>Light (4h)</span>
                <span>Moderate (12h)</span>
                <span>Intensive (30h+)</span>
              </div>
            </div>
          </div>

          {/* Skills Tag Input */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
              VERIFIED SKILLS & TECHNOLOGIES
            </label>
            <div className="flex flex-wrap gap-2 p-3.5 bg-black/40 border border-white/10 rounded-2xl min-h-[56px] mb-2.5">
              {formData.skills && formData.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/[0.04] text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-mono"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-rose-400 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill(skillInput);
                  }
                }}
                placeholder="Type a skill (e.g. Docker, TypeScript) and press Enter"
                className="flex-1 px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 font-sans"
              />
              <button
                type="button"
                onClick={() => handleAddSkill(skillInput)}
                className="px-5 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 text-xs font-mono font-semibold rounded-xl flex items-center gap-1 border border-white/10 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {/* Quick suggestions */}
            <div className="flex flex-wrap gap-1.5 mt-2.5 items-center">
              <span className="text-[11px] font-mono text-slate-500 mr-1">Quick add:</span>
              {popularSkills.filter(s => !(formData.skills || []).includes(s)).slice(0, 7).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleAddSkill(s)}
                  className="px-2 py-0.5 bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-slate-200 text-[10px] font-mono rounded-full border border-white/5 transition"
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>

          {/* Career Goals */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
              PRIMARY CAREER GOAL & TARGET OUTCOME
            </label>
            <textarea
              rows={3}
              value={formData.careerGoals || ''}
              onChange={(e) => setFormData({ ...formData, careerGoals: e.target.value })}
              placeholder="e.g. Looking to transition from frontend development to full stack engineering within 3 months."
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 font-sans leading-relaxed"
            />
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className="text-xs font-mono text-slate-400 hover:text-white transition"
            >
              Skip to Dashboard
            </button>

            <button
              type="submit"
              className="btn-nested-spring px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-full flex items-center gap-2 shadow-[0_8px_25px_rgba(79,70,229,0.35)] transition"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Profile Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Profile & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

