import axios from 'axios';

/**
 * Base API configuration
 * TODO: Replace with actual API URL in production
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

import { askAI, generateDocument, rewriteText, generateSection } from '@/config/ai';

/**
 * AI-related API calls using OpenRouter
 */
export const AI = {
  /**
   * Send a prompt to AI and get a response
   * @param prompt - The user's prompt
   * @returns AI response text
   */
  async ask(prompt: string): Promise<string> {
    if (import.meta.env.DEV) {
      console.log('[AI.ask] Prompt:', prompt);
    }
    return askAI([
      { role: 'system', content: 'You are a helpful AI assistant for document editing. Be concise and helpful.' },
      { role: 'user', content: prompt },
    ]);
  },

  /**
   * Generate a complete document based on wizard data
   * @param payload - Wizard form data and document type
   * @returns Generated document content
   */
  async generateDocument(payload: {
    type: string;
    data: Record<string, string>;
  }): Promise<string> {
    if (import.meta.env.DEV) {
      console.log('[AI.generateDocument] Payload:', payload);
    }
    return generateDocument(payload);
  },

  /**
   * Rewrite text with specified parameters
   * @param payload - Text and rewrite options
   * @returns Rewritten text
   */
  async rewrite(payload: {
    text: string;
    tone?: 'formal' | 'casual' | 'professional';
    action?: 'condense' | 'expand' | 'summarize' | 'fix-grammar';
  }): Promise<string> {
    if (import.meta.env.DEV) {
      console.log('[AI.rewrite] Payload:', payload);
    }
    return rewriteText(payload);
  },

  /**
   * Generate a new section based on context
   * @param context - Current document context
   * @param instruction - What to generate
   * @returns Generated section content
   */
  async generateSection(context: string, instruction: string): Promise<string> {
    if (import.meta.env.DEV) {
      console.log('[AI.generateSection]', { context, instruction });
    }
    return generateSection(context, instruction);
  },
};

/**
 * Document-related API calls
 * All functions are placeholders for future backend integration
 */
export const Document = {
  /**
   * Save a document to the backend
   * @param document - Document data to save
   * @returns Saved document with ID
   */
  async save(document: {
    id?: string;
    title: string;
    content?: string;
  }): Promise<{ id: string; savedAt: Date }> {
    if (import.meta.env.DEV) {
      console.log('[Document.save] Document:', document);
    }
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      id: document.id || Date.now().toString(),
      savedAt: new Date(),
    };
  },

  /**
   * Load a document from the backend
   * @param id - Document ID
   * @returns Document data
   */
  async load(id: string): Promise<{
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
  }> {
    if (import.meta.env.DEV) {
      console.log('[Document.load] ID:', id);
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      id,
      title: 'Loaded Document',
      content: '<p>This is placeholder document content.</p>',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  },

  /**
   * Delete a document
   * @param id - Document ID
   */
  async delete(id: string): Promise<void> {
    if (import.meta.env.DEV) {
      console.log('[Document.delete] ID:', id);
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  },

  /**
   * Export document to specified format
   * @param id - Document ID
   * @param format - Export format
   * @returns Download URL or blob
   */
  async export(
    id: string,
    format: 'docx' | 'pdf' | 'pptx'
  ): Promise<{ url: string }> {
    if (import.meta.env.DEV) {
      console.log('[Document.export]', { id, format });
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Placeholder - would return actual download URL
    return { url: '#' };
  },
};

/**
 * Template-related API calls
 */
export const Template = {
  /**
   * Get all available templates
   * @returns List of templates
   */
  async getAll(): Promise<
    Array<{
      id: string;
      title: string;
      description: string;
      previewImageUrl: string;
      category: string;
    }>
  > {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [
      {
        id: '1',
        title: 'Professional Resume',
        description: 'Clean and modern resume template',
        previewImageUrl: '/placeholder.svg',
        category: 'Career',
      },
      {
        id: '2',
        title: 'Business Proposal',
        description: 'Formal business proposal template',
        previewImageUrl: '/placeholder.svg',
        category: 'Business',
      },
      {
        id: '3',
        title: 'Project Report',
        description: 'Comprehensive project report template',
        previewImageUrl: '/placeholder.svg',
        category: 'Reports',
      },
    ];
  },

  /**
   * Clone a template to create a new document
   * @param templateId - Template ID to clone
   * @returns New document ID
   */
  async clone(templateId: string): Promise<{ documentId: string }> {
    if (import.meta.env.DEV) {
      console.log('[Template.clone] ID:', templateId);
    }
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { documentId: Date.now().toString() };
  },
};

export default api;
