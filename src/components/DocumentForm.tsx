import React, { useState } from 'react';
import {
  FileText,
  Users,
  ListPlus,
  Calendar,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MapPin,
  HelpCircle,
  Wand2,
} from 'lucide-react';
import { POPULAR_DOC_TYPES } from '../data/presets';

interface DocumentFormData {
  document_type: string;
  parties: string;
  terms: string;
  dates: string;
  jurisdiction: string;
  additional_instructions: string;
}

interface DocumentFormProps {
  formData: DocumentFormData;
  setFormData: React.Dispatch<React.SetStateAction<DocumentFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const DocumentForm: React.FC<DocumentFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  isLoading,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFieldChange = (
    field: keyof DocumentFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSampleTerm = (sample: string) => {
    if (!formData.terms.trim()) {
      handleFieldChange('terms', sample);
    } else {
      const current = formData.terms.trim().replace(/;$/, '');
      handleFieldChange('terms', `${current}; ${sample}`);
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
      {/* Form Title & Overview */}
      <div className="px-6 py-5 border-b border-slate-800/80 bg-slate-900/50 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            Legal Agreement Configuration
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Provide the required legal entities, clauses, and effective timelines.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-amber-400/90 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gemini AI Engine</span>
        </div>
      </div>

      <form onSubmit={onSubmit} className="p-6 space-y-5">
        {/* 1. Document Type */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-200 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              Document Type
              <span className="text-xs text-slate-400 font-normal">
                (Ex: Agreement, Contract, NDA, Lease Agreement)
              </span>
            </label>
            <span className="text-xs text-rose-400 font-medium">* Required</span>
          </div>

          <div className="relative">
            <input
              type="text"
              required
              value={formData.document_type}
              onChange={(e) => handleFieldChange('document_type', e.target.value)}
              placeholder="e.g. Freelance Work Contract"
              className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 text-sm transition-all"
            />
          </div>

          {/* Quick suggestions pills */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[11px] text-slate-500">Quick fill:</span>
            {POPULAR_DOC_TYPES.slice(0, 4).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleFieldChange('document_type', type)}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 border border-slate-700 transition-colors"
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Parties Involved */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-200 flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              Parties Involved
              <span className="text-xs text-slate-400 font-normal">
                (Names and formal roles of entities)
              </span>
            </label>
            <span className="text-xs text-rose-400 font-medium">* Required</span>
          </div>
          <textarea
            required
            rows={2}
            value={formData.parties}
            onChange={(e) => handleFieldChange('parties', e.target.value)}
            placeholder="e.g. Jane Doe (Service Provider), TechNova Inc. (Client)"
            className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 text-sm transition-all resize-y min-h-[58px]"
          />
        </div>

        {/* 3. Terms & Conditions (Semicolon separated) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-1">
            <label className="text-sm font-medium text-slate-200 flex items-center gap-2">
              <ListPlus className="w-4 h-4 text-amber-400" />
              Terms &amp; Conditions
              <span className="text-xs text-amber-400/90 font-medium">
                (Use semicolons for bullet points)
              </span>
            </label>
            <span className="text-xs text-rose-400 font-medium">* Required</span>
          </div>
          <p className="text-xs text-slate-400">
            Define specific clauses, milestones, payment schedules, or restrictions. Separate each term with a semicolon (<code className="text-amber-300 bg-slate-800 px-1 py-0.5 rounded">;</code>).
          </p>
          <textarea
            required
            rows={4}
            value={formData.terms}
            onChange={(e) => handleFieldChange('terms', e.target.value)}
            placeholder="e.g. Work must be delivered by May 15, 2025; Payment will be made within 7 days of invoice; The client retains intellectual property rights; Confidentiality must be maintained at all times; Either party may terminate with 15 days notice"
            className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 text-sm transition-all resize-y min-h-[96px] font-mono text-xs leading-relaxed"
          />

          {/* Quick clauses injection helper */}
          <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Wand2 className="w-3 h-3 text-amber-400" /> Insert clause:
            </span>
            {[
              'Payment due within 30 days of invoice',
              'Non-compete clause applies during term',
              'Governed by Delaware arbitration',
              '10% late fee per month on delinquent balance',
            ].map((clause) => (
              <button
                key={clause}
                type="button"
                onClick={() => handleAddSampleTerm(clause)}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700/60 transition-colors"
              >
                + {clause}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Effective Date */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-200 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              Effective Date
              <span className="text-xs text-slate-400 font-normal">
                (The date when agreement becomes legally valid)
              </span>
            </label>
            <span className="text-xs text-rose-400 font-medium">* Required</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              value={formData.dates}
              onChange={(e) => handleFieldChange('dates', e.target.value)}
              placeholder="e.g. April 15, 2025 or 10/04/2025"
              className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 text-sm transition-all"
            />
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                const formatted = now.toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                });
                handleFieldChange('dates', formatted);
              }}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 hover:text-white rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              Set to Today's Date
            </button>
          </div>
        </div>

        {/* Optional Advanced Settings Accordion */}
        <div className="pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-between w-full text-xs font-medium text-slate-400 hover:text-slate-200 py-1"
          >
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Jurisdiction &amp; Custom Drafting Directives (Optional)
            </span>
            {showAdvanced ? (
              <ChevronUp className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {showAdvanced && (
            <div className="mt-3 space-y-3.5 bg-slate-950/40 p-4 rounded-xl border border-slate-800">
              <div>
                <label className="text-xs text-slate-300 block mb-1">
                  Governing Law / Jurisdiction
                </label>
                <input
                  type="text"
                  value={formData.jurisdiction}
                  onChange={(e) => handleFieldChange('jurisdiction', e.target.value)}
                  placeholder="e.g. State of California, USA"
                  className="w-full bg-slate-950/90 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">
                  Additional AI Drafting Instructions
                </label>
                <input
                  type="text"
                  value={formData.additional_instructions}
                  onChange={(e) =>
                    handleFieldChange('additional_instructions', e.target.value)
                  }
                  placeholder="e.g. Include strict mutual non-solicitation, make tone favorable to service provider"
                  className="w-full bg-slate-950/90 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Generate Button matching PDF (Page 18, 19, 20) */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm tracking-wide shadow-lg transition-all flex items-center justify-center gap-2.5 ${
              isLoading
                ? 'bg-amber-600/50 text-amber-200 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.008] active:scale-[0.995]'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>LegalEase AI Drafting Contract...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
                <span>Generate Document</span>
              </>
            )}
          </button>

          {/* PDF helper note matching Page 18 & 19 */}
          <div className="mt-2 text-center">
            <span className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
              <HelpCircle className="w-3 h-3" />
              Click &quot;Generate Document&quot; to synthesize contract clauses, terms table &amp; signature blocks
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};
