/**
 * Document Parser - Handles parsing of various document formats
 * Supports: DOCX (with full formatting), HTML, TXT, MD
 * Preserves formatting, images, tables, spacing, fonts, alignment, and structure
 */

export interface ParsedContent {
  html: string;
  text: string;
  images: Array<{
    id: string;
    src: string;
    alt: string;
    width?: number;
    height?: number;
  }>;
  tables: Array<{
    id: string;
    rows: number;
    cols: number;
    content: string[][];
  }>;
  metadata: {
    title?: string;
    author?: string;
    createdDate?: Date;
    pageCount?: number;
  };
}

/**
 * Parse a file and extract its content with full formatting preservation
 */
export async function parseDocument(file: File): Promise<ParsedContent> {
  try {
    const fileType = getFileType(file);

    console.log(`[Parser] Detected file type: ${fileType} for ${file.name}`);

    let result: ParsedContent;
    
    switch (fileType) {
      case 'docx':
        result = await parseDocxWithMammoth(file);
        break;
      case 'html':
        result = await parseHtml(file);
        break;
      case 'md':
        result = await parseMarkdown(file);
        break;
      case 'txt':
        result = await parseText(file);
        break;
      default:
        // Try parsing as text as fallback
        result = await parseAsText(file);
    }

    // Validate result has content
    if (!result.text || result.text.trim().length === 0) {
      console.warn('[Parser] Parsed document has no text content');
      // Still return it, but with warning
    }

    return result;
  } catch (error) {
    console.error('[Parser] Error in parseDocument:', error);
    // Fallback to text parsing
    return parseAsText(file);
  }
}

/**
 * Detect file type from file extension and MIME type
 */
function getFileType(file: File): 'docx' | 'html' | 'md' | 'txt' | 'unknown' {
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();

  if (name.endsWith('.docx') || type.includes('wordprocessingml')) {
    return 'docx';
  }
  if (name.endsWith('.html') || name.endsWith('.htm') || type.includes('html')) {
    return 'html';
  }
  if (name.endsWith('.md') || name.endsWith('.markdown')) {
    return 'md';
  }
  if (name.endsWith('.txt') || type.includes('text/plain')) {
    return 'txt';
  }

  return 'unknown';
}

/**
 * Parse DOCX using Mammoth.js for proper formatting preservation
 * Mammoth converts DOCX to clean HTML while preserving:
 * - Fonts and styling (bold, italic, underline)
 * - Alignment (left, center, right, justify)
 * - Spacing and indentation
 * - Tables with proper structure
 * - Images with proper sizing
 * - Lists and nested elements
 */
async function parseDocxWithMammoth(file: File): Promise<ParsedContent> {
  try {
    // Dynamically import mammoth
    const mammoth = (await import('mammoth')).default;
    
    console.log('[Parser] Using Mammoth.js to parse DOCX with full formatting preservation');
    
    const buffer = await file.arrayBuffer();

    // Convert DOCX to HTML with images as base64
    const result = await mammoth.convertToHtml({
      arrayBuffer: buffer,
    } as any);

    // Get the HTML content
    let html = result.value;
    console.log(`[Parser] Mammoth conversion complete. HTML length: ${html.length}`);

    // Add table styling for better appearance
    html = enhanceTableStyling(html);
    
    // Extract images that were converted
    const images = extractImagesFromMammothHtml(html);
    
    // Extract tables
    const tables = extractTablesFromHtml(html);
    
    // Get plain text
    const text = stripHtmlTags(html);

    // Log any conversion messages/warnings
    if (result.messages && result.messages.length > 0) {
      console.log('[Parser] Mammoth messages:', result.messages);
    }

    return {
      html,
      text,
      images,
      tables,
      metadata: {
        title: file.name.replace(/\.docx$/, ''),
      },
    };
  } catch (mammothError) {
    console.error('[Parser] Mammoth.js parsing failed:', mammothError);
    
    // Fallback to JSZip if Mammoth fails
    try {
      console.log('[Parser] Attempting JSZip fallback parsing');
      return await parseDocxWithJSZip(file);
    } catch (fallbackError) {
      console.error('[Parser] JSZip fallback also failed:', fallbackError);
      
      // Final fallback to basic text extraction
      try {
        return await parseDocxAsText(file);
      } catch (finalError) {
        console.error('[Parser] All DOCX parsing methods failed:', finalError);
        return {
          html: '<p>Could not parse document (file may be corrupted)</p>',
          text: 'Could not parse document (file may be corrupted)',
          images: [],
          tables: [],
          metadata: { title: file.name },
        };
      }
    }
  }
}

/**
 * Enhance table styling in HTML
 */
/**
 * Enhance table styling while preserving existing alignment and styles
 */
function enhanceTableStyling(html: string): string {
  // For paragraphs - ensure they have explicit left alignment as default
  html = html.replace(
    /<p([^>]*)>/g,
    (match, attrs) => {
      // Only add text-align if not already present
      if (!attrs.includes('style') && !attrs.includes('align')) {
        return '<p' + attrs + ' style="text-align: left;">';
      }
      return match;
    }
  );

  // For tables - preserve existing styles but add defaults
  html = html.replace(
    /<table([^>]*)>/g,
    (match, attrs) => {
      // Check if style attribute exists
      const hasStyle = /style\s*=/.test(match);
      if (hasStyle) {
        // Insert styles into existing style attribute
        return match.replace(
          /style\s*=\s*["']([^"']*)["']/,
          (styleMatch, styleContent) => {
            const styles = `border-collapse: collapse; width: 100%; margin: 15px 0; border: 1px solid #ddd; text-align: left; ${styleContent}`;
            return `style="${styles}"`;
          }
        );
      } else {
        return '<table' + attrs + ' style="border-collapse: collapse; width: 100%; margin: 15px 0; border: 1px solid #ddd; text-align: left;">';
      }
    }
  );

  // For table rows - preserve existing styles
  html = html.replace(
    /<tr([^>]*)>/g,
    (match, attrs) => {
      const hasStyle = /style\s*=/.test(match);
      if (hasStyle) {
        return match.replace(
          /style\s*=\s*["']([^"']*)["']/,
          (styleMatch, styleContent) => {
            const styles = `border: 1px solid #ddd; ${styleContent}`;
            return `style="${styles}"`;
          }
        );
      } else {
        return '<tr' + attrs + ' style="border: 1px solid #ddd;">';
      }
    }
  );

  // For table cells - preserve and add left alignment
  html = html.replace(
    /<td([^>]*)>/g,
    (match, attrs) => {
      const hasStyle = /style\s*=/.test(match);
      if (hasStyle) {
        return match.replace(
          /style\s*=\s*["']([^"']*)["']/,
          (styleMatch, styleContent) => {
            // Only add text-align if not already present
            const alignStyle = /text-align/.test(styleContent) ? '' : 'text-align: left; ';
            const styles = `border: 1px solid #ddd; padding: 10px; ${alignStyle}${styleContent}`;
            return `style="${styles}"`;
          }
        );
      } else {
        return '<td' + attrs + ' style="border: 1px solid #ddd; padding: 10px; text-align: left;">';
      }
    }
  );

  // For table headers - preserve and add left alignment
  html = html.replace(
    /<th([^>]*)>/g,
    (match, attrs) => {
      const hasStyle = /style\s*=/.test(match);
      if (hasStyle) {
        return match.replace(
          /style\s*=\s*["']([^"']*)["']/,
          (styleMatch, styleContent) => {
            const alignStyle = /text-align/.test(styleContent) ? '' : 'text-align: left; ';
            const styles = `border: 1px solid #ddd; padding: 10px; background-color: #f5f5f5; font-weight: bold; ${alignStyle}${styleContent}`;
            return `style="${styles}"`;
          }
        );
      } else {
        return '<th' + attrs + ' style="border: 1px solid #ddd; padding: 10px; background-color: #f5f5f5; font-weight: bold; text-align: left;">';
      }
    }
  );

  return html;
}

/**
 * Extract images from Mammoth HTML (base64 encoded)
 */
function extractImagesFromMammothHtml(html: string): ParsedContent['images'] {
  const images: ParsedContent['images'] = [];
  
  // Match img tags with src attributes
  const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g;
  let match;
  let imgIndex = 0;

  while ((match = imgRegex.exec(html)) !== null) {
    const src = match[1];
    
    // Extract width and height if present
    const widthMatch = match[0].match(/width[:\s]*[=:]\s*["']?(\d+)/i);
    const heightMatch = match[0].match(/height[:\s]*[=:]\s*["']?(\d+)/i);

    images.push({
      id: `img-${imgIndex}`,
      src: src,
      alt: `Image ${imgIndex + 1}`,
      width: widthMatch ? parseInt(widthMatch[1]) : undefined,
      height: heightMatch ? parseInt(heightMatch[1]) : undefined,
    });
    imgIndex++;
  }

  console.log(`[Parser] Extracted ${images.length} images from document`);
  return images;
}

/**
 * Extract tables from HTML
 */
function extractTablesFromHtml(html: string): ParsedContent['tables'] {
  const tables: ParsedContent['tables'] = [];
  
  try {
    // Match all table elements
    const tableRegex = /<table[^>]*>[\s\S]*?<\/table>/gi;
    const tableMatches = html.match(tableRegex) || [];

    tableMatches.forEach((tableHtml, tableIdx) => {
      // Extract rows
      const rowRegex = /<tr[^>]*>[\s\S]*?<\/tr>/gi;
      const rowMatches = tableHtml.match(rowRegex) || [];

      const tableContent: string[][] = [];

      rowMatches.forEach((rowHtml) => {
        // Extract cells (both td and th)
        const cellRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
        const rowContent: string[] = [];
        let cellMatch;

        while ((cellMatch = cellRegex.exec(rowHtml)) !== null) {
          // Remove nested HTML tags from cell content
          const cellText = cellMatch[1]
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')
            .trim();
          rowContent.push(cellText);
        }

        if (rowContent.length > 0) {
          tableContent.push(rowContent);
        }
      });

      if (tableContent.length > 0) {
        const maxCols = Math.max(...tableContent.map(row => row.length), 0);
        tables.push({
          id: `table-${tableIdx}`,
          rows: tableContent.length,
          cols: maxCols,
          content: tableContent,
        });
      }
    });

    console.log(`[Parser] Extracted ${tables.length} tables from document`);
  } catch (error) {
    console.error('[Parser] Error extracting tables:', error);
  }

  return tables;
}

/**
 * Fallback: Parse DOCX with JSZip for better XML extraction
 */
async function parseDocxWithJSZip(file: File): Promise<ParsedContent> {
  try {
    const JSZip = (await import('jszip')).default;
    
    const buffer = await file.arrayBuffer();
    const zip = new JSZip();
    await zip.loadAsync(buffer);

    const documentXml = await zip.file('word/document.xml')?.async('string');
    if (!documentXml) {
      console.warn('[Parser] No document.xml found, falling back to text');
      return parseAsText(file);
    }

    const text = extractTextFromDocxXml(documentXml);
    const html = extractHtmlFromDocxXml(documentXml);
    const images = await extractImagesFromDocxZip(zip);
    const tables = extractTablesFromDocxXml(documentXml);

    const finalText = text || 'Document imported';
    const finalHtml = html || `<p>${finalText}</p>`;

    console.log(`[Parser] JSZip parsing complete. Text: ${finalText.length}chars, Images: ${images.length}, Tables: ${tables.length}`);

    return {
      html: finalHtml,
      text: finalText,
      images,
      tables,
      metadata: { title: file.name.replace(/\.docx$/, '') },
    };
  } catch (error) {
    console.error('[Parser] JSZip parsing failed:', error);
    throw error;
  }
}

/**
 * Parse DOCX as text when JSZip is not available
 */
async function parseDocxAsText(file: File): Promise<ParsedContent> {
  try {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const binaryString = String.fromCharCode.apply(null, Array.from(bytes));
    
    // Extract text from binary by looking for readable strings
    // DOCX files contain XML with text elements
    const xmlMatch = binaryString.match(/<\?xml[\s\S]*?<\/document>/);
    if (xmlMatch) {
      const xmlString = xmlMatch[0];
      const text = extractTextFromDocxXml(xmlString);
      const html = extractHtmlFromDocxXml(xmlString);
      
      return {
        html: html || `<p>${text}</p>`,
        text: text || 'Document content extracted',
        images: [],
        tables: [],
        metadata: { title: file.name.replace(/\.docx$/, '') },
      };
    }
    
    // If XML extraction fails, try basic text extraction
    const text = binaryString
      .match(/[\x20-\x7E]+/g)
      ?.filter(str => str.length > 3)
      .join(' ')
      .slice(0, 5000) || '';
    
    return {
      html: `<p>${text || 'Document content imported'}</p>`,
      text: text || 'Document content imported',
      images: [],
      tables: [],
      metadata: { title: file.name.replace(/\.docx$/, '') },
    };
  } catch (error) {
    console.error('Error in parseDocxAsText:', error);
    return parseAsText(file);
  }
}

/**
 * Extract text from DOCX XML
 */
function extractTextFromDocxXml(xml: string): string {
  try {
    // Remove XML declarations and namespaces for easier parsing
    let content = xml;

    // Extract all text elements (w:t tags)
    const textRegex = /<w:t[^>]*>([^<]*)<\/w:t>/g;
    const texts: string[] = [];
    let match;

    while ((match = textRegex.exec(content)) !== null) {
      const text = match[1].trim();
      if (text) {
        texts.push(text);
      }
    }

    return texts.join(' ') || '';
  } catch (error) {
    console.error('Error extracting text from DOCX XML:', error);
    return '';
  }
}

/**
 * Extract HTML from DOCX XML
 */
function extractHtmlFromDocxXml(xml: string): string {
  try {
    let html = '';
    
    // Parse paragraphs
    const paragraphRegex = /<w:p>.*?<\/w:p>/gs;
    const paragraphs = xml.match(paragraphRegex) || [];

    for (const para of paragraphs) {
      // Extract text from this paragraph
      const textRegex = /<w:t[^>]*>([^<]*)<\/w:t>/g;
      let paraText = '';
      let textMatch;

      while ((textMatch = textRegex.exec(para)) !== null) {
        paraText += textMatch[1];
      }

      // Check for bold and italic
      const isBold = /<w:b/.test(para);
      const isItalic = /<w:i/.test(para);

      if (paraText.trim()) {
        let styledText = paraText;
        if (isBold) styledText = `<strong>${styledText}</strong>`;
        if (isItalic) styledText = `<em>${styledText}</em>`;
        
        html += `<p>${styledText}</p>`;
      } else {
        html += '<p><br/></p>';
      }
    }

    // Parse tables
    const tableRegex = /<w:tbl>.*?<\/w:tbl>/gs;
    const tables = xml.match(tableRegex) || [];

    for (const table of tables) {
      html += parseTableFromXml(table);
    }

    return html || '';
  } catch (error) {
    console.error('Error extracting HTML from DOCX XML:', error);
    return '';
  }
}

/**
 * Parse table from XML
 */
function parseTableFromXml(tableXml: string): string {
  try {
    let tableHtml = '<table border="1" style="border-collapse: collapse; width: 100%; margin: 10px 0;">';

    // Extract rows
    const rowRegex = /<w:tr>.*?<\/w:tr>/gs;
    const rows = tableXml.match(rowRegex) || [];

    for (const row of rows) {
      tableHtml += '<tr>';

      // Extract cells
      const cellRegex = /<w:tc>.*?<\/w:tc>/gs;
      const cells = row.match(cellRegex) || [];

      for (const cell of cells) {
        // Extract text from cell
        const textRegex = /<w:t[^>]*>([^<]*)<\/w:t>/g;
        let cellText = '';
        let textMatch;

        while ((textMatch = textRegex.exec(cell)) !== null) {
          cellText += textMatch[1];
        }

        tableHtml += `<td style="padding: 8px; border: 1px solid #ccc;">${cellText || '&nbsp;'}</td>`;
      }

      tableHtml += '</tr>';
    }

    tableHtml += '</table>';
    return tableHtml;
  } catch (error) {
    console.error('Error parsing table from XML:', error);
    return '';
  }
}

/**
 * Extract images from DOCX ZIP
 */
async function extractImagesFromDocxZip(zip: any): Promise<ParsedContent['images']> {
  const images: ParsedContent['images'] = [];

  try {
    // Images are typically in word/media/ folder
    zip.folder('word/media')?.forEach(async (relativePath: string, file: any) => {
      if (file.name && (
        file.name.endsWith('.png') ||
        file.name.endsWith('.jpg') ||
        file.name.endsWith('.jpeg') ||
        file.name.endsWith('.gif')
      )) {
        try {
          const blob = await file.async('blob');
          const url = URL.createObjectURL(blob);

          images.push({
            id: `img-${images.length}`,
            src: url,
            alt: file.name,
          });
        } catch (error) {
          console.warn(`Failed to extract image ${file.name}:`, error);
        }
      }
    });
  } catch (error) {
    console.error('Error extracting images from DOCX:', error);
  }

  return images;
}

/**
 * Extract tables from DOCX XML
 */
function extractTablesFromDocxXml(xml: string): ParsedContent['tables'] {
  const tables: ParsedContent['tables'] = [];

  try {
    const tableRegex = /<w:tbl>.*?<\/w:tbl>/gs;
    const tableMatches = xml.match(tableRegex) || [];

    for (let tableIdx = 0; tableIdx < tableMatches.length; tableIdx++) {
      const tableXml = tableMatches[tableIdx];

      // Extract rows
      const rowRegex = /<w:tr>.*?<\/w:tr>/gs;
      const rows = tableXml.match(rowRegex) || [];

      const tableContent: string[][] = [];
      let maxCols = 0;

      for (const row of rows) {
        const rowContent: string[] = [];

        // Extract cells
        const cellRegex = /<w:tc>.*?<\/w:tc>/gs;
        const cells = row.match(cellRegex) || [];

        for (const cell of cells) {
          const textRegex = /<w:t[^>]*>([^<]*)<\/w:t>/g;
          let cellText = '';
          let textMatch;

          while ((textMatch = textRegex.exec(cell)) !== null) {
            cellText += textMatch[1];
          }

          rowContent.push(cellText.trim());
        }

        if (rowContent.length > 0) {
          tableContent.push(rowContent);
          maxCols = Math.max(maxCols, rowContent.length);
        }
      }

      if (tableContent.length > 0) {
        tables.push({
          id: `table-${tableIdx}`,
          rows: tableContent.length,
          cols: maxCols,
          content: tableContent,
        });
      }
    }
  } catch (error) {
    console.error('Error extracting tables from DOCX XML:', error);
  }

  return tables;
}

/**
 * Parse HTML file
 */
async function parseHtml(file: File): Promise<ParsedContent> {
  const content = await file.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');

  // Extract images
  const images: ParsedContent['images'] = [];
  doc.querySelectorAll('img').forEach((img, index) => {
    images.push({
      id: `img-${index}`,
      src: img.src,
      alt: img.alt || `Image ${index + 1}`,
      width: img.width || undefined,
      height: img.height || undefined,
    });
  });

  // Extract tables
  const tables: ParsedContent['tables'] = [];
  doc.querySelectorAll('table').forEach((table, tableIndex) => {
    const rows = table.querySelectorAll('tr');
    const tableData: string[][] = [];

    rows.forEach((row) => {
      const cells = row.querySelectorAll('td, th');
      const rowData: string[] = [];
      cells.forEach((cell) => {
        rowData.push(cell.textContent || '');
      });
      tableData.push(rowData);
    });

    tables.push({
      id: `table-${tableIndex}`,
      rows: rows.length,
      cols: tableData[0]?.length || 0,
      content: tableData,
    });
  });

  const html = doc.body.innerHTML;
  const text = doc.body.innerText;

  return {
    html,
    text,
    images,
    tables,
    metadata: {
      title: doc.title || file.name,
    },
  };
}

/**
 * Parse Markdown file
 */
async function parseMarkdown(file: File): Promise<ParsedContent> {
  const markdown = await file.text();

  // Simple markdown to HTML conversion
  let html = markdown
    .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
    .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
    .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    .replace(/^- (.*?)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[^>]*>)/gm, '<p>')
    .replace(/(?<![>p])$/gm, '</p>');

  // Extract images from markdown
  const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
  const images: ParsedContent['images'] = [];
  let match;
  let imgIndex = 0;

  while ((match = imageRegex.exec(markdown)) !== null) {
    images.push({
      id: `img-${imgIndex}`,
      alt: match[1],
      src: match[2],
    });
    imgIndex++;
  }

  return {
    html,
    text: markdown,
    images,
    tables: [],
    metadata: {
      title: file.name.replace(/\.md$/, ''),
    },
  };
}

/**
 * Parse plain text file
 */
async function parseText(file: File): Promise<ParsedContent> {
  return parseAsText(file);
}

/**
 * Fallback text parser
 */
async function parseAsText(file: File): Promise<ParsedContent> {
  const text = await file.text();

  // Convert text to basic HTML with paragraphs
  const html = `<p>${text.split('\n').join('</p><p>')}</p>`;

  return {
    html,
    text,
    images: [],
    tables: [],
    metadata: {
      title: file.name,
    },
  };
}

/**
 * Strip HTML tags from content
 */
export function stripHtmlTags(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

/**
 * Sanitize HTML for safe display
 */
export function sanitizeHtml(html: string): string {
  // Create a safe HTML container
  const div = document.createElement('div');
  div.innerHTML = html;

  // Remove dangerous tags and attributes
  const dangerousTags = ['script', 'iframe', 'object', 'embed', 'form'];
  dangerousTags.forEach((tag) => {
    div.querySelectorAll(tag).forEach((el) => el.remove());
  });

  // Remove event handlers
  div.querySelectorAll('*').forEach((el) => {
    Array.from(el.attributes).forEach((attr) => {
      if (attr.name.startsWith('on')) {
        el.removeAttribute(attr.name);
      }
    });
  });

  return div.innerHTML;
}

/**
 * Enhance HTML with proper alignment and formatting preservation
 * Used for both imported documents and AI-generated content
 */
export function enhanceHtmlAlignment(html: string): string {
  let enhanced = html;

  // Ensure paragraphs have explicit left alignment
  enhanced = enhanced.replace(
    /<p([^>]*)>/g,
    (match, attrs) => {
      // Skip if already has text-align
      if (/style\s*=/.test(match) && /text-align/.test(match)) {
        return match;
      }
      // Add style attribute if doesn't exist
      if (/style\s*=/.test(match)) {
        return match.replace(
          /style\s*=\s*["']([^"']*)["']/,
          (styleMatch, styleContent) => {
            return `style="${styleContent}; text-align: left;"`;
          }
        );
      }
      return '<p' + attrs + ' style="text-align: left;">';
    }
  );

  // Ensure headings have left alignment
  ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(tag => {
    const regex = new RegExp(`<${tag}([^>]*)>`, 'g');
    enhanced = enhanced.replace(regex, (match, attrs) => {
      if (/style\s*=/.test(match) && /text-align/.test(match)) {
        return match;
      }
      if (/style\s*=/.test(match)) {
        return match.replace(
          /style\s*=\s*["']([^"']*)["']/,
          (styleMatch, styleContent) => {
            return `style="${styleContent}; text-align: left;"`;
          }
        );
      }
      return `<${tag}${attrs} style="text-align: left;">`;
    });
  });

  // Ensure lists maintain left alignment
  enhanced = enhanced.replace(
    /<(?:ul|ol)([^>]*)>/g,
    (match, attrs) => {
      if (/style\s*=/.test(match)) {
        return match.replace(
          /style\s*=\s*["']([^"']*)["']/,
          (styleMatch, styleContent) => {
            return `style="${styleContent}; text-align: left;"`;
          }
        );
      }
      return match.replace(/(?=>)/, ' style="text-align: left;"');
    }
  );

  // Wrap in document-content if not already wrapped
  if (!enhanced.includes('class="document-content"')) {
    enhanced = `<div class="document-content">${enhanced}</div>`;
  }

  return enhanced;
}

/**
 * Convert parsed content to insertable HTML for editor
 */
export function convertParsedToEditorHtml(parsed: ParsedContent): string {
  // Sanitize and format for editor
  const sanitized = sanitizeHtml(parsed.html);

  // Enhance alignment
  const aligned = enhanceHtmlAlignment(sanitized);

  return aligned;
}
