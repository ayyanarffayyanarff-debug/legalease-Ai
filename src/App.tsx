import React, { useState } from 'react';
import { Header } from './components/Header';
import { DocumentForm } from './components/DocumentForm';
import { DocumentViewer } from './components/DocumentViewer';
import { LegalAnalyzerModal } from './components/LegalAnalyzerModal';
import { AboutModal } from './components/AboutModal';
import { PRESET_SCENARIOS, LegalScenario } from './data/presets';
import { sanitizeText } from './utils/exportUtils';
import { Scale, Sparkles, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function App() {
  // Default to Scenario 2 (Freelance Work Contract) from the PDF screenshots
  const defaultScenario = PRESET_SCENARIOS[0];

  const [formData, setFormData] = useState({
    document_type: defaultScenario.document_type,
    parties: defaultScenario.parties,
    terms: defaultScenario.terms,
    dates: defaultScenario.dates,
    jurisdiction: defaultScenario.jurisdiction,
    additional_instructions: '',
  });

  const [activePresetId, setActivePresetId] = useState<string | undefined>(
    defaultScenario.id
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Generated document state
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [originalDraft, setOriginalDraft] = useState<string>('');
  const [lastGeneratedParams, setLastGeneratedParams] = useState(formData);

  // Modals
  const [isAnalyzerOpen, setIsAnalyzerOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Handle Preset Selection
  const handleSelectPreset = (preset: LegalScenario) => {
    setActivePresetId(preset.id);
    setFormData({
      document_type: preset.document_type,
      parties: preset.parties,
      terms: preset.terms,
      dates: preset.dates,
      jurisdiction: preset.jurisdiction,
      additional_instructions: '',
    });
    setErrorMessage(null);
  };

  // Handle Document Generation Submit
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          document_type: formData.document_type,
          parties: formData.parties,
          terms: formData.terms,
          dates: formData.dates,
          jurisdiction: formData.jurisdiction,
          additional_instructions: formData.additional_instructions,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP status ${response.status}`);
      }

      const data = await response.json();
      const doc = sanitizeText(data.document || '');

      setGeneratedText(doc);
      setOriginalDraft(doc);
      setLastGeneratedParams({ ...formData });

      // Smooth scroll to generated document
      setTimeout(() => {
        const docElem = document.getElementById('generated-document-section');
        if (docElem) {
          docElem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err: any) {
      console.error('Failed to generate document:', err);
      setErrorMessage(
        err.message || 'An error occurred while generating the legal document.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateText = (newText: string) => {
    setGeneratedText(newText);
  };

  const handleResetText = () => {
    setGeneratedText(originalDraft);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Header & Presets */}
      <Header
        onSelectPreset={handleSelectPreset}
        activePresetId={activePresetId}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Hero Section matching PDF branding */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
            <Scale className="w-3.5 h-3.5" />
            <span>SmartBridge &amp; SmartInternz Capstone Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight font-brand text-slate-100">
            LegalEase
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Generate formal, tailored, and enforceable legal documents in seconds using Google Gemini AI.
            Export seamlessly to <span className="text-slate-200 font-semibold">.PDF</span>, <span className="text-slate-200 font-semibold">.DOCX</span>, and <span className="text-slate-200 font-semibold">.TXT</span>.
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="bg-rose-950/80 border border-rose-500/50 rounded-xl p-4 text-xs text-rose-200 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-300">Generation Notice</p>
              <p className="mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Input Form & Preview Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form (5 Cols on LG, or 12 if no document yet) */}
          <div className={`${generatedText ? 'lg:col-span-5' : 'lg:col-span-8 lg:col-start-3'} transition-all`}>
            <DocumentForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleGenerate}
              isLoading={isLoading}
            />
          </div>

          {/* Right Column: Generated Document View (7 Cols on LG) */}
          {generatedText ? (
            <div id="generated-document-section" className="lg:col-span-7 space-y-6">
              <DocumentViewer
                documentText={generatedText}
                originalText={originalDraft}
                onUpdateText={handleUpdateText}
                onResetText={handleResetText}
                documentType={lastGeneratedParams.document_type}
                parties={lastGeneratedParams.parties}
                terms={lastGeneratedParams.terms}
                dates={lastGeneratedParams.dates}
                onOpenAnalyzer={() => setIsAnalyzerOpen(true)}
              />
            </div>
          ) : (
            /* Empty State Guide when no document is generated yet (only shown if not full-width) */
            <div className="hidden lg:block lg:col-span-4 bg-slate-900/40 rounded-2xl border border-slate-800/80 p-6 space-y-5">
              <div className="flex items-center gap-2 text-amber-400">
                <Sparkles className="w-4 h-4" />
                <h3 className="text-sm font-semibold text-slate-200">
                  How LegalEase Works
                </h3>
              </div>

              <div className="space-y-4 text-xs text-slate-400">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center font-bold text-amber-400 shrink-0 text-[11px]">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-300">Select or Input Details</h4>
                    <p className="text-[11px] mt-0.5">
                      Choose from presets (Freelance Contract, NDA, Residential Lease) or input your own parameters.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center font-bold text-amber-400 shrink-0 text-[11px]">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-300">AI Synthesizes Agreement</h4>
                    <p className="text-[11px] mt-0.5">
                      Gemini models formal clauses, recitals, terms table, and signatures tailored to your jurisdiction.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center font-bold text-amber-400 shrink-0 text-[11px]">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-300">Review, Edit &amp; Export</h4>
                    <p className="text-[11px] mt-0.5">
                      Directly edit text in-browser or download branded .PDF, .DOCX, or .TXT formats with one click.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-950/40 p-3 rounded-xl border border-emerald-900/60">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Enforces standard legal formatting, definitions, and execution blocks.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/40 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-400" />
            <span className="font-brand font-semibold text-slate-300">LegalEase</span>
            <span>— AI Legal Document Generator</span>
          </div>
          <p className="text-[11px]">
            LegalEase Inc. | contact@legalease.com | All Rights Reserved
          </p>
        </div>
      </footer>

      {/* Modals */}
      <LegalAnalyzerModal
        isOpen={isAnalyzerOpen}
        onClose={() => setIsAnalyzerOpen(false)}
        documentText={generatedText || ''}
        documentType={lastGeneratedParams.document_type}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
}
