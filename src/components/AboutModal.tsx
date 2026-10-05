import React from 'react';
import { X, Scale, CheckCircle2, Layers, Cpu, FileDown, ShieldCheck, Terminal } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Scale className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                LegalEase Project Architecture
              </h3>
              <p className="text-xs text-slate-400">
                AI-Powered Legal Document Generator Specification
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
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* Milestone Progression */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              Project Milestones &amp; Implementation
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="font-bold text-slate-200 block mb-1">
                  Milestone 1: Model &amp; Architecture
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Google Gemini AI integration via <code className="text-amber-300">@google/genai</code>, full-stack Express API with Vite proxy, strict environment configuration.
                </p>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="font-bold text-slate-200 block mb-1">
                  Milestone 2: Core Functionalities
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Legal text generation, editable markdown preview, and multi-format exports (.txt, .docx, .pdf).
                </p>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="font-bold text-slate-200 block mb-1">
                  Milestone 3: API Logic &amp; Routes
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Endpoints <code className="text-amber-300">POST /generate</code> and <code className="text-amber-300">POST /api/generate</code> accepting document_type, parties, terms, dates.
                </p>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="font-bold text-slate-200 block mb-1">
                  Milestone 4 &amp; 5: UI &amp; Export Delivery
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Intuitive dark interface, real-time contract editing, automatic terms table generation, and instant branded downloads.
                </p>
              </div>
            </div>
          </div>

          {/* API Schemas */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-emerald-400" />
              API Payload Schema
            </h4>
            <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-amber-300/90 font-mono leading-relaxed overflow-x-auto">
{`POST /generate (or /api/generate)
{
  "document_type": "Freelance Work Contract",
  "parties": "Jane Doe (Service Provider), TechNova Inc. (Client)",
  "terms": "Work delivered by May 15; Payment within 7 days; IP assigned...",
  "dates": "April 15, 2025",
  "jurisdiction": "State of California"
}`}
            </pre>
          </div>

          {/* Key Deliverables */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <FileDown className="w-4 h-4 text-blue-400" />
              Export Capabilities
            </h4>
            <ul className="space-y-1.5 list-disc list-inside text-slate-400 text-[11px]">
              <li><strong className="text-slate-200">.TXT:</strong> Sanitized plain text with clean typography and quotes</li>
              <li><strong className="text-slate-200">.DOCX:</strong> Microsoft Word document featuring embedded terms table, Times New Roman styling, and footer branding</li>
              <li><strong className="text-slate-200">.PDF:</strong> Multi-page vector document with LegalEase scales header, formatted clauses, signature blocks, and page counters</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all text-xs"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
