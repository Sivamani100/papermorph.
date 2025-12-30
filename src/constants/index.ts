/**
 * Application constants
 */

export const APP_NAME = 'Papermorph';
export const APP_DESCRIPTION = 'AI-powered document editor';

/**
 * API endpoints (placeholders)
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },
  DOCUMENTS: {
    LIST: '/documents',
    GET: '/documents/:id',
    CREATE: '/documents',
    UPDATE: '/documents/:id',
    DELETE: '/documents/:id',
    EXPORT: '/documents/:id/export',
  },
  AI: {
    CHAT: '/ai/chat',
    GENERATE: '/ai/generate',
    REWRITE: '/ai/rewrite',
  },
  TEMPLATES: {
    LIST: '/templates',
    GET: '/templates/:id',
    CLONE: '/templates/:id/clone',
  },
};

/**
 * ONLYOFFICE configuration
 */
export const ONLYOFFICE_CONFIG = {
  // Document server URL can be configured via env; fallback is a placeholder
  DOCUMENT_SERVER_URL: import.meta.env.VITE_ONLYOFFICE_URL || 'https://documentserver.example.com',
  
  // Editor configuration defaults
  EDITOR_CONFIG: {
    width: '100%',
    height: '100%',
    type: 'desktop',
    documentType: 'word',
    editorConfig: {
      mode: 'edit',
      lang: 'en',
      customization: {
        autosave: true,
        chat: false,
        comments: true,
        compactHeader: true,
        compactToolbar: false,
        feedback: false,
        forcesave: false,
        help: true,
        hideRightMenu: false,
        hideRulers: false,
        integrationMode: 'embed',
        macros: false,
        macrosMode: 'disable',
        mentionShare: false,
        plugins: true,
        reviewDisplay: 'original',
        showReviewChanges: false,
        spellcheck: true,
        toolbarNoTabs: false,
        unit: 'inch',
        zoom: 100,
      },
    },
  },
};

/**
 * Sidebar tab definitions
 */
export const LEFT_SIDEBAR_TABS = [
  { id: 'templates', label: 'Templates', icon: 'FileText' },
  { id: 'tools', label: 'Tools', icon: 'PenTool' },
  { id: 'styles', label: 'Styles & Themes', icon: 'Palette' },
  { id: 'images', label: 'Images & Diagrams', icon: 'Image' },
  { id: 'citations', label: 'Citations', icon: 'Bookmark' },
  { id: 'advanced', label: 'Advanced', icon: 'Wand2' },
  { id: 'documents', label: 'My Documents', icon: 'FolderOpen' },
] as const;

/**
 * AI action types
 */
export const AI_ACTIONS = [
  { id: 'generate', label: 'Generate Section', icon: 'Sparkles' },
  { id: 'formal', label: 'Rewrite Formal', icon: 'GraduationCap' },
  { id: 'grammar', label: 'Fix Grammar', icon: 'Check' },
  { id: 'condense', label: 'Condense', icon: 'Minimize2' },
  { id: 'expand', label: 'Expand', icon: 'Maximize2' },
  { id: 'summarize', label: 'Summarize', icon: 'FileText' },
] as const;

/**
 * Document wizard types
 */
export const WIZARD_TYPES = [
  { id: 'letter', label: 'Letter Generator', icon: 'Mail' },
  { id: 'report', label: 'Report Generator', icon: 'FileBarChart' },
  { id: 'proposal', label: 'Proposal Generator', icon: 'Presentation' },
  { id: 'essay', label: 'Essay Generator', icon: 'BookOpen' },
] as const;

/**
 * Export format options
 */
export const EXPORT_FORMATS = [
  { id: 'docx', label: 'Word Document (.docx)', icon: 'FileText' },
  { id: 'pdf', label: 'PDF Document (.pdf)', icon: 'FileType' },
  { id: 'pptx', label: 'PowerPoint (.pptx)', icon: 'Presentation' },
] as const;
