import { create } from 'zustand';

export interface Document {
  id: string;
  title: string;
  content?: string;
  header?: string;
  footer?: string;
  pages?: PageContent[]; // New: array of page contents
  pageMargins?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  templateId?: string;
}

export interface PageContent {
  id: string;
  content: string;
  order: number;
}

interface DocState {
  currentDocument: Document | null;
  documents: Document[];
  saveStatus: 'saved' | 'saving' | 'unsaved';
  isLoading: boolean;
  
  setCurrentDocument: (doc: Document | null) => void;
  updateDocumentTitle: (title: string) => void;
  updateDocument: (updates: Partial<Document>) => void;
  createNewDocument: () => void;
  createDocumentWithContent: (title?: string, content?: string, templateId?: string) => void;
  saveDocument: () => Promise<void>;
  loadDocument: (id: string) => Promise<void>;
  loadAllDocuments: () => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  autoSave: () => (() => void) | void;
  recoverUnsavedDocument: (id: string) => boolean;
  
  // Multi-page functions
  addPage: (content?: string) => void;
  removePage: (pageId: string) => void;
  updatePageContent: (pageId: string, content: string) => void;
  reorderPages: (fromIndex: number, toIndex: number) => void;
  getPageContent: (pageId: string) => string | undefined;
  getAllPages: () => PageContent[];
}

const DUMMY_DOCUMENTS: Document[] = [
  {
    id: '1',
    title: 'Project Proposal Q1 2025',
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-28'),
  },
  {
    id: '2',
    title: 'Meeting Notes - Product Team',
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date('2025-01-27'),
  },
  {
    id: '3',
    title: 'Technical Documentation Draft',
    createdAt: new Date('2025-01-22'),
    updatedAt: new Date('2025-01-26'),
  },
  {
    id: '4',
    title: 'Marketing Strategy 2025',
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-25'),
  },
];

export const useDocStore = create<DocState>((set, get) => ({
  currentDocument: null,
  documents: DUMMY_DOCUMENTS,
  saveStatus: 'saved',
  isLoading: false,

  setCurrentDocument: (doc) => set({ currentDocument: doc }),

  updateDocumentTitle: (title) => {
    const current = get().currentDocument;
    if (current) {
      set({
        currentDocument: { ...current, title, updatedAt: new Date() },
        saveStatus: 'unsaved',
      });
    }
  },

  updateDocument: (updates) => {
    const current = get().currentDocument;
    if (current) {
      set({
        currentDocument: { ...current, ...updates, updatedAt: new Date() },
        saveStatus: 'unsaved',
      });
    }
  },

  createNewDocument: () => {
    const firstPageId: string = Date.now().toString();
    const newDoc: Document = {
      id: Date.now().toString(),
      title: 'Untitled Document',
      content: '<p></p>',
      header: '<p></p>',
      footer: '<p></p>',
      pages: [
        {
          id: firstPageId,
          content: '<p></p>',
          order: 0
        }
      ],
      pageMargins: {
        top: '25.4mm',
        bottom: '25.4mm',
        left: '25.4mm',
        right: '25.4mm',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((state) => ({
      currentDocument: newDoc,
      documents: [newDoc, ...state.documents],
      saveStatus: 'unsaved',
    }));
  },

  createDocumentWithContent: (title = 'Untitled Document', content = '<p></p>', templateId) => {
    const newDoc: Document = {
      id: Date.now().toString(),
      title: title || 'Untitled Document',
      content,
      header: '<p></p>',
      footer: '<p></p>',
      templateId,
      pageMargins: {
        top: '25.4mm',
        bottom: '25.4mm',
        left: '25.4mm',
        right: '25.4mm',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((state) => ({
      currentDocument: newDoc,
      documents: [newDoc, ...state.documents],
      saveStatus: 'unsaved',
    }));
  },

  saveDocument: async () => {
    const { currentDocument } = get();
    if (!currentDocument) {
      console.warn('No document to save');
      return;
    }

    set({ saveStatus: 'saving' });
    
    try {
      // Improved error handling with retry mechanism
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              // Reduced failure rate for better UX
              if (Math.random() < 0.02) { // 2% chance of failure
                reject(new Error('Network error'));
              } else {
                resolve(undefined);
              }
            }, 800);
            
            // Add cleanup for timeout
            return () => clearTimeout(timeout);
          });
          break; // Success, exit retry loop
        } catch (error) {
          retryCount++;
          if (retryCount >= maxRetries) {
            throw error;
          }
          // Wait before retry with exponential backoff
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }
      
      // Update the document in the documents array
      set((state) => ({
        saveStatus: 'saved',
        documents: state.documents.map(doc => 
          doc.id === currentDocument.id 
            ? { ...currentDocument, updatedAt: new Date() }
            : doc
        )
      }));
      
      // Auto-save to localStorage as backup
      try {
        localStorage.setItem(`pm:doc:${currentDocument.id}`, JSON.stringify(currentDocument));
      } catch (storageError) {
        console.warn('Failed to backup to localStorage:', storageError);
      }
      
    } catch (error) {
      console.error('Save failed:', error);
      set({ saveStatus: 'unsaved' });
      
      // Better error notification
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        const errorEvent = new CustomEvent('documentSaveError', {
          detail: { 
            message: error instanceof Error ? error.message : 'Failed to save document',
            documentId: currentDocument.id
          }
        });
        window.dispatchEvent(errorEvent);
      }
      
      throw error;
    }
  },

  loadDocument: async (id) => {
    set({ isLoading: true });
    try {
      // Try to load from localStorage backup first
      const backupDoc = localStorage.getItem(`pm:doc:${id}`);
      if (backupDoc) {
        try {
          const parsedDoc = JSON.parse(backupDoc);
          set({ currentDocument: parsedDoc, isLoading: false });
          return;
        } catch (parseError) {
          console.warn('Failed to parse backup document:', parseError);
        }
      }
      
      // Fallback to simulated API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      const doc = get().documents.find((d) => d.id === id);
      set({ currentDocument: doc || null, isLoading: false });
    } catch (error) {
      console.error('Load document failed:', error);
      set({ isLoading: false, currentDocument: null });
      throw error;
    }
  },

  loadAllDocuments: async () => {
    set({ isLoading: true });
    try {
      // Try to restore from localStorage backups
      const restoredDocs: Document[] = [];
      
      for (const dummyDoc of DUMMY_DOCUMENTS) {
        const backupDoc = localStorage.getItem(`pm:doc:${dummyDoc.id}`);
        if (backupDoc) {
          try {
            const parsedDoc = JSON.parse(backupDoc);
            restoredDocs.push(parsedDoc);
          } catch (parseError) {
            console.warn(`Failed to parse backup document ${dummyDoc.id}:`, parseError);
            restoredDocs.push(dummyDoc);
          }
        } else {
          restoredDocs.push(dummyDoc);
        }
      }
      
      set({ documents: restoredDocs, isLoading: false });
    } catch (error) {
      console.error('Load all documents failed:', error);
      set({ documents: DUMMY_DOCUMENTS, isLoading: false });
    }
  },

  deleteDocument: async (id) => {
    try {
      // Remove from localStorage backup
      try {
        localStorage.removeItem(`pm:doc:${id}`);
      } catch (storageError) {
        console.warn('Failed to remove backup from localStorage:', storageError);
      }
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      set((state) => ({
        documents: state.documents.filter((d) => d.id !== id),
        currentDocument: state.currentDocument?.id === id ? null : state.currentDocument,
      }));
    } catch (error) {
      console.error('Delete document failed:', error);
      throw error;
    }
  },

  // Auto-save functionality
  autoSave: () => {
    const { currentDocument, saveStatus } = get();
    if (!currentDocument || saveStatus === 'saved') return;
    
    // Debounced auto-save
    const saveTimeout = setTimeout(async () => {
      try {
        await get().saveDocument();
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, 2000);
    
    return () => clearTimeout(saveTimeout);
  },

  // Recover unsaved document
  recoverUnsavedDocument: (id: string) => {
    try {
      const backup = localStorage.getItem(`pm:doc:${id}`);
      if (backup) {
        const doc = JSON.parse(backup);
        set({ currentDocument: doc, saveStatus: 'unsaved' });
        return true;
      }
    } catch (error) {
      console.error('Recovery failed:', error);
    }
    return false;
  },

  // Multi-page functions
  addPage: (content = '<p></p>') => {
    const current = get().currentDocument;
    if (!current) return;
    
    const newPage: PageContent = {
      id: Date.now().toString(),
      content,
      order: (current.pages?.length || 0)
    };
    
    const updatedPages = [...(current.pages || []), newPage];
    set({
      currentDocument: { ...current, pages: updatedPages, updatedAt: new Date() },
      saveStatus: 'unsaved',
    });
  },

  removePage: (pageId: string) => {
    const current = get().currentDocument;
    if (!current || !current.pages) return;
    
    // Don't allow removing the last page
    if (current.pages.length <= 1) return;
    
    const updatedPages = current.pages
      .filter(page => page.id !== pageId)
      .map((page, index) => ({ ...page, order: index }));
    
    set({
      currentDocument: { ...current, pages: updatedPages, updatedAt: new Date() },
      saveStatus: 'unsaved',
    });
  },

  updatePageContent: (pageId: string, content: string) => {
    const current = get().currentDocument;
    if (!current || !current.pages) return;
    
    const updatedPages = current.pages.map(page =>
      page.id === pageId ? { ...page, content } : page
    );
    
    set({
      currentDocument: { ...current, pages: updatedPages, updatedAt: new Date() },
      saveStatus: 'unsaved',
    });
  },

  reorderPages: (fromIndex: number, toIndex: number) => {
    const current = get().currentDocument;
    if (!current || !current.pages) return;
    
    const pages = [...current.pages];
    const [movedPage] = pages.splice(fromIndex, 1);
    pages.splice(toIndex, 0, movedPage);
    
    // Update order numbers
    const reorderedPages = pages.map((page, index) => ({ ...page, order: index }));
    
    set({
      currentDocument: { ...current, pages: reorderedPages, updatedAt: new Date() },
      saveStatus: 'unsaved',
    });
  },

  getPageContent: (pageId: string) => {
    const current = get().currentDocument;
    if (!current || !current.pages) return undefined;
    
    const page = current.pages.find(p => p.id === pageId);
    return page?.content;
  },

  getAllPages: () => {
    const current = get().currentDocument;
    if (!current || !current.pages) return [];
    
    return [...current.pages].sort((a, b) => a.order - b.order);
  },
}));
