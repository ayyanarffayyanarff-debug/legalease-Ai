import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Initialize GoogleGenAI client according to instructions
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper to sanitize text (as specified in LegalEase PDF page 15)
function sanitizeText(text: string): string {
  if (!text) return '';
  return text
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\r\n/g, '\n')
    .trim();
}

// Fallback high-quality template generator if offline or API key pending
function generateFallbackDocument(
  documentType: string,
  parties: string,
  terms: string,
  dates: string,
  jurisdiction?: string
): string {
  const termsList = terms
    ? terms.split(';').map(t => t.trim()).filter(Boolean)
    : [
        'Payment to be made within 30 days of invoice receipt',
        'Work must be delivered according to agreed milestones and specifications',
        'Confidentiality must be strictly maintained at all times',
        'Either party may terminate this agreement with 15 days written notice',
      ];

  const termsBullets = termsList
    .map((t, idx) => `   (${String.fromCharCode(97 + idx)}) ${t}.`)
    .join('\n');

  const governingState = jurisdiction?.trim() || 'the State of Delaware';

  return `## ${documentType || 'LEGAL AGREEMENT'}

This ${documentType || 'Agreement'} is entered into and made effective as of ${dates || 'the date of execution'} ("Effective Date"),

BY AND BETWEEN:

${parties || 'Party A (Service Provider) and Party B (Client)'}
(hereinafter collectively referred to as the "Parties", and each individually as a "Party").

WITNESSETH:

WHEREAS, the Parties desire to enter into this ${documentType || 'Agreement'} to define their respective rights, responsibilities, and covenants in connection with their commercial engagement; and

WHEREAS, each Party has full legal authority and legal capacity to enter into and perform the obligations set forth herein;

NOW, THEREFORE, in consideration of the mutual covenants, representations, and premises contained herein, and other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the Parties agree as follows:

1. PURPOSE AND SCOPE
The purpose of this ${documentType || 'Agreement'} is to govern the relationship, deliverables, and commitments between the Parties as expressly outlined in the terms and conditions herein.

2. SPECIFIC TERMS AND CONDITIONS
The Parties expressly agree to abide by and execute the following core stipulations and requirements:
${termsBullets}

3. TERM AND TERMINATION
(a) Term: This Agreement shall commence upon the Effective Date and shall continue in full force and effect until the completion of all commitments or until terminated in accordance with the provisions herein.
(b) Termination for Convenience: Either Party may terminate this Agreement by providing written notice to the other Party in accordance with the notice provisions set forth herein.
(c) Termination for Cause: Either Party may immediately terminate this Agreement upon written notice if the other Party commits a material breach of any provision hereof and fails to cure such breach within ten (10) calendar days of receiving written notice.

4. CONSIDERATION AND PAYMENT
All payments, reimbursements, or considerations due under this Agreement shall be tendered in lawful currency of the United States. Invoices shall be processed and remitted in full compliance with the agreed terms, and any delinquent sums may accrue lawful statutory interest.

5. CONFIDENTIALITY AND NON-DISCLOSURE
Each Party agrees to hold in strict confidence all proprietary data, business plans, technical processes, client identities, and non-public information disclosed by the other Party. Neither Party shall disclose such Confidential Information to any third party without prior written consent, except as required by applicable law or judicial decree.

6. INTELLECTUAL PROPERTY RIGHTS
Unless otherwise specifically designated in Section 2, all deliverables, materials, work products, patents, trademarks, and copyrights developed under this Agreement shall belong solely and exclusively to the designated party as stipulated, free of any encumbrance or lien.

7. REPRESENTATIONS AND WARRANTIES
Each Party represents and warrants that:
(a) It has valid authority to execute this Agreement;
(b) The execution and delivery of this Agreement will not breach or conflict with any existing contractual obligation;
(c) Its performance will conform to all applicable professional standards, municipal laws, and federal statutes.

8. INDEMNIFICATION AND LIMITATION OF LIABILITY
Each Party agrees to defend, indemnify, and hold harmless the other Party, its officers, directors, and agents from and against any third-party claims, damages, liabilities, and expenses arising out of gross negligence, willful misconduct, or material breach of this Agreement. In no event shall either Party be liable for indirect, punitive, or consequential damages.

9. GOVERNING LAW AND DISPUTE RESOLUTION
This Agreement shall be governed by, construed, and enforced in accordance with the laws of ${governingState}, without regard to conflict of law principles. Any dispute arising under or relating to this Agreement that cannot be resolved amicably within thirty (30) days shall be submitted to binding arbitration or adjudicated in the competent courts situated within ${governingState}.

10. SEVERABILITY AND ENTIRE AGREEMENT
If any provision of this Agreement is held to be invalid or unenforceable, such provision shall be severed and the remaining provisions shall continue in full force and effect. This Agreement constitutes the complete and exclusive agreement between the Parties and supersedes all prior oral or written negotiations, statements, and understandings.

IN WITNESS WHEREOF, the Parties hereto have caused this ${documentType || 'Agreement'} to be duly executed by their authorized representatives as of the Effective Date written above.


________________________________________          ________________________________________
FIRST PARTY SIGNATURE                             SECOND PARTY SIGNATURE

Name: __________________________________          Name: __________________________________
Title: _________________________________          Title: _________________________________
Date: __________________________________          Date: __________________________________`;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'LegalEase AI Legal Document Generator API',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Root endpoint matching Activity 3.1 in PDF
app.get('/', (req, res, next) => {
  if (req.headers.accept?.includes('application/json')) {
    return res.json({
      message: 'Welcome to LegalEase AI Legal Document Generator API',
      status: 'active',
    });
  }
  next();
});

// Primary generation handler (supporting both /generate and /api/generate)
async function handleGenerate(req: express.Request, res: express.Response) {
  try {
    const {
      document_type,
      parties,
      terms,
      dates,
      jurisdiction,
      additional_instructions,
    } = req.body;

    const docType = (document_type || 'General Commercial Agreement').trim();
    const partiesStr = (parties || '').trim();
    const termsStr = (terms || '').trim();
    const datesStr = (dates || 'Current Date').trim();
    const stateStr = (jurisdiction || 'State of Delaware').trim();

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY not configured. Generating standard legal draft.');
      const draft = generateFallbackDocument(docType, partiesStr, termsStr, datesStr, stateStr);
      return res.json({
        document: sanitizeText(draft),
        source: 'standard_legal_template',
      });
    }

    const prompt = `
Generate a comprehensive, formal, and enforceable legal document titled '${docType}'.

Key parameters provided:
- Document Type: ${docType}
- Involved Parties: ${partiesStr || 'Party A and Party B'}
- Effective Date: ${datesStr}
- Terms and Conditions (clauses/stipulations): ${termsStr || 'Standard commercial and confidentiality terms'}
- Jurisdiction / Governing Law: ${stateStr}
${additional_instructions ? `- Special Client Instructions: ${additional_instructions}` : ''}

Drafting Requirements:
1. Ensure formal legal structure with numbered sections and standard legal clauses:
   - Document Title as Markdown Header (e.g. ## FREELANCE WORK CONTRACT)
   - Preamble with Parties identification and Effective Date
   - Recitals (WITNESSETH, WHEREAS clauses)
   - Numbered Sections (e.g., 1. Services / Scope of Work, 2. Term and Termination, 3. Payment & Invoicing Terms, 4. Intellectual Property Rights, 5. Confidentiality, 6. Independent Contractor Status (if applicable), 7. Representations & Warranties, 8. Indemnification & Limitation of Liability, 9. Governing Law & Dispute Resolution, 10. Entire Agreement & Severability)
   - Thoroughly integrate and elaborate on all the user's provided Terms & Conditions into appropriate sections or an explicit "Agreed Key Terms & Stipulations" section.
   - Clean, professional signature blocks for all parties at the end (with signature lines, Name, Title, and Date placeholders).
2. Use precise legal terminology, clear definitions, and enforceable legal formatting.
3. Do not include markdown code block formatting (avoid \`\`\`markdown or \`\`\`), output the raw document directly with clean markdown headings and numbered lists.
`.trim();

    let generatedDoc = '';
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction:
              'You are LegalEase AI, an expert corporate and contract drafting attorney. You draft rigorous, comprehensive, and legally sound documents tailored to the user inputs. You always provide complete documents with recitals, definitions, detailed clauses, and signature blocks.',
            temperature: 0.2,
          },
        });
        generatedDoc = response.text || '';
        if (generatedDoc.trim()) break;
      } catch (err) {
        if (attempt === 2) throw err;
        await new Promise((r) => setTimeout(r, 800));
      }
    }
    if (!generatedDoc.trim()) {
      const fallback = generateFallbackDocument(docType, partiesStr, termsStr, datesStr, stateStr);
      return res.json({
        document: sanitizeText(fallback),
        source: 'fallback',
      });
    }

    const cleanText = sanitizeText(generatedDoc);
    res.json({
      document: cleanText,
      source: 'gemini-3.8-flash',
    });
  } catch (error: any) {
    console.error('Error generating document with Gemini:', error);
    // Graceful fallback so user always gets a working document
    const fallback = generateFallbackDocument(
      req.body.document_type || 'Legal Contract',
      req.body.parties || '',
      req.body.terms || '',
      req.body.dates || '',
      req.body.jurisdiction
    );
    res.json({
      document: sanitizeText(fallback),
      source: 'fallback',
      warning: error.message || 'Generated using offline legal framework template.',
    });
  }
}

// Endpoint /generate matching PDF specification Activity 2.2 / 3.2
app.post('/generate', handleGenerate);
app.post('/api/generate', handleGenerate);

// Secondary endpoint: Plain-language analysis & risk check (highlighted in PDF Conclusion page 25)
app.post('/api/analyze', async (req, res) => {
  try {
    const { documentText } = req.body;
    if (!documentText) {
      return res.status(400).json({ error: 'documentText is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        summary: 'Standard commercial agreement defining obligations, payments, and termination.',
        keyClauses: [
          { name: 'Confidentiality', status: 'Included', note: 'Standard non-disclosure terms present.' },
          { name: 'Termination', status: 'Included', note: 'Notice period defined.' },
          { name: 'Governing Law', status: 'Included', note: 'Jurisdiction specified.' },
        ],
        partyObligations: [
          'First Party: Perform services and maintain confidentiality.',
          'Second Party: Remit payment within agreed timeline.',
        ],
        riskNotice: 'Review indemnification limits and ensure deadlines are realistic before signing.',
      });
    }

    const prompt = `
Analyze the following legal document and provide a structured JSON response:
Document Text:
${documentText.slice(0, 8000)}

Return JSON with:
{
  "summary": "2-3 sentence plain-English explanation for non-lawyers of what this contract does",
  "keyClauses": [
    {"name": "Clause Name", "status": "Included|Missing|Standard", "note": "brief observation"}
  ],
  "partyObligations": [
    "Key responsibility for Party 1",
    "Key responsibility for Party 2"
  ],
  "riskNotice": "Key caution or negotiation tip for the user to be aware of"
}
`.trim();

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.1,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error analyzing document:', error);
    res.status(500).json({ error: 'Failed to analyze document' });
  }
});

// Setup Vite middleware in dev or serve static build in production
async function setupVite() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LegalEase Server running at http://0.0.0.0:${PORT}`);
  });
}

setupVite().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
