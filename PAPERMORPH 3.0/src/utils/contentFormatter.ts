/**
 * Utility to format HTML content for proper insertion into TipTap editor
 * Preserves spacing, table formatting, colors, and all styling from the preview
 */

/**
 * Format HTML content to preserve exact preview appearance when inserted into editor
 * - Adds proper spacing preservation to paragraphs
 * - Ensures tables maintain their structure
 * - Preserves line heights, margins, and colors
 * - Maintains text decorations and formatting
 */
export function formatHTMLForInsertion(html: string): string {
  if (!html) return '';

  let formatted = html;

  // Preserve text colors and decorations
  // Handle underlines and colored text
  formatted = formatted.replace(/<u([^>]*)>/gi, '<u style="text-decoration: underline;">');
  formatted = formatted.replace(/<s([^>]*)>/gi, '<s style="text-decoration: line-through;">');
  formatted = formatted.replace(/<em([^>]*)>/gi, '<em style="font-style: italic;">');
  formatted = formatted.replace(/<strong([^>]*)>/gi, '<strong style="font-weight: bold;">');

  // Ensure paragraphs have proper spacing and preserve existing colors
  formatted = formatted.replace(/<p([^>]*)>/gi, (match, attrs) => {
    // Check if style already exists - preserve it, just add margin/line-height if needed
    if (attrs.includes('style')) {
      const styleMatch = attrs.match(/style="([^"]*)"/);
      if (styleMatch && !styleMatch[1].includes('margin') && !styleMatch[1].includes('line-height')) {
        return `<p${attrs.replace(/style="([^"]*)"/, `style="$1; margin: 1em 0; line-height: 1.6;"`)}>`;
      }
      return match;
    }
    return `<p${attrs} style="margin: 1em 0; line-height: 1.6;">`;
  });

  // Ensure tables have proper formatting and don't collapse
  formatted = formatted.replace(/<table([^>]*)>/gi, (match, attrs) => {
    if (attrs.includes('style')) {
      return match;
    }
    return `<table${attrs} style="border-collapse: collapse; width: 100%; margin: 1em 0; border: 1px solid #ccc;">`;
  });

  // Ensure table rows have proper spacing
  formatted = formatted.replace(/<tr([^>]*)>/gi, (match, attrs) => {
    if (attrs.includes('style')) {
      return match;
    }
    return `<tr${attrs} style="border-bottom: 1px solid #ccc;">`;
  });

  // Ensure table cells have proper padding and borders
  formatted = formatted.replace(/<(td|th)([^>]*)>/gi, (match, tag, attrs) => {
    if (attrs.includes('style')) {
      return match;
    }
    const isTh = tag === 'th';
    const style = isTh 
      ? 'padding: 0.75em; text-align: left; background-color: #f5f5f5; font-weight: bold; border: 1px solid #ccc;'
      : 'padding: 0.75em; text-align: left; border: 1px solid #ccc;';
    return `<${tag}${attrs} style="${style}">`;
  });

  // Ensure headings have proper spacing and typography
  formatted = formatted.replace(/<h([1-6])([^>]*)>/gi, (match, level, attrs) => {
    if (attrs.includes('style')) {
      return match;
    }
    const sizes = ['2.5em', '2em', '1.75em', '1.5em', '1.25em', '1em'];
    const size = sizes[parseInt(level) - 1] || '1em';
    return `<h${level}${attrs} style="margin: 1.5em 0 0.75em 0; font-weight: 700; font-size: ${size}; line-height: 1.2;">`;
  });

  // Ensure lists have proper spacing
  formatted = formatted.replace(/<(ul|ol)([^>]*)>/gi, (match, tag, attrs) => {
    if (attrs.includes('style')) {
      return match;
    }
    return `<${tag}${attrs} style="margin: 1em 0; padding-left: 2em;">`;
  });

  formatted = formatted.replace(/<li([^>]*)>/gi, (match, attrs) => {
    if (attrs.includes('style')) {
      return match;
    }
    return `<li${attrs} style="margin: 0.5em 0; line-height: 1.6;">`;
  });

  // Ensure blockquotes have proper formatting (preserve colors like red lines)
  formatted = formatted.replace(/<blockquote([^>]*)>/gi, (match, attrs) => {
    if (attrs.includes('style')) {
      const styleMatch = attrs.match(/style="([^"]*)"/);
      if (styleMatch && !styleMatch[1].includes('border-left')) {
        return `<blockquote${attrs.replace(/style="([^"]*)"/, `style="$1; margin: 1em 0; padding-left: 1em; border-left: 4px solid #e74c3c;"`)}>`;
      }
      return match;
    }
    return `<blockquote${attrs} style="margin: 1em 0; padding-left: 1em; border-left: 4px solid #e74c3c; color: #666;">`;
  });

  // Ensure line breaks are preserved and spaced
  formatted = formatted.replace(/<br\s*\/?\>/gi, '<br />');

  // Preserve styled horizontal rules (red lines used in preview)
  formatted = formatted.replace(/<hr\s*\/?\>/gi, '<hr style="border:0;border-top:2px solid #d72828;margin:0.6em 0;" />');

  // Detect divs or elements used as horizontal/red lines and add inline style
  // e.g. <div class="red-line"></div> or <div class="line"></div>
  formatted = formatted.replace(/<div([^>]*)class="([^"]*(?:red|line)[^"]*)"([^>]*)>\s*<\/div>/gi, '<div$1class="$2"$3 style="border-bottom:2px solid #d72828; margin:0.6em 0; height:0.4em;"></div>');

  // Preserve spacing in divs but don't override existing styles
  formatted = formatted.replace(/<div([^>]*)>/gi, (match, attrs) => {
    if (attrs.includes('style')) {
      return match;
    }
    return `<div${attrs} style="margin: 1em 0;">`;
  });

  // Preserve colors in spans and other elements
  formatted = formatted.replace(/<span([^>]*)style="([^\"]*)"([^>]*)>/gi, (match, pre, style, post) => {
    if (!style.includes('line-height')) {
      return `<span${pre}style="${style}; line-height: 1.6;"${post}>`;
    }
    return match;
  });

  // Handle mark/highlight elements
  formatted = formatted.replace(/<mark([^>]*)>/gi, (match, attrs) => {
    if (attrs.includes('style')) {
      return match;
    }
    return `<mark${attrs} style="background-color: #fff3cd; padding: 0.2em 0.4em;">`;
  });

  // If there are underlines implemented via border-bottom on spans/divs, preserve them
  formatted = formatted.replace(/<(span|div)([^>]*)style="([^\"]*)border-bottom:([^;\"]+)([^\"]*)"([^>]*)>/gi, (match) => {
    return match;
  });

  return formatted;
}

/**
 * Normalize HTML to ensure consistent formatting across different inputs
 */
export function normalizeHTML(html: string): string {
  if (!html) return '';

  let normalized = html;

  // Replace common spacing issues
  // Remove excessive whitespace between tags
  normalized = normalized.replace(/>\s+</g, '><');

  // Fix doubled line breaks (convert to single paragraph break)
  normalized = normalized.replace(/<\/p>\s*<p>/gi, '</p><p>');

  // Ensure proper document structure
  // Wrap loose text in paragraphs (but be careful with existing structure)
  normalized = normalized.replace(/([^>])\n([^<])/g, '$1\n<p>$2');

  return normalized;
}

/**
 * Add inline styles for proper rendering in the document
 * Similar to how the preview renders with prose classes
 */
export function addPreviewStyles(html: string): string {
  if (!html) return '';

  let styled = html;

  // Add global wrapper with proper font sizing and line height
  // This ensures everything renders like in the preview
  styled = `<div style="
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    font-size: 1rem;
    line-height: 1.6;
    color: #1f2937;
    word-wrap: break-word;
    overflow-wrap: break-word;
  ">
    ${styled}
  </div>`;

  return styled;
}

/**
 * Clean and format HTML content for insertion into the editor
 * This combines normalization, formatting, and styling
 * Preserves all formatting like red lines, colors, and rich text
 */
export function prepareHTMLForEditorInsertion(html: string): string {
  if (!html) return '';

  let prepared = html;

  // First normalize the structure
  prepared = normalizeHTML(prepared);

  // Then format for proper insertion (preserves colors and decorations)
  prepared = formatHTMLForInsertion(prepared);

  // Note: We don't add the global wrapper here because TipTap will handle
  // the styling. The inline styles added above are enough for preservation.

  return prepared;
}
