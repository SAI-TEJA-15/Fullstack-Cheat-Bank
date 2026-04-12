import { CheatSheet } from '../types';

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const MARGIN_X = 50;
const TOP_MARGIN = 60;
const BOTTOM_MARGIN = 50;
const TITLE_FONT_SIZE = 22;
const HEADING_FONT_SIZE = 16;
const BODY_FONT_SIZE = 11;
const LINE_GAP = 6;
const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN_X * 2);
const BODY_CHAR_WIDTH = BODY_FONT_SIZE * 0.55;
const HEADING_CHAR_WIDTH = HEADING_FONT_SIZE * 0.55;
const TITLE_CHAR_WIDTH = TITLE_FONT_SIZE * 0.55;

type PdfLine = {
  text: string;
  fontSize: number;
};

const sanitizeText = (value: string): string =>
  value
    .replace(/\r?\n/g, ' ')
    .replace(/[^\x20-\x7E]/g, '?')
    .trim();

const escapePdfText = (value: string): string =>
  sanitizeText(value)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');

const sanitizeFilename = (title: string): string =>
  title.replace(/[^a-z0-9]/gi, '_').replace(/_+/g, '_').toLowerCase();

const wrapText = (text: string, maxCharsPerLine: number): string[] => {
  const normalized = sanitizeText(text);
  if (!normalized) {
    return [''];
  }

  const words = normalized.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  words.forEach((word) => {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (candidate.length <= maxCharsPerLine) {
      currentLine = candidate;
      return;
    }

    if (currentLine) {
      lines.push(currentLine);
      currentLine = '';
    }

    if (word.length <= maxCharsPerLine) {
      currentLine = word;
      return;
    }

    let remaining = word;
    while (remaining.length > maxCharsPerLine) {
      lines.push(remaining.slice(0, maxCharsPerLine - 1) + '-');
      remaining = remaining.slice(maxCharsPerLine - 1);
    }
    currentLine = remaining;
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
};

const addWrappedLines = (
  lines: PdfLine[],
  text: string,
  fontSize: number,
  charWidth: number,
  prefix = ''
) => {
  const prefixLength = prefix.length;
  const maxChars = Math.max(20, Math.floor(CONTENT_WIDTH / charWidth));
  const continuationPrefix = prefix ? ' '.repeat(prefixLength) : '';

  wrapText(text, Math.max(10, maxChars - prefixLength)).forEach((line, index) => {
    lines.push({
      text: `${index === 0 ? prefix : continuationPrefix}${line}`.trimEnd(),
      fontSize,
    });
  });
};

const buildPdfLines = (sheet: CheatSheet): PdfLine[] => {
  const lines: PdfLine[] = [];

  addWrappedLines(lines, sheet.title, TITLE_FONT_SIZE, TITLE_CHAR_WIDTH);
  lines.push({ text: '', fontSize: BODY_FONT_SIZE });
  addWrappedLines(lines, sheet.description, BODY_FONT_SIZE, BODY_CHAR_WIDTH);
  lines.push({ text: '', fontSize: BODY_FONT_SIZE });
  lines.push({ text: `Category: ${sanitizeText(sheet.category)}`, fontSize: BODY_FONT_SIZE });
  lines.push({ text: `Author: ${sanitizeText(sheet.author.name)}`, fontSize: BODY_FONT_SIZE });
  lines.push({ text: `Created: ${new Date(sheet.createdAt).toLocaleDateString()}`, fontSize: BODY_FONT_SIZE });

  if (sheet.tags.length > 0) {
    addWrappedLines(lines, `Tags: ${sheet.tags.join(', ')}`, BODY_FONT_SIZE, BODY_CHAR_WIDTH);
  }

  lines.push({ text: '', fontSize: BODY_FONT_SIZE });

  sheet.content.forEach((section) => {
    addWrappedLines(lines, section.title, HEADING_FONT_SIZE, HEADING_CHAR_WIDTH);
    lines.push({ text: '', fontSize: BODY_FONT_SIZE });

    section.commands.forEach((command) => {
      addWrappedLines(
        lines,
        `${command.command} - ${command.description}`,
        BODY_FONT_SIZE,
        BODY_CHAR_WIDTH,
        '- '
      );
    });

    lines.push({ text: '', fontSize: BODY_FONT_SIZE });
  });

  return lines;
};

const buildPdfContent = (pages: PdfLine[][]): string[] =>
  pages.map((page) => {
    let cursorY = PAGE_HEIGHT - TOP_MARGIN;
    let content = 'BT\n';

    page.forEach((line) => {
      content += `/F1 ${line.fontSize} Tf\n`;
      content += `1 0 0 1 ${MARGIN_X} ${cursorY} Tm\n`;
      content += `(${escapePdfText(line.text)}) Tj\n`;
      cursorY -= line.fontSize + LINE_GAP;
    });

    content += 'ET';
    return content;
  });

const paginateLines = (lines: PdfLine[]): PdfLine[][] => {
  const pages: PdfLine[][] = [];
  let currentPage: PdfLine[] = [];
  let usedHeight = 0;
  const maxHeight = PAGE_HEIGHT - TOP_MARGIN - BOTTOM_MARGIN;

  lines.forEach((line) => {
    const lineHeight = line.fontSize + LINE_GAP;

    if (currentPage.length > 0 && usedHeight + lineHeight > maxHeight) {
      pages.push(currentPage);
      currentPage = [];
      usedHeight = 0;
    }

    currentPage.push(line);
    usedHeight += lineHeight;
  });

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages;
};

const buildPdf = (sheet: CheatSheet): Uint8Array => {
  const encoder = new TextEncoder();
  const pageContents = buildPdfContent(paginateLines(buildPdfLines(sheet)));
  const objects: string[] = [];

  objects.push('<< /Type /Catalog /Pages 2 0 R >>');

  const pageKids = pageContents.map((_, index) => `${4 + (index * 2)} 0 R`).join(' ');
  objects.push(`<< /Type /Pages /Count ${pageContents.length} /Kids [${pageKids}] >>`);
  objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');

  pageContents.forEach((content, index) => {
    const pageObjectNumber = 4 + (index * 2);
    const contentObjectNumber = pageObjectNumber + 1;

    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentObjectNumber} 0 R >>`
    );
    objects.push(`<< /Length ${encoder.encode(content).length} >>\nstream\n${content}\nendstream`);
  });

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [0];

  objects.forEach((object, index) => {
    offsets.push(encoder.encode(pdf).length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = encoder.encode(pdf).length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';

  offsets.slice(1).forEach((offset) => {
    pdf += `${offset.toString().padStart(10, '0')} 00000 n \n`;
  });

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return encoder.encode(pdf);
};

export const downloadCheatSheetAsPdf = (sheet: CheatSheet) => {
  const blob = new Blob([buildPdf(sheet)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = `${sanitizeFilename(sheet.title)}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};
