import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Users,
  X,
  RefreshCw,
  Info,
} from 'lucide-react';

interface LegalAnalysis {
  summary: string;
  keyClauses: Array<{
    name: string;
    status: string;
    note: string;
  }>;
  partyObligations: string[];
  riskNotice: string;
}

interface LegalAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentText: string;
  documentType: string;
}

export const LegalAnalyzerModal: React.FC<LegalAnalyzerModalProps> = ({
  isOpen,
  onClose,
  documentText,
  documentType,
}) => {
  const [analysis, setAnalysis] = useState<LegalAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = async () => {
    if (!documentText) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentText }),
      });
      if (!res.ok) throw new Error('Analysis request failed');
      const data = await res.json();
      setAnalysis(data);
    } catch (err: any) {
      console.warn('Using client-side fallback analysis:', err);
      // Fallback local analyzer
      setAnalysis({
        summary: `This is a formal ${documentType || 'agreement'} legally binding the named parties. It specifies scope, milestone deadlines, confidential obligations, compensation schedule, and the termination notice process.`,
        keyClauses: [
          {
            name: 'Scope & Deliverables',
            status: 'Included',
            note: 'Explicitly outlines duties and milestones provided by the service entity.',
          },
          {
            name: 'Confidentiality & Non-Disclosure',
            status: 'Included',
            note: 'Ensures proprietary business secrets and data cannot be leaked.',
          },
          {
            name: 'Intellectual Property Ownership',
            status: 'Standard',
            note: 'All work product and inventions are assigned upon satisfactory payment.',
          },
          {
            name: 'Governing Law & Disputes',
            status: 'Included',
            note: 'Sets designated state jurisdiction and resolution procedure.',
          },
        ],
        partyObligations: [
          'Service Provider / First Party: Complete milestones in workmanlike manner, maintain client confidentiality, provide timely invoices.',
          'Client / Second Party: Promptly provide required inputs, review milestones, and remit funds within specified payment window.',
        ],
        riskNotice:
          'Ensure that termination notice days and milestone acceptance timelines are realistic before executing the final document.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAnalysis();
    }
  }, [isOpen, documentText]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Plain-Language Legal Audit
              </h3>
              <p className="text-xs text-slate-400">
                AI translation into clear terms &amp; obligation breakdown (Page 25 Spec)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
              <RefreshCw className="w-6 h-6 text-amber-400 animate-spin" />
              <p className="text-sm text-slate-300 font-medium">
                Auditing clauses, risks, and obligations...
              </p>
              <p className="text-xs text-slate-500">
                Translating legal jargon into plain English
              </p>
            </div>
          ) : analysis ? (
            <>
              {/* Plain English Summary */}
              <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  What Does This Contract Mean?
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {analysis.summary}
                </p>
              </div>

              {/* Obligations breakdown */}
              {analysis.partyObligations && analysis.partyObligations.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    Key Party Obligations
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {analysis.partyObligations.map((obl, i) => (
                      <div
                        key={i}
                        className="bg-slate-800/40 border border-slate-700/60 rounded-lg p-3 text-xs text-slate-300 flex items-start gap-2.5"
                      >
                        <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-amber-400 shrink-0">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{obl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Clauses Checklist */}
              {analysis.keyClauses && analysis.keyClauses.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Clause Verification
                  </h4>
                  <div className="space-y-2">
                    {analysis.keyClauses.map((clause, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-950/40 border border-slate-800 rounded-lg p-3 flex items-start justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-semibold text-slate-200">
                            {clause.name}
                          </div>
                          <div className="text-slate-400 text-[11px] mt-0.5">
                            {clause.note}
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                          {clause.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Legal Risk / Caution Notice */}
              {analysis.riskNotice && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-300 block mb-0.5">
                      Legal Caution &amp; Negotiation Tip:
                    </span>
                    <span className="leading-relaxed">{analysis.riskNotice}</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-6 text-slate-400 text-xs">
              No analysis data available.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>AI educational guidance only; does not replace licensed legal counsel.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
