import React from 'react';
import { Scale, FileCheck2, Sparkles, BookOpen } from 'lucide-react';
import { PRESET_SCENARIOS, LegalScenario } from '../data/presets';

interface HeaderProps {
  onSelectPreset: (preset: LegalScenario) => void;
  activePresetId?: string;
  onOpenAbout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectPreset,
  activePresetId,
  onOpenAbout,
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand with Scales of Justice matching PDF specs */}
        <div className="flex items-center gap-3.5 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/20 via-slate-800 to-amber-600/10 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/5 group-hover:border-amber-400/50 transition-colors">
            <Scale className="w-6 h-6 text-amber-400 group-hover:scale-105 transition-transform" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-brand text-2xl font-bold tracking-wide text-slate-100 group-hover:text-amber-300 transition-colors">
                LegalEase
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                AI Powered
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              AI Legal Document Generator
            </p>
          </div>
        </div>

        {/* Quick Presets selector bar */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Presets:
          </span>
          {PRESET_SCENARIOS.slice(0, 3).map((scenario) => {
            const isActive = activePresetId === scenario.id;
            return (
              <button
                key={scenario.id}
                onClick={() => onSelectPreset(scenario)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                  isActive
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-200 shadow-sm shadow-amber-500/10'
                    : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-300 hover:text-slate-100'
                }`}
                title={scenario.description}
              >
                {scenario.name}
              </button>
            );
          })}

          <button
            onClick={onOpenAbout}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-slate-200 flex items-center gap-1 ml-1 transition-colors"
            title="About LegalEase & Specifications"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Guide</span>
          </button>
        </div>
      </div>
    </header>
  );
};
