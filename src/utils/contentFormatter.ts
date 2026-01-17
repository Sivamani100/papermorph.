/**
 * Utility to format HTML content for proper insertion into document editor
 * Preserves spacing, table formatting, colors, font sizes, weights, and all styling
 */

/**
 * Format HTML content to preserve exact preview appearance when inserted into editor
 * - Adds proper spacing preservation to paragraphs
 * - Ensures tables maintain their structure
 * - Preserves line heights, margins, colors, font sizes, and weights
 * - Maintains text decorations and formatting
 * - Keeps bold, italic, underline, and other character formatting
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
  
  // Preserve <b> and <i> tags
  formatted = formatted.replace(/<b([^>]*)>/gi, '<b style="font-weight: bold;">');
  formatted = formatted.replace(/<i([^>]*)>/gi, '<i style="font-style: italic;">');

  // Ensure paragraphs have proper spacing and preserve existing colors and font settings
  formatted = formatted.replace(/<p([^>]*)>/gi, (match, attrs) => {
    // Check if style already exists - preserve it, just add margin/line-height if needed
    if (attrs.includes('style')) {
      const styleMatch = attrs.match(/style="([^"]*)"/);
      if (styleMatch && !styleMatch[1].includes('margin') && !styleMatch[1].includes('line-height')) {
        return `<p${attrs.replace(/style="([^"]*)"/, `style="$1; margin: 0.5em 0; line-height: 1.6;"`)}>`;
      }
      return match;
    }
    return `<p${attrs} style="margin: 0.5em 0; line-height: 1.6;">`;
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
    return `<tr${attrs}>`;
  });

  // Ensure table cells have proper borders and padding
  formatted = formatted.replace(/<td([^>]*)>/gi, (match, attrs) => {
    if (attrs.includes('style')) {
      return match;
    }
    return `<td${attrs} style="border: 1px solid #ccc; padding: 8px; vertical-align: top;">`;
  });

  formatted = formatted.replace(/<th([^>]*)>/gi, (match, attrs) => {
    if (attrs.includes('style')) {
      return match;
    }
    return `<th${attrs} style="border: 1px solid #ccc; padding: 8px; vertical-align: top; font-weight: bold; background-color: #f5f5f5;">`;
  });

  // Ensure divs maintain proper spacing
  formatted = formatted.replace(/<div([^>]*)>/gi, (match, attrs) => {
    if (attrs.includes('style')) {
      if (!attrs.includes('margin')) {
        return `<div${attrs.replace(/style="([^"]*)"/, `style="$1; margin: 0.5em 0;"`)}>`;
      }
      return match;
    }
    return `<div${attrs} style="margin: 0.5em 0;">`;
  });

  // Ensure heading tags preserve their styling
  formatted = formatted.replace(/<h([1-6])([^>]*)>/gi, (match, level, attrs) => {
    if (attrs.includes('style')) {
      return match;
    }
    const sizes: {[key: string]: string} = { '1': '28px', '2': '24px', '3': '20px', '4': '16px', '5': '14px', '6': '12px' };
    return `<h${level}${attrs} style="font-weight: bold; margin: 0.5em 0; line-height: 1.4; font-size: ${sizes[level]};">`;
  });

  // Preserve line breaks with proper styling
  formatted = formatted.replace(/<br([^>]*)>/gi, '<br style="line-height: 1.6;">');

  return formatted;
}

/**
 * Prepare HTML content for editor insertion
 * This is the main export that other components will use
 */
export function prepareHTMLForEditorInsertion(html: string): string {
  return formatHTMLForInsertion(html);
}

/**
 * Clean and sanitize HTML for safe insertion
 */
export function cleanHTMLForInsertion(html: string): string {
  if (!html) return '';

  // Remove script tags and dangerous attributes
  let cleaned = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');

  return cleaned;
}
