import { Document } from './api';

/**
 * Document action helpers
 * These functions wrap API calls with additional UI logic
 */

/**
 * Download document in specified format
 * @param documentId - Document ID
 * @param format - Export format
 */
export async function downloadDocument(
  documentId: string,
  format: 'docx' | 'pdf' | 'pptx'
): Promise<void> {
  try {
    const { url } = await Document.export(documentId, format);
    
    // In production, this would trigger actual download
    // For now, just log and show placeholder behavior
    console.log(`[downloadDocument] Would download from: ${url}`);
    
    // Placeholder: Create a dummy download
    const filename = `document.${format}`;
    console.log(`[downloadDocument] Downloading as: ${filename}`);
    
    // TODO: Implement actual file download when backend is ready
    // const link = document.createElement('a');
    // link.href = url;
    // link.download = filename;
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
  } catch (error) {
    console.error('[downloadDocument] Error:', error);
    throw error;
  }
}

/**
 * Auto-save document with debounce
 * @param documentId - Document ID
 * @param content - Document content
 * @param onStatusChange - Callback for save status updates
 */
let saveTimeout: NodeJS.Timeout | null = null;

export function autoSaveDocument(
  documentId: string,
  content: string,
  onStatusChange: (status: 'saving' | 'saved' | 'error') => void
): void {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }

  saveTimeout = setTimeout(async () => {
    try {
      onStatusChange('saving');
      await Document.save({ id: documentId, title: '', content });
      onStatusChange('saved');
    } catch (error) {
      console.error('[autoSaveDocument] Error:', error);
      onStatusChange('error');
    }
  }, 2000); // 2 second debounce
}

/**
 * Insert content at current cursor position in editor
 * This is a placeholder that would integrate with ONLYOFFICE API
 * @param content - Content to insert
 */
export function insertAtCursor(content: string): void {
  console.log('[insertAtCursor] Would insert:', content);
  // TODO: Integrate with ONLYOFFICE API to insert content at cursor
  // This would use the ONLYOFFICE JavaScript API methods
}

/**
 * Get selected text from editor
 * This is a placeholder that would integrate with ONLYOFFICE API
 * @returns Selected text
 */
export function getSelectedText(): string {
  console.log('[getSelectedText] Getting selected text from editor');
  // TODO: Integrate with ONLYOFFICE API to get selection
  return 'Placeholder selected text';
}

/**
 * Replace selected text in editor
 * This is a placeholder that would integrate with ONLYOFFICE API
 * @param newText - Text to replace selection with
 */
export function replaceSelectedText(newText: string): void {
  console.log('[replaceSelectedText] Would replace with:', newText);
  // TODO: Integrate with ONLYOFFICE API to replace selection
}

/**
 * Format options for text styling
 */
export interface FormatOptions {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  alignment?: 'left' | 'center' | 'right' | 'justify';
}

/**
 * Apply formatting to selected text
 * @param options - Formatting options
 */
export function applyFormatting(options: FormatOptions): void {
  console.log('[applyFormatting] Would apply:', options);
  // TODO: Integrate with ONLYOFFICE API for formatting
}
