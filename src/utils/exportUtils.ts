import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, Footer, PageNumber } from 'docx';
import { jsPDF } from 'jspdf';

// Clean text function as described in PDF page 15
export function sanitizeText(text: string): string {
  if (!text) return '';
  return text
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\r\n/g, '\n')
    .trim();
}

// Download plain text (.txt)
export function downloadAsTxt(fileName: string, text: string) {
  const clean = sanitizeText(text);
  const blob = new Blob([clean], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName.endsWith('.txt') ? fileName : `${fileName}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Download formatted Word document (.docx) matching PDF specs (pages 8, 15, 22)
export async function downloadAsDocx(
  fileName: string,
  docType: string,
  text: string,
  parties: string,
  terms: string,
  dates: string
) {
  const cleanText = sanitizeText(text);
  const lines = cleanText.split('\n');

  // Parse terms for the table
  const termsList = terms
    ? terms.split(';').map(t => t.trim()).filter(Boolean)
    : [];

  const docChildren: any[] = [];

  // LegalEase Header
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: '⚖ LegalEase',
          font: 'Times New Roman',
          size: 32,
          bold: true,
          color: '1E293B',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 360 },
      children: [
        new TextRun({
          text: 'AI-GENERATED FORMAL LEGAL INSTRUMENT',
          font: 'Times New Roman',
          size: 18,
          italics: true,
          color: '64748B',
        }),
      ],
    })
  );

  // Document Title
  docChildren.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { before: 240, after: 280 },
      children: [
        new TextRun({
          text: docType.toUpperCase(),
          font: 'Times New Roman',
          size: 28,
          bold: true,
          color: '0F172A',
        }),
      ],
    })
  );

  // Terms Summary Table (as specifically required by PDF page 8, 9, 15, 22)
  if (termsList.length > 0 || parties || dates) {
    const tableRows = [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { fill: 'F1F5F9' },
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'Parameter', bold: true, font: 'Times New Roman' })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            shading: { fill: 'F1F5F9' },
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'Agreed Contractual Terms', bold: true, font: 'Times New Roman' })],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: 'Document Type', bold: true, font: 'Times New Roman' })] })],
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: docType, font: 'Times New Roman' })] })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: 'Designated Parties', bold: true, font: 'Times New Roman' })] })],
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: parties || 'As stated herein', font: 'Times New Roman' })] })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: 'Effective Date', bold: true, font: 'Times New Roman' })] })],
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: dates || 'Upon Signature', font: 'Times New Roman' })] })],
          }),
        ],
      }),
    ];

    termsList.forEach((t, i) => {
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: `Term ${i + 1}`, bold: true, font: 'Times New Roman' })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: t, font: 'Times New Roman' })] })],
            }),
          ],
        })
      );
    });

    const termsTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: tableRows,
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
        left: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
        right: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
        insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
      },
    });

    docChildren.push(
      new Paragraph({ spacing: { before: 200, after: 120 } }),
      termsTable,
      new Paragraph({ spacing: { before: 200, after: 240 } })
    );
  }

  // Parse lines into Word paragraphs
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      docChildren.push(new Paragraph({ spacing: { after: 120 } }));
      continue;
    }

    if (trimmed.startsWith('# ')) {
      // Main header already added
      continue;
    } else if (trimmed.startsWith('## ')) {
      docChildren.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 280, after: 120 },
          children: [
            new TextRun({
              text: trimmed.replace(/^##\s*/, ''),
              font: 'Times New Roman',
              bold: true,
              size: 24,
              color: '1E293B',
            }),
          ],
        })
      );
    } else if (trimmed.startsWith('### ') || /^[0-9]+\.\s+[A-Z\s]+/.test(trimmed)) {
      docChildren.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 240, after: 100 },
          children: [
            new TextRun({
              text: trimmed.replace(/^###\s*/, ''),
              font: 'Times New Roman',
              bold: true,
              size: 22,
              color: '1E293B',
            }),
          ],
        })
      );
    } else if (trimmed.startsWith('WITNESSETH:') || trimmed.startsWith('WHEREAS,') || trimmed.startsWith('NOW, THEREFORE')) {
      docChildren.push(
        new Paragraph({
          spacing: { after: 140 },
          children: [
            new TextRun({
              text: trimmed,
              font: 'Times New Roman',
              bold: trimmed.includes('WITNESSETH') || trimmed.includes('NOW, THEREFORE'),
              italics: true,
              size: 22,
            }),
          ],
        })
      );
    } else {
      docChildren.push(
        new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({
              text: trimmed,
              font: 'Times New Roman',
              size: 22,
              color: '334155',
            }),
          ],
        })
      );
    }
  }

  // Document Footer on all pages (as highlighted in PDF page 22: "LegalEase Inc. | contact@legalease.com | All Rights Reserved")
  const doc = new Document({
    sections: [
      {
        properties: {},
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'LegalEase Inc. | contact@legalease.com | All Rights Reserved   —   Page ',
                    font: 'Times New Roman',
                    size: 18,
                    color: '94A3B8',
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: 'Times New Roman',
                    size: 18,
                    color: '94A3B8',
                  }),
                  new TextRun({
                    text: ' of ',
                    font: 'Times New Roman',
                    size: 18,
                    color: '94A3B8',
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    font: 'Times New Roman',
                    size: 18,
                    color: '94A3B8',
                  }),
                ],
              }),
            ],
          }),
        },
        children: docChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName.endsWith('.docx') ? fileName : `${fileName}.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Download branded PDF (.pdf) matching PDF specs (pages 8, 15, 23, 24)
export function downloadAsPdf(
  fileName: string,
  docType: string,
  text: string,
  parties: string,
  terms: string,
  dates: string
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const cleanText = sanitizeText(text);
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 50;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  function drawHeader() {
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, 20, contentWidth, 36, 'F');
    doc.setFont('times', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text('⚖  LegalEase', margin + 10, 42);

    doc.setFont('times', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('AI-Generated Formal Legal Instrument', pageWidth - margin - 10, 42, { align: 'right' });

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(1);
    doc.line(margin, 58, pageWidth - margin, 58);
  }

  function drawFooter(pageNumber: number, totalPages: number) {
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(1);
    doc.line(margin, pageHeight - 35, pageWidth - margin, pageHeight - 35);

    doc.setFont('times', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(
      'LegalEase Inc. | contact@legalease.com | All Rights Reserved',
      margin,
      pageHeight - 20
    );
    doc.text(
      `Page ${pageNumber} of ${totalPages}`,
      pageWidth - margin,
      pageHeight - 20,
      { align: 'right' }
    );
  }

  // Draw first page header
  drawHeader();
  cursorY = 85;

  // Title
  doc.setFont('times', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  const titleLines = doc.splitTextToSize(docType.toUpperCase(), contentWidth);
  doc.text(titleLines, pageWidth / 2, cursorY, { align: 'center' });
  cursorY += titleLines.length * 20 + 15;

  // Key parameters box if provided
  if (parties || dates) {
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, cursorY, contentWidth, 48, 4, 4, 'FD');

    doc.setFont('times', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    doc.text('EFFECTIVE DATE:', margin + 12, cursorY + 18);
    doc.setFont('times', 'normal');
    doc.text(dates || 'Execution Date', margin + 115, cursorY + 18);

    doc.setFont('times', 'bold');
    doc.text('PARTIES INVOLVED:', margin + 12, cursorY + 34);
    doc.setFont('times', 'normal');
    const partiesTrimmed = (parties || 'Designated Signatories').length > 55
      ? `${(parties || '').slice(0, 55)}...`
      : parties || 'Designated Signatories';
    doc.text(partiesTrimmed, margin + 115, cursorY + 34);

    cursorY += 65;
  }

  // Split and print content
  const rawParagraphs = cleanText.split('\n');

  for (const para of rawParagraphs) {
    const trimmed = para.trim();
    if (!trimmed) {
      cursorY += 10;
      continue;
    }

    // Check page overflow
    if (cursorY > pageHeight - 65) {
      doc.addPage();
      drawHeader();
      cursorY = 85;
    }

    if (trimmed.startsWith('# ') || trimmed.toLowerCase() === docType.toLowerCase()) {
      continue; // Skip duplicate title
    }

    if (trimmed.startsWith('## ')) {
      doc.setFont('times', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(15, 23, 42);
      const textVal = trimmed.replace(/^##\s*/, '');
      const splitted = doc.splitTextToSize(textVal, contentWidth);
      if (cursorY + splitted.length * 16 > pageHeight - 65) {
        doc.addPage();
        drawHeader();
        cursorY = 85;
      }
      doc.text(splitted, margin, cursorY);
      cursorY += splitted.length * 16 + 6;
    } else if (trimmed.startsWith('### ') || /^[0-9]+\.\s+[A-Z]/.test(trimmed)) {
      doc.setFont('times', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59);
      const textVal = trimmed.replace(/^###\s*/, '');
      const splitted = doc.splitTextToSize(textVal, contentWidth);
      if (cursorY + splitted.length * 14 > pageHeight - 65) {
        doc.addPage();
        drawHeader();
        cursorY = 85;
      }
      doc.text(splitted, margin, cursorY);
      cursorY += splitted.length * 14 + 4;
    } else {
      doc.setFont('times', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);
      const splitted = doc.splitTextToSize(trimmed, contentWidth);
      for (const line of splitted) {
        if (cursorY > pageHeight - 65) {
          doc.addPage();
          drawHeader();
          cursorY = 85;
        }
        doc.text(line, margin, cursorY);
        cursorY += 13;
      }
      cursorY += 4;
    }
  }

  // Draw footers with accurate total page count
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    drawFooter(p, totalPages);
  }

  const finalName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
  doc.save(finalName);
}
