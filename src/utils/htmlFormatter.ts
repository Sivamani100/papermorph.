/**
 * Utility to convert HTML content to clean, readable text for chat display
 * while preserving structure with markdown-like formatting
 */

/**
 * Convert HTML to readable chat display format
 * Removes HTML tags but keeps structure with text formatting
 */
export function htmlToReadableText(html: string): string {
  if (!html) return '';

  let text = html;

  // Replace headings with bold text and newlines
  text = text.replace(/<h1[^>]*>([^<]+)<\/h1>/gi, '\n**$1**\n');
  text = text.replace(/<h2[^>]*>([^<]+)<\/h2>/gi, '\n**$1**\n');
  text = text.replace(/<h3[^>]*>([^<]+)<\/h3>/gi, '\n**$1**\n');
  text = text.replace(/<h4[^>]*>([^<]+)<\/h4>/gi, '\n**$1**\n');
  text = text.replace(/<h5[^>]*>([^<]+)<\/h5>/gi, '\n**$1**\n');
  text = text.replace(/<h6[^>]*>([^<]+)<\/h6>/gi, '\n**$1**\n');

  // Replace paragraphs with double newlines
  text = text.replace(/<p[^>]*>([^<]+)<\/p>/gi, '$1\n\n');

  // Replace line breaks
  text = text.replace(/<br[^>]*>/gi, '\n');

  // Replace bold
  text = text.replace(/<strong[^>]*>([^<]+)<\/strong>/gi, '**$1**');
  text = text.replace(/<b[^>]*>([^<]+)<\/b>/gi, '**$1**');

  // Replace italic
  text = text.replace(/<em[^>]*>([^<]+)<\/em>/gi, '*$1*');
  text = text.replace(/<i[^>]*>([^<]+)<\/i>/gi, '*$1*');

  // Handle unordered lists
  text = text.replace(/<ul[^>]*>/gi, '\n');
  text = text.replace(/<\/ul>/gi, '\n');
  text = text.replace(/<li[^>]*>([^<]+)<\/li>/gi, '• $1\n');

  // Handle ordered lists
  text = text.replace(/<ol[^>]*>/gi, '\n');
  text = text.replace(/<\/ol>/gi, '\n');
  let olCounter = 1;
  text = text.replace(/<li[^>]*>([^<]+)<\/li>/gi, () => {
    return `${olCounter++}. $1\n`;
  });

  // Handle blockquotes
  text = text.replace(/<blockquote[^>]*>([^<]+)<\/blockquote>/gi, '> $1\n');

  // Handle tables - convert to simple text format
  text = text.replace(/<table[^>]*>/gi, '\n');
  text = text.replace(/<\/table>/gi, '\n');
  text = text.replace(/<thead[^>]*>/gi, '');
  text = text.replace(/<\/thead>/gi, '\n---\n');
  text = text.replace(/<tbody[^>]*>/gi, '');
  text = text.replace(/<\/tbody>/gi, '\n');
  text = text.replace(/<tr[^>]*>/gi, '');
  text = text.replace(/<\/tr>/gi, '\n');
  text = text.replace(/<th[^>]*>([^<]+)<\/th>/gi, '$1 | ');
  text = text.replace(/<td[^>]*>([^<]+)<\/td>/gi, '$1 | ');

  // Remove any remaining HTML tags
  text = text.replace(/<[^>]+>/g, '');

  // Clean up excessive whitespace
  text = text.replace(/\n\n\n+/g, '\n\n');
  text = text.replace(/\s+\|\s*\n/g, '\n');
  text = text.replace(/\|\s*$/gm, '');

  // Trim the result
  return text.trim();
}

/**
 * Check if content is primarily HTML (contains HTML tags)
 */
export function isHTMLContent(text: string): boolean {
  return /<[^>]+>/g.test(text);
}

/**
 * Sanitize HTML for safe display and application
 */
export function sanitizeHTML(html: string): string {
  if (!html) return '';

  // Remove potentially dangerous tags and scripts
  let sanitized = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');

  return sanitized;
}

/**
 * Check if text contains document-like structure
 * (headers, lists, paragraphs with structure)
 */
export function hasDocumentStructure(text: string): boolean {
  const structureIndicators = [
    /<h[1-6]/i,
    /<table/i,
    /<ul|<ol/i,
    /<blockquote/i,
    /^(Subject:|To:|Date:|Dear|Yours)/m,
    /^#+\s/m, // markdown headers
  ];

  return structureIndicators.some(indicator => indicator.test(text));
}

/**
 * Extract plain text content (for previews, summaries)
 */
export function extractPlainText(text: string, maxLength: number = 200): string {
  const readable = htmlToReadableText(text);
  const plain = readable
    .replace(/\*\*/g, '') // Remove bold markers
    .replace(/\*/g, '') // Remove italic markers
    .replace(/^[\s>•\-\d.]+/gm, ''); // Remove list markers

  if (plain.length > maxLength) {
    return plain.substring(0, maxLength).trim() + '...';
  }
  return plain;
}
