import React, { useRef, useState, useCallback, useEffect } from 'react';
import { DocumentEditorContainerComponent, Toolbar } from '@syncfusion/ej2-react-documenteditor';
import { Topbar } from './Topbar';
import { SidebarLeft } from './SidebarLeft';
import { SidebarRight } from './SidebarRight';
import MainToolbar from './editor/Toolbar';
import StatusBar from './StatusBar';
import { useEditorStore } from '@/state/useEditorStore';
import { useUserStore } from '@/state/useUserStore';

// Inject Toolbar module
DocumentEditorContainerComponent.Inject(Toolbar);

const DocumentEditor: React.FC = () => {
  const editorRef = useRef<DocumentEditorContainerComponent | null>(null);
  const { setEditor } = useEditorStore();
  const { theme } = useUserStore();
  const [documentName, setDocumentName] = useState('Untitled Document');
  const [isSaved, setIsSaved] = useState(true);
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(2);
  const [isReady, setIsReady] = useState(false);
  const [activeFormats, setActiveFormats] = useState<string[]>([]);
  const [selectedFont, setSelectedFont] = useState('Inter');
  const [selectedFontSize, setSelectedFontSize] = useState('12');

  // Apply theme from global store
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Handle content change
  const handleContentChange = useCallback(() => {
    if (editorRef.current?.documentEditor) {
      const editor = editorRef.current.documentEditor;
      setTotalPages(editor.pageCount || 1);
      setIsSaved(false);
      
      // Get word count from content
      try {
        const content = editor.serialize();
        const text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        setWordCount(text ? text.split(' ').length : 0);
        setCharacterCount(text.length);
      } catch {
        // Silent fail
      }
    }
  }, []);

  // Save document
  const handleSave = useCallback(() => {
    if (editorRef.current?.documentEditor) {
      const editor = editorRef.current.documentEditor;
      const content = editor.serialize();
      localStorage.setItem('autosave_document', content);
      localStorage.setItem('autosave_name', documentName);
      setIsSaved(true);
    }
  }, [documentName]);

  // Export as DOCX
  const handleExportDocx = useCallback(() => {
    if (editorRef.current?.documentEditor) {
      editorRef.current.documentEditor.save(documentName, 'Docx');
      setIsSaved(true);
    }
  }, [documentName]);

  // Export as PDF (uses DOCX as fallback)
  const handleExportPdf = useCallback(() => {
    if (editorRef.current?.documentEditor) {
      // PDF export requires server-side conversion
      // For now, export as DOCX
      editorRef.current.documentEditor.save(documentName, 'Docx');
    }
  }, [documentName]);

  // Handle toolbar actions
  const handleToolbarAction = useCallback((action: string, value?: string) => {
    if (!editorRef.current?.documentEditor) return;
    
    const editor = editorRef.current.documentEditor;
    const selection = editor.selection;
    const editorModule = editor.editor;
    
    switch (action) {
      case 'undo':
        editor.editorHistory?.undo();
        break;
      case 'redo':
        editor.editorHistory?.redo();
        break;
      case 'bold':
        if (selection?.characterFormat) {
          selection.characterFormat.bold = !selection.characterFormat.bold;
        }
        break;
      case 'italic':
        if (selection?.characterFormat) {
          selection.characterFormat.italic = !selection.characterFormat.italic;
        }
        break;
      case 'underline':
        if (selection?.characterFormat) {
          selection.characterFormat.underline = selection.characterFormat.underline === 'Single' ? 'None' : 'Single';
        }
        break;
      case 'strikethrough':
        if (selection?.characterFormat) {
          selection.characterFormat.strikethrough = selection.characterFormat.strikethrough === 'SingleStrike' ? 'None' : 'SingleStrike';
        }
        break;
      case 'subscript':
        if (selection?.characterFormat) {
          selection.characterFormat.baselineAlignment = selection.characterFormat.baselineAlignment === 'Subscript' ? 'Normal' : 'Subscript';
        }
        break;
      case 'superscript':
        if (selection?.characterFormat) {
          selection.characterFormat.baselineAlignment = selection.characterFormat.baselineAlignment === 'Superscript' ? 'Normal' : 'Superscript';
        }
        break;
      case 'h1':
        if (selection?.paragraphFormat) {
          selection.paragraphFormat.styleName = 'Heading 1';
        }
        break;
      case 'h2':
        if (selection?.paragraphFormat) {
          selection.paragraphFormat.styleName = 'Heading 2';
        }
        break;
      case 'h3':
        if (selection?.paragraphFormat) {
          selection.paragraphFormat.styleName = 'Heading 3';
        }
        break;
      case 'alignLeft':
        if (selection?.paragraphFormat) {
          selection.paragraphFormat.textAlignment = 'Left';
        }
        break;
      case 'alignCenter':
        if (selection?.paragraphFormat) {
          selection.paragraphFormat.textAlignment = 'Center';
        }
        break;
      case 'alignRight':
        if (selection?.paragraphFormat) {
          selection.paragraphFormat.textAlignment = 'Right';
        }
        break;
      case 'alignJustify':
        if (selection?.paragraphFormat) {
          selection.paragraphFormat.textAlignment = 'Justify';
        }
        break;
      case 'orderedList':
        if (selection?.paragraphFormat) {
          editorModule?.applyNumbering('%1.');
        }
        break;
      case 'unorderedList':
        if (selection?.paragraphFormat) {
          editorModule?.applyBullet('\uf0b7', 'Symbol');
        }
        break;
      case 'horizontalRule':
        editorModule?.insertText('─'.repeat(50));
        editorModule?.insertText('\n');
        break;
      case 'link':
        const url = prompt('Enter URL:');
        if (url) {
          editorModule?.insertHyperlink(url, selection?.text || url);
        }
        break;
      case 'image':
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e: Event) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              const base64 = reader.result as string;
              editor.editor?.insertImage(base64, 400, 300);
            };
            reader.readAsDataURL(file);
          }
        };
        input.click();
        break;
      case 'table':
        const rows = prompt('Number of rows:', '3');
        const columns = prompt('Number of columns:', '3');
        if (rows && columns) {
          const rowCount = parseInt(rows);
          const colCount = parseInt(columns);
          if (!isNaN(rowCount) && !isNaN(colCount) && rowCount > 0 && colCount > 0) {
            editor.editor?.insertTable(rowCount, colCount);
          }
        }
        break;
      case 'insertRow':
        editor.editor?.insertRow();
        break;
      case 'insertColumn':
        editor.editor?.insertColumn();
        break;
      case 'deleteRow':
        editor.editor?.deleteRow();
        break;
      case 'deleteColumn':
        editor.editor?.deleteColumn();
        break;
      case 'comment':
        editorRef.current?.documentEditor?.editor?.insertComment('');
        break;
      case 'highlight':
        if (selection?.characterFormat) {
          selection.characterFormat.highlightColor = selection.characterFormat.highlightColor === 'Yellow' ? 'NoColor' : 'Yellow';
        }
        break;
      case 'fontFamily':
        if (value && selection?.characterFormat) {
          selection.characterFormat.fontFamily = value;
          setSelectedFont(value);
        }
        break;
      case 'fontSize':
        if (value && selection?.characterFormat) {
          selection.characterFormat.fontSize = parseFloat(value);
          setSelectedFontSize(value);
        }
        break;
      case 'quote':
        if (selection?.paragraphFormat) {
          selection.paragraphFormat.leftIndent = 36;
        }
        break;
      case 'code':
        if (selection?.characterFormat) {
          selection.characterFormat.fontFamily = 'Consolas';
        }
        break;
      default:
        console.log('Action:', action);
    }
  }, []);

  // Apply AI content
  const handleApplyAIContent = useCallback((content: string) => {
    if (editorRef.current?.documentEditor) {
      editorRef.current.documentEditor.editor?.insertText(content);
    }
  }, []);

  // Editor ready - enable paste
  const handleEditorReady = useCallback(() => {
    setIsReady(true);
    
    // Set editor in store
    if (editorRef.current) {
      setEditor(editorRef.current);
    }
    
    // Focus the editor to enable paste
    if (editorRef.current?.documentEditor) {
      editorRef.current.documentEditor.focusIn();
    }
  }, [setEditor]);

  // Handle paste from clipboard
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      if (!editorRef.current?.documentEditor) return;
      
      const editor = editorRef.current.documentEditor;
      const clipboardData = e.clipboardData;
      
      if (clipboardData) {
        // Check for HTML content first
        const html = clipboardData.getData('text/html');
        const text = clipboardData.getData('text/plain');
        
        if (text) {
          // Let Syncfusion handle the paste if editor is focused
          // Otherwise, manually insert text
          if (document.activeElement?.closest('#documentEditor')) {
            return; // Let Syncfusion handle it
          }
          
          e.preventDefault();
          editor.editor?.insertText(text);
        }
      }
    };

    // Handle AI content application
    const handleApplyToDocument = (event: Event) => {
      const customEvent = event as CustomEvent<{ content: string }>;
      const content = customEvent.detail?.content;
      if (content && editorRef.current?.documentEditor) {
        editorRef.current.documentEditor.editor?.insertText(content);
      }
    };

    document.addEventListener('paste', handlePaste);
    window.addEventListener('applyToDocument', handleApplyToDocument);
    
    return () => {
      document.removeEventListener('paste', handlePaste);
      window.removeEventListener('applyToDocument', handleApplyToDocument);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Top Toolbar */}
      <div className="flex-shrink-0">
        <Topbar />
      </div>

      {/* Main Content Area with Sidebars attached to topbar */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left Sidebar - Full height attached to topbar */}
        <div className="flex flex-col">
          <SidebarLeft />
        </div>

        {/* Center Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Ribbon Toolbar - Between sidebars */}
          <div className={`flex-shrink-0 border-b transition-colors ${
            theme === 'dark' ? 'bg-[#000000] border-gray-800' : 'bg-[#ffffff] border-gray-200'
          }`}>
            <MainToolbar 
              onAction={handleToolbarAction} 
              activeFormats={activeFormats}
              selectedFont={selectedFont}
              selectedFontSize={selectedFontSize}
            />
          </div>

          {/* Document Canvas */}
          <div className={`flex-1 min-h-0 transition-colors ${
            theme === 'dark' ? 'bg-[#000000]' : 'bg-[#ffffff]'
          }`}>
            <div className="h-full w-full flex items-center justify-center p-4">
              <div className={`w-full h-full max-w-6xl rounded-lg shadow-xl overflow-hidden transition-colors ${
                theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-[#ffffff]'
              }`}>
                <DocumentEditorContainerComponent
                  ref={editorRef}
                  id="documentEditor"
                  style={{ display: 'block', height: '100%', direction: 'ltr' }}
                  enableToolbar={false}
                  showPropertiesPane={false}
                  enableLocalPaste={true}
                  enableSpellCheck={false}
                  enableComment={true}
                  enableTrackChanges={false}
                  created={handleEditorReady}
                  contentChange={handleContentChange}
                />
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <StatusBar
            currentPage={currentPage}
            totalPages={totalPages}
            wordCount={wordCount}
            characterCount={characterCount}
            documentName={documentName}
          />
        </div>

        {/* Right Sidebar - Full height attached to topbar */}
        <div className="flex flex-col">
          <SidebarRight />
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;
