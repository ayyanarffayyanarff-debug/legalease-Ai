import React, { useState } from 'react';
import {
  CheckCircle2,
  Edit3,
  FileDown,
  FileCode,
  FileType,
  Copy,
  Check,
  Scale,
  Table as TableIcon,
  Eye,
  FileSpreadsheet,
  RotateCcw,
  Sparkles,
  Printer,
} from 'lucide-react';
import { downloadAsTxt, downloadAsDocx, downloadAsPdf } from '../utils/exportUtils';

interface DocumentViewerProps {
  documentText: string;
  originalText: string;
  onUpdateText: (newText: string) => void;
  onResetText: () => void;
  documentType: string;
  parties: string;
  terms: string;
  dates: string;
  onOpenAnalyzer: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  documentText,
  originalText,
  onUpdateText,
  onResetText,
  documentType,
  parties,
  terms,
  dates,
  onOpenAnalyzer,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'table'>('preview');
  const [copied, setCopied] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [editorText, setEditorText] = useState(documentText);

  // Sync editor when documentText changes externally
  React.useEffect(() => {
    setEditorText(documentText);
  }, [documentText]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(documentText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy to clipboard', e);
    }
  };

  const handleSaveEdit = () => {
    onUpdateText(editorText);
    setIsEditing(false);
  };

  const handleDownloadTxt = () => {
    const filename = (documentType || 'legal_document').toLowerCase().replace(/\s+/g, '_');
    downloadAsTxt(`${filename}.txt`, documentText);
  };

  const handleDownloadDocx = async () => {
    try {
      setIsExportingDocx(true);
      const filename = (documentType || 'legal_document').toLowerCase().replace(/\s+/g, '_');
      await downloadAsDocx(
        `${filename}.docx`,
        documentType || 'Legal Agreement',
        documentText,
        parties,
        terms,
        dates
      );
    } catch (err) {
      console.error('Failed to export DOCX:', err);
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handleDownloadPdf = () => {
    const filename = (documentType || 'legal_document').toLowerCase().replace(/\s+/g, '_');
    downloadAsPdf(
      `${filename}.pdf`,
      documentType || 'Legal Agreement',
      documentText,
      parties,
      terms,
      dates
    );
  };

  const handlePrint = () => {
    window.print();
  };

  // Parse terms for the Automatic Terms Table (PDF page 8, 9, 15, 22)
  const termsList = terms
    ? terms
        .split(';')
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="space-y-4">
      {/* 1. Document Generated Banner (matching PDF Page 20) */}
      <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-xl p-4 flex items-center justify-between text-emerald-200 shadow-lg shadow-emerald-950/20 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-emerald-300">
              Document Generated Successfully!
            </h3>
            <p className="text-xs text-emerald-300/80">
              Your customized {documentType || 'legal contract'} has been formatted with full recitals, clauses &amp; signature blocks.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={onOpenAnalyzer}
            className="text-xs px-3 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-100 border border-emerald-600/40 flex items-center gap-1.5 transition-colors font-medium"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Plain-English Audit
          </button>
        </div>
      </div>

      {/* 2. Document Action Toolbar (matching PDF page 20, 21) */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl flex flex-wrap items-center justify-between gap-3">
        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              setIsEditing(false);
              setActiveTab('preview');
            }}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
              !isEditing && activeTab === 'preview'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Document View
          </button>

          <button
            onClick={() => {
              setIsEditing(false);
              setActiveTab('table');
            }}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
              !isEditing && activeTab === 'table'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            Terms Table
          </button>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
              isEditing
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            {isEditing ? 'Close Editor' : 'Click to Edit Document'}
          </button>
        </div>

        {/* Multi-Format Download Options (PDF Page 20, 21) */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* TXT Download */}
          <button
            onClick={handleDownloadTxt}
            className="text-xs px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium flex items-center gap-1.5 shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
            title="Download plain text file"
          >
            <FileCode className="w-3.5 h-3.5 text-slate-400" />
            Download as .TXT
          </button>

          {/* DOCX Download */}
          <button
            onClick={handleDownloadDocx}
            disabled={isExportingDocx}
            className="text-xs px-3 py-2 rounded-xl bg-blue-900/40 hover:bg-blue-800/60 text-blue-200 border border-blue-700/50 font-medium flex items-center gap-1.5 shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
            title="Download Microsoft Word formatted document with logo and terms table"
          >
            <FileType className="w-3.5 h-3.5 text-blue-400" />
            {isExportingDocx ? 'Exporting...' : 'Download as .DOCX'}
          </button>

          {/* PDF Download */}
          <button
            onClick={handleDownloadPdf}
            className="text-xs px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-200 border border-rose-700/50 font-medium flex items-center gap-1.5 shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
            title="Download branded PDF with LegalEase logo, headers and footers"
          >
            <FileDown className="w-3.5 h-3.5 text-rose-400" />
            Download as .PDF
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="text-xs px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1 transition-colors"
            title="Copy document text to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="text-xs p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Print document"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Main Document Body Area */}
      {isEditing ? (
        /* Editable Document Preview (matching PDF Page 20, 21) */
        <div className="bg-slate-900/95 rounded-2xl border border-amber-500/40 shadow-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h4 className="text-sm font-semibold text-amber-300 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" />
                Edit Document Below:
              </h4>
              <p className="text-xs text-slate-400">
                Directly customize clauses, dates, party roles, or legal obligations.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditorText(originalText);
                  onResetText();
                }}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition-colors"
                title="Revert all manual edits back to initial AI generation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Draft
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="text-xs px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 shadow transition-all"
              >
                <Check className="w-3.5 h-3.5" />
                Apply Changes
              </button>
            </div>
          </div>

          <textarea
            value={editorText}
            onChange={(e) => setEditorText(e.target.value)}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                handleSaveEdit();
              }
            }}
            rows={22}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-100 font-mono text-xs leading-relaxed focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 resize-y"
          />

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>
              {editorText.split(/\s+/).filter(Boolean).length} words • {editorText.length} characters
            </span>
            <span className="text-slate-400">
              Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300 font-mono text-[10px]">Ctrl + Enter</kbd> to apply
            </span>
          </div>
        </div>
      ) : activeTab === 'table' ? (
        /* Terms Table View (PDF Page 8, 9, 15, 22) */
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-2xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <TableIcon className="w-4 h-4 text-amber-400" />
                Automatic Contract Terms Table
              </h3>
              <p className="text-xs text-slate-400">
                Structured legal metadata and clauses extracted directly from your input specifications.
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300">
              {termsList.length} Extracted Stipulations
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700">
                  <th className="py-3 px-4 font-semibold w-1/4">Parameter</th>
                  <th className="py-3 px-4 font-semibold w-3/4">Agreed Contractual Terms</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                <tr className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-amber-300/90">Document Type</td>
                  <td className="py-3 px-4 text-slate-200 font-semibold">{documentType}</td>
                </tr>
                <tr className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-amber-300/90">Parties Involved</td>
                  <td className="py-3 px-4 text-slate-300">{parties}</td>
                </tr>
                <tr className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-amber-300/90">Effective Date</td>
                  <td className="py-3 px-4 text-slate-300">{dates}</td>
                </tr>
                {termsList.map((term, index) => (
                  <tr key={index} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-400">Clause #{index + 1}</td>
                    <td className="py-3 px-4 text-slate-300 leading-relaxed">{term}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-amber-400" />
              <span>This table is automatically embedded into the exported <strong>.DOCX</strong> and <strong>.PDF</strong> versions.</span>
            </div>
            <button
              onClick={() => setActiveTab('preview')}
              className="text-amber-400 hover:text-amber-300 font-medium underline"
            >
              Back to Full Document
            </button>
          </div>
        </div>
      ) : (
        /* Formatted HTML Document Preview (matching PDF page 20, 22, 23) */
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-2xl p-6 sm:p-10 space-y-8 legal-print-container">
          {/* Formal Legal Header */}
          <div className="text-center pb-6 border-b border-slate-800 space-y-2">
            <div className="flex items-center justify-center gap-2.5">
              <Scale className="w-6 h-6 text-amber-400" />
              <span className="font-brand text-2xl font-bold tracking-wider text-slate-100">
                LegalEase
              </span>
            </div>
            <p className="text-xs uppercase tracking-widest text-slate-400 font-medium">
              Formal AI Legal Instrument
            </p>
          </div>

          {/* Document Content Renderer */}
          <div className="space-y-5 text-slate-200 font-legal text-sm leading-relaxed sm:text-[15px] max-w-4xl mx-auto">
            {documentText.split('\n').map((paragraph, index) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return <div key={index} className="h-3" />;

              // Main Header
              if (trimmed.startsWith('# ')) {
                return (
                  <h1
                    key={index}
                    className="font-brand text-2xl font-bold text-center text-amber-200 tracking-wide pt-2 pb-4 uppercase border-b border-slate-800/80"
                  >
                    {trimmed.replace(/^#\s*/, '')}
                  </h1>
                );
              }

              // Sub Header (e.g. ## Freelance Work Contract)
              if (trimmed.startsWith('## ')) {
                return (
                  <h2
                    key={index}
                    className="font-brand text-xl font-bold text-center text-amber-200 tracking-wide pt-4 pb-2 uppercase"
                  >
                    {trimmed.replace(/^##\s*/, '')}
                  </h2>
                );
              }

              // Section Header (e.g. 1. Services: or ### Section)
              if (trimmed.startsWith('### ') || /^[0-9]+\.\s+[A-Z]/.test(trimmed)) {
                return (
                  <h3
                    key={index}
                    className="font-sans font-bold text-base text-slate-100 pt-5 pb-1 border-b border-slate-800/50 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                    {trimmed.replace(/^###\s*/, '')}
                  </h3>
                );
              }

              // Legal Recitals (WITNESSETH, WHEREAS, NOW THEREFORE)
              if (
                trimmed.startsWith('WITNESSETH:') ||
                trimmed.startsWith('WHEREAS,') ||
                trimmed.startsWith('NOW, THEREFORE')
              ) {
                return (
                  <p
                    key={index}
                    className="font-legal italic text-slate-300 text-sm pl-4 border-l-2 border-amber-500/40 my-3 leading-relaxed"
                  >
                    {trimmed}
                  </p>
                );
              }

              // Signature line formatting
              if (trimmed.includes('____') || trimmed.includes('FIRST PARTY') || trimmed.includes('SECOND PARTY')) {
                return (
                  <pre
                    key={index}
                    className="font-mono text-xs text-slate-400 bg-slate-950/60 p-4 rounded-xl border border-slate-800 overflow-x-auto whitespace-pre my-4"
                  >
                    {trimmed}
                  </pre>
                );
              }

              // Standard Clause Paragraph
              return (
                <p key={index} className="text-slate-300 leading-relaxed text-justify">
                  {trimmed}
                </p>
              );
            })}
          </div>

          {/* Embedded LegalEase Footer (matching PDF page 22 & 23) */}
          <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 space-y-1">
            <p className="font-medium text-slate-400">
              LegalEase Inc. | contact@legalease.com | All Rights Reserved
            </p>
            <p className="text-[11px] text-slate-600">
              Generated by LegalEase AI Legal Engine • Reviewed for formal drafting standards
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
